---
layout: article
title: "Why Cassandra Is Winning the Consolidation Game"
date: 2025-10-19
category: Apache Cassandra
reading_time: 8
excerpt: "40% of Cassandra users are consolidating workloads into Cassandra. Only 24% are consolidating away. That gap doesn't come from marketing. It comes from 15 years of production systems that actually work at scale."
---

In [the first post in this series](/articles/great-database-consolidation/), I made the case that the database sprawl era is ending and enterprises are actively consolidating onto fewer platforms. A fair follow-up question is: consolidating onto what, exactly?

I hear this one often: "Is anyone actually consolidating onto Cassandra?" And given that every database vendor is telling you they're the smart consolidation choice right now, the skepticism is reasonable.

Here's what the [2025 Apache Cassandra community survey](https://cassandra.apache.org/_/blog/2024-User-Survey.html) actually shows: 40% of Cassandra users are consolidating workloads into Cassandra. Meanwhile, only 24% are consolidating away. That's not a press release. That's engineers, architects, and operators deciding with their infrastructure.

The gap is real. And it's worth understanding why it exists.

## The Capabilities That Actually Matter

When people talk about why workloads consolidate toward a database, they usually end up on a feature comparison page. That's the wrong place to look. The right question is: what can this database do reliably in production, at scale, that others can't?

For Cassandra, the answer starts with Multi-DC replication. 72% of our survey respondents use it. Not as something they evaluated and might someday try. As a day-one operational requirement.

If you're running a bank, a telecom, or a fintech platform, you don't put your critical data in one place. You need it in multiple data centers, replicating with local quorum consistency, staying available when networks partition. Cassandra was designed for this. We've been doing it reliably for 15 years. A lot of databases have tried to bolt this on after the fact. You can tell.

The scale numbers are harder to argue with. 50% of Cassandra users manage 100TB or more of data. 28% run 1,000 nodes or more. And 11% run 10,000 nodes or more. These are not proof-of-concept deployments or benchmark setups. These are live production systems. When your cluster has that many nodes, you need a database designed from the ground up for distributed operation. There's no shortcut to get there.

## The Self-Managed Signal

The number that I find most telling in the [survey data](https://cassandra.apache.org/_/blog/2024-User-Survey.html) is this: 85% of Cassandra users run self-managed deployments. The industry average for self-managed databases is around 34%. That's a 51-point gap.

When you're willing to run something yourself at scale, that's a specific kind of trust. It's not about pricing negotiations or license terms. It means you've decided the database is solid enough, and your team knows it well enough, that you'd rather own the operations than hand them off.

And our users do know the system well. 76% of survey respondents have 5 or more years of Cassandra experience. These aren't people experimenting. They've lived through failure modes, scaled through growth cycles, and made conscious choices to stay self-managed. That context matters a lot when you look at the satisfaction numbers.

Our satisfaction score is 8.3 out of 10 against an industry average of 7.0. Our recommendation rate is 96% against an industry average of 75%. 90% of users plan to continue using Cassandra. Those gaps don't happen when people are tolerating a database. They happen when people have made a choice they're happy with.

## Consolidation Velocity

Consolidation is a pattern, not an event, and you can see the momentum in adoption behavior.

53% of Cassandra users are already running Cassandra 5.0, and the stable release came out less than a year ago. [AxonOps tracked this closely in their year-in-review](https://axonops.com/blog/cassandra-in-2025-a-year-in-review/), noting that the upgrade pace to 5.0 has been faster than previous major releases. Operators aren't sitting on old versions out of inertia. They want the new features and they're moving quickly to get them.

Storage-Attached Indexing (SAI) is at 28% production adoption. That's not interest or evaluation. It's operators running it in production, trusting it with real query workloads.

The top features in active use tell you a lot about what this community cares about. 78% rely on quorum and strong consistency. 72% use Multi-DC replication. These are the features you reach for when correctness and availability are non-negotiable requirements. The workloads consolidating onto Cassandra are the ones where those requirements are non-negotiable.

## Who Is Actually Doing This

The community profile matters when you're trying to understand consolidation patterns. [According to The New Stack's coverage of the survey](https://thenewstack.io/ai-use-cases-set-to-triple-per-cassandra-poll/), AI use cases are projected to triple, which is worth its own post. But even setting AI aside, the core user base tells a clear story.

26% of respondents are architects. 21% are DBAs. 19% are developers. 19% are DevOps/SRE. 11% are in management roles. This is an experienced, technically deep mix. People who understand tradeoffs. Who have made mistakes and learned from them. Who have opinions about what actually works in production.

The top feature requests from this community reflect that experience. The leading asks are Unified Repair (67%), ACID Transactions (51%), ZSTD Compression (36%), and Transactional Metadata (33%).

Read that list carefully. Nobody's asking for trendy new paradigms or proprietary extensions. They're asking for better repair semantics, transactions that work properly, and more efficient compression. These are the requests of engineers who know their systems deeply and want them to be more reliable and more efficient. That's who is consolidating onto Cassandra, and that's what they need from us.

## Why the Numbers Add Up

Put the pieces together: mature Multi-DC replication that works at real scale, a community of experienced operators who trust the system enough to self-manage it at thousands of nodes, fast adoption of new releases, satisfaction and recommendation rates well above industry averages, and a clear signal that workloads are moving in more than they're moving out.

This isn't Cassandra being new and exciting. Cassandra has been in serious production for 15 years. The case for consolidating onto it comes from what those 15 years have proven: it works at scale, across geographies, under pressure, with data you can't lose.

The consolidation story isn't about out-marketing anyone. It's about having a genuine technical moat that took a decade and a half to build, and that most databases haven't been willing to invest in building.

## What Comes Next

This foundation, the scale capabilities, the trust from experienced operators, the community maturity, is exactly what matters for what's coming with AI workloads. In the next post I'll get into why the things AI infrastructure actually needs at scale map almost exactly onto what Cassandra does best. The interesting part is that it's not about the models. It's about the data infrastructure underneath them.

For now, the consolidation picture is clear. When you look at where the workloads are going and who is moving them, the data tells a consistent story.

---

*This is post 2 of a 4-part series on database consolidation and what it means for data architecture. Read [post 1 on industry consolidation trends](/articles/great-database-consolidation/). Posts 3 and 4 on AI-native infrastructure and the forward view are coming soon.*
