# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository Overview

This is a GitHub Pages Jekyll site repository (pmcfadin.github.com) that automatically builds and deploys to GitHub Pages when changes are pushed to the main branch.

## Build and Deployment

The site uses GitHub Actions for automated deployment via `.github/workflows/jekyll-gh-pages.yml`. The workflow:
- Triggers on pushes to the `main` branch
- Builds the Jekyll site using GitHub's preinstalled dependencies
- Deploys to GitHub Pages automatically

### Common Commands

Since this is a GitHub Pages site with automated builds:

```bash
# Install dependencies locally (avoids sudo)
bundle install --path vendor/bundle

# Build the site
bundle exec jekyll build

# Serve site locally for development
bundle exec jekyll serve --host 0.0.0.0 --port 4000

# GitHub CLI operations (gh command is available)
gh repo view
gh workflow list
gh workflow view "Deploy Jekyll with GitHub Pages dependencies preinstalled"
```

## Architecture

This is a Jekyll static site generator project with:
- GitHub Actions workflow for automated deployment
- Photos directory containing image assets
- Standard Jekyll directory structure expected (_posts, _layouts, _includes, assets, etc.)

The site builds automatically on GitHub's infrastructure when pushing to main, so local Jekyll setup is optional for development.

## Development Notes

- The repository name (pmcfadin.github.com) indicates this is a personal GitHub Pages site
- Images are stored in the `/photos/` directory
- Jekyll ignores standard directories as configured in `.gitignore`: `_site/`, `.sass-cache/`, `.jekyll-cache/`