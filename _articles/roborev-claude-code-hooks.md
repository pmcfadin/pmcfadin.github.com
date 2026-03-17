---
layout: article
title: "How to Set Up Automated Code Review for Claude Code with RoboRev"
date: 2026-03-17
category: AI Engineering
reading_time: 10
excerpt: "Every commit your AI coding agent makes should go through review before it moves on. Here's how to wire RoboRev into Claude Code's hook system so every commit gets reviewed, and bad ones get fixed automatically."
---

If you're letting Claude Code work autonomously on your codebase, you've probably had that moment where you come back to find a chain of commits and think: "wait, who reviewed any of this?" The answer, usually, is nobody.

That's the gap I wanted to close. Every commit Claude Code makes in my projects now goes through an automated code review before it can continue. If the review fails, Claude sees the feedback, fixes the issues, and recommits without human intervention. The whole thing runs on Claude Code's hook system and a tool called [RoboRev](https://roborev.dev).

Here's how to set it up yourself.

## Why You Need a Quality Gate

When an AI agent works autonomously, it can introduce bugs, security issues, or style violations without anyone noticing until PR review. Or worse, production. You need something that catches problems at commit time, not after the agent has built three more features on top of a flawed foundation.

The fix is a blocking review hook. Every time Claude runs `git commit`, the hook:

1. Sends the commit to RoboRev for review
2. Waits for the verdict
3. Injects the result back into Claude's conversation context
4. If the review fails, Claude sees the feedback and instructions to fix and recommit

This creates a feedback loop: **commit > review > fail > fix > recommit > review > pass > continue**.

## How the Pieces Fit Together

Three files make this work inside your project's `.claude/` directory:

```
.claude/
├── hooks.json                # Hook definition (what triggers, when, how)
├── hooks/
│   └── roborev-review.sh     # The script that runs RoboRev
├── settings.json             # Project-wide permissions (checked into git)
└── settings.local.json       # Local overrides that extend hooks.json
```

If you're not familiar with Claude Code hooks, here's the short version: Claude Code has an event system. When certain things happen (a tool is used, a notification fires, the agent stops) Claude Code can run shell commands and feed their output back into the conversation.

The key events are `PreToolUse` (before a tool executes), `PostToolUse` (after a tool executes), `Notification`, and `Stop`. We use `PostToolUse` because we want to review the commit *after* it lands, then give Claude feedback to act on.

Claude Code reads settings files in order, merging them. `settings.json` is project-level config checked into git. `settings.local.json` is personal overrides, typically gitignored. This is where hooks live since hook paths can be machine-specific.

## Prerequisites

Before you start, you'll need:

- [Claude Code](https://docs.anthropic.com/en/docs/claude-code) installed and working
- [RoboRev](https://roborev.dev) installed with `roborev daemon` running
- `jq` installed (used for JSON parsing in the hook script)

## Step 1: Create the Hook Definition

Create `.claude/hooks.json` in your project:

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Bash",
        "hooks": [
          {
            "type": "command",
            "command": "\"$CLAUDE_PROJECT_DIR\"/.claude/hooks/roborev-review.sh",
            "timeout": 120,
            "statusMessage": "Waiting for RoboRev review..."
          }
        ]
      }
    ]
  }
}
```

A few things to note:

- **`matcher: "Bash"`** fires the hook after every Bash tool call. The script itself filters for `git commit` commands, which I'll explain below.
- **`$CLAUDE_PROJECT_DIR`** is an environment variable Claude Code sets to the project root. Use it instead of hardcoded paths so the hook works regardless of where the project lives on disk.
- **`timeout: 120`** gives RoboRev two minutes. Reviews typically take 10-60 seconds depending on diff size, so this is plenty of headroom.
- **`statusMessage`** shows in the Claude Code UI while the hook runs, so you know something is happening.

## Step 2: Create the Hook Script

Create `.claude/hooks/roborev-review.sh`:

```bash
#!/bin/bash
# Post-tool hook: run RoboRev review after git commits
# Receives JSON on stdin with tool_input.command
# Returns structured JSON with additionalContext for Claude Code

COMMAND=$(jq -r '.tool_input.command // ""')

# Only trigger on git commit commands
if ! echo "$COMMAND" | grep -qE '(^|/)git\s+commit(\s|$)'; then
  exit 0
fi

# Skip if roborev is not installed
command -v roborev >/dev/null || exit 0

# Run review, capture output
REVIEW_OUTPUT=$(roborev review --wait 2>&1) || true

# Extract job ID from first line: "Enqueued job 42 for ..."
JOB_ID=$(echo "$REVIEW_OUTPUT" | head -1 | grep -oE 'job [0-9]+' | grep -oE '[0-9]+')

if [ -z "$JOB_ID" ]; then
  jq -n --arg review "$REVIEW_OUTPUT" '{
    "hookSpecificOutput": {
      "hookEventName": "PostToolUse",
      "additionalContext": ("RoboRev Code Review (unable to parse verdict):\n" + $review)
    }
  }'
  exit 0
fi

# Get structured verdict
VERDICT=$(roborev show --json "$JOB_ID" 2>/dev/null | jq -r '.verdict_bool // 0')
REVIEW_TEXT=$(roborev show "$JOB_ID" 2>/dev/null)

if [ "$VERDICT" = "1" ]; then
  jq -n '{
    "hookSpecificOutput": {
      "hookEventName": "PostToolUse",
      "additionalContext": "RoboRev Code Review: PASSED. No issues found."
    }
  }'
else
  jq -n --arg review "$REVIEW_TEXT" '{
    "hookSpecificOutput": {
      "hookEventName": "PostToolUse",
      "additionalContext": ("RoboRev Code Review: FAILED\n\n" + $review + "\n\nINSTRUCTION: The code review found issues. Fix the problems identified above, then create a new commit with the fixes. Do not amend the previous commit.")
    }
  }'
fi
```

Then make it executable:

```bash
chmod +x .claude/hooks/roborev-review.sh
```

### What the Script Does

The script reads JSON from stdin. Claude Code pipes in details about the tool call that just happened. It extracts the command with `jq`, checks if it's a `git commit`, and bails out early if not.

The commit filter regex is intentionally precise. `(^|/)git\s+commit(\s|$)` matches "git" at the start of the command or after a path separator (for `/usr/bin/git`), requires "commit" as the subcommand (not `commit-msg` or similar), and ensures it's followed by whitespace or end-of-string. No false positives.

The fallback line, `command -v roborev >/dev/null || exit 0`, means team members without RoboRev installed can still use the project. The hook simply does nothing.

After running `roborev review --wait`, the script parses the job ID, fetches the structured verdict, and returns JSON in the format Claude Code expects. The important piece is `hookSpecificOutput.additionalContext`. That's how you talk back to Claude through a hook. Any text you put there appears in Claude's conversation context.

On failure, the injected context includes an explicit instruction: "Fix the problems identified above, then create a new commit with the fixes. Do not amend the previous commit." The "do not amend" part matters because it preserves git history and prevents Claude from squashing the fix into the original commit.

## Step 3: Wire It Into Settings

In `.claude/settings.local.json`, add the hooks config:

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Bash",
        "hooks": [
          {
            "type": "command",
            "command": "\"$CLAUDE_PROJECT_DIR\"/.claude/hooks/roborev-review.sh",
            "timeout": 120,
            "statusMessage": "Waiting for RoboRev review..."
          }
        ]
      }
    ]
  }
}
```

Since `settings.local.json` is typically gitignored (it contains machine-specific paths and personal preferences), each developer adds this themselves. The hook script itself gets checked into git so the team shares the same review logic.

## Step 4: Verify It Works

Start a Claude Code session and make a commit. You should see the status message "Waiting for RoboRev review..." followed by either a pass confirmation or a detailed review with fix instructions.

## The Feedback Loop in Action

Here's what a typical failure-and-fix cycle looks like:

```
Claude: git commit -m "feat: add user preferences endpoint"
  Hook: roborev review --wait
  Hook: FAIL - "SQL injection risk in query parameter handling"
Claude: [sees review in context, fixes the issue]
Claude: git commit -m "fix: parameterize SQL query in preferences endpoint"
  Hook: roborev review --wait
  Hook: PASS
Claude: [continues with next task]
```

The loop runs automatically. Claude sees the review failure as conversation context, understands the issue, applies a fix, and commits again. The second commit triggers another review. In practice, most issues resolve in one fix cycle. Occasionally it takes two.

## Customization Ideas

**Adjust the timeout** if your reviews consistently take longer than 120 seconds (large diffs, slow network):

```json
"timeout": 300
```

**Skip reviews for documentation-only changes** by adding a filter to the script:

```bash
# Skip if only markdown files changed
if git diff --name-only HEAD~1 HEAD | grep -qvE '\.md$'; then
  :  # Non-markdown files changed, proceed
else
  exit 0
fi
```

**Swap in a different review tool.** The pattern works for anything that can review a commit and return a verdict. Replace the RoboRev commands with your tool's equivalents.

**Configure the reviewing agent.** RoboRev supports multiple AI backends (Claude, Gemini, Codex, and others). Run `roborev check-agents` to see what's available on your machine.

## Troubleshooting

**Hook doesn't fire:** Check that `settings.local.json` has the hooks config, verify the script is executable (`chmod +x`), and confirm `$CLAUDE_PROJECT_DIR` resolves correctly in a Claude Code session.

**Review times out:** Check `roborev status` to make sure the daemon is running and workers are available. Increase the timeout in `hooks.json` if needed.

**Hook fires but no output appears:** The script may be exiting at the `command -v roborev` check. Verify roborev is in your PATH. Test manually with: `echo '{"tool_input":{"command":"git commit -m test"}}' | bash .claude/hooks/roborev-review.sh`

**"Unable to parse verdict" message:** RoboRev's output format may have changed. Check `roborev review --wait` output manually and update the job ID parsing regex if needed.

## The Key Insight

This hook went through three iterations before it worked properly. The first version just ran `roborev review --wait` and let the output go to console. Claude never saw it. The second version added error handling but still had no structured output. The fix was `hookSpecificOutput.additionalContext`, which is how you inject text back into Claude's conversation context.

A hook that produces console output is useless for an AI agent. The output must be structured JSON that Claude Code knows how to route into the conversation. Without that, your review results disappear into the void.

Once you get this working, you can let Claude Code run with more confidence. Every commit gets reviewed. Bad ones get fixed automatically. You're not the only quality gate anymore.
