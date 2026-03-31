# web-god Git Hooks

Pre-configured git hooks for web development quality gates. Uses [Husky](https://typicode.github.io/husky/) for hook management.

## Setup

```bash
# Install dependencies
npm install -D husky lint-staged @commitlint/cli @commitlint/config-conventional

# Initialize Husky
npx husky init

# Copy hooks
cp hooks/git/pre-commit .husky/pre-commit
cp hooks/git/pre-push .husky/pre-push
cp hooks/git/commit-msg .husky/commit-msg

# Make executable
chmod +x .husky/pre-commit .husky/pre-push .husky/commit-msg
```

## Add to package.json

```json
{
  "lint-staged": {
    "*.{ts,tsx}": ["eslint --fix", "prettier --write"],
    "*.{css,md,json}": ["prettier --write"]
  }
}
```

## Add commitlint.config.js

```js
module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [2, 'always', [
      'feat', 'fix', 'docs', 'style', 'refactor',
      'perf', 'test', 'build', 'ci', 'chore', 'revert'
    ]],
    'subject-max-length': [2, 'always', 72],
    'body-max-line-length': [1, 'always', 100],
  },
};
```
