# 🤝 Contributing to Handycraft

Thank you for your interest in contributing to **Handycraft**! 🎨✨  
We welcome all contributions — from bug fixes to new features to documentation improvements.

---

## 📋 Table of Contents

- [Code of Conduct](#-code-of-conduct)
- [Getting Started](#-getting-started)
- [How to Contribute](#-how-to-contribute)
- [Commit Message Convention](#-commit-message-convention)
- [Branch Naming](#-branch-naming)
- [CI/CD Pipeline](#-cicd-pipeline)
- [Project Structure](#-project-structure)

---

## 🌟 Code of Conduct

Please be respectful and constructive. We aim to create a welcoming community for everyone.

---

## 🚀 Getting Started

### Prerequisites
- A local PHP server (XAMPP, WAMP, or Laravel Herd)
- MySQL 5.7+ or MariaDB
- A modern browser

### Local Setup

```bash
# 1. Fork the repository on GitHub

# 2. Clone your fork
git clone https://github.com/YOUR_USERNAME/HandyCraft.git
cd HandyCraft

# 3. Import the database
#    Open your MySQL client and import:
#    backend/handycraft.sql

# 4. Configure the database
#    Edit: backend/config/Database.php
#    Update HOST, DB_NAME, USERNAME, PASSWORD

# 5. Launch
#    Point your PHP server root to the project folder
#    Open frontend/index.html in your browser
```

---

## 💡 How to Contribute

### Reporting Bugs 🐛
1. Search [existing issues](../../issues) to avoid duplicates
2. Open a new issue using the **Bug Report** template
3. Provide clear steps to reproduce

### Suggesting Features 🚀
1. Open an issue using the **Feature Request** template
2. Explain the use case and expected behavior

### Submitting a Pull Request
1. **Fork** the repo and create a new branch from `main`
2. Make your changes
3. Ensure the CI pipeline passes
4. Open a PR using the **Pull Request template**

---

## 📝 Commit Message Convention

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

```
<type>(<scope>): <subject>
```

### Types
| Type | Description |
|------|-------------|
| `feat` | A new feature |
| `fix` | A bug fix |
| `docs` | Documentation changes |
| `style` | CSS/UI changes (no logic change) |
| `refactor` | Code restructure (no feature/fix) |
| `perf` | Performance improvements |
| `test` | Adding tests |
| `chore` | Build process, CI, tooling |
| `security` | Security-related changes |

### Examples
```bash
feat(cart): add quantity increment/decrement buttons
fix(auth): resolve session not persisting after login
docs(readme): update local setup instructions
style(shop): improve product card hover animation
chore(ci): update ESLint version to v9
```

---

## 🌿 Branch Naming

```bash
# Features
feature/<short-description>
# e.g., feature/product-search

# Bug fixes
fix/<short-description>
# e.g., fix/cart-total-calculation

# Documentation
docs/<short-description>
# e.g., docs/api-endpoints

# Hotfixes
hotfix/<short-description>
# e.g., hotfix/checkout-redirect
```

---

## ⚙️ CI/CD Pipeline

Every push and pull request runs the following automated checks:

| Check | Tool | Scope |
|-------|------|-------|
| 🌐 HTML Validation | `html-validate` | `frontend/**/*.html` |
| 🎨 CSS Lint | `stylelint` | `frontend/css/**/*.css` |
| ⚡ JS Lint | `eslint` | `frontend/js/**/*.js` |
| 🐘 PHP Syntax | `php -l` + `phpcs` | `backend/**/*.php` |
| 🔐 Secret Scan | `gitleaks` | Entire repo |

All checks must pass before a PR can be merged.

---

## 📂 Project Structure

```text
HandyCraft/
├── 📁 .github/
│   ├── 📁 workflows/         # GitHub Actions CI/CD agents
│   │   ├── ci.yml            # Main CI pipeline (lint & validate)
│   │   ├── labeler.yml       # Auto-label PRs
│   │   ├── stale.yml         # Close stale issues/PRs
│   │   └── welcome.yml       # Greet new contributors
│   ├── 📁 ISSUE_TEMPLATE/    # Bug & feature request templates
│   ├── labeler.yml           # File→label mapping config
│   ├── dependabot.yml        # Auto-update GitHub Actions
│   └── PULL_REQUEST_TEMPLATE.md
├── 📁 frontend/              # HTML, CSS, JavaScript
│   ├── 📁 css/               # Stylesheets
│   ├── 📁 js/                # Client-side logic
│   └── 📄 *.html             # Page templates
├── 📁 backend/               # PHP API & config
│   ├── 📁 api/               # REST endpoints
│   ├── 📁 config/            # DB configuration
│   └── 📄 handycraft.sql     # Database schema
└── 📄 README.md
```

---

❤️ Thank you for helping make **Handycraft** better for everyone!
