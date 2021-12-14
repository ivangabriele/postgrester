# Contributing

## Get Started

```bash
yarn
```

## Test

- All Tests: `yarn test`
- Lint Tests: `yarn test:lint`
- Unit Tests: `yarn test:unit`
- Unit Tests (watch): `yarn test:watch`

### End-to-end

Run `yarn setup` to start PostgreSQL & PostgREST development containers.

Then run:

```sh
yarn test:e2e
```

## Release

```bash
npm version [major|minor|patch]
```

This will automatically:

1. Update the changelog
2. Create and checkout a new version branch
3. Bump the version and tag it
4. Push the branch and tags
5. Generate a new Github Release
6. Build and publish it to npm

## Recommended IDE Settings

### Visual Studio Code

```json
{
  "editor.codeActionsOnSave": {
    "source.fixAll": true
  },
  "editor.defaultFormatter": "dbaeumer.vscode-eslint",
  "editor.formatOnSave": true,
  "eslint.codeActionsOnSave.mode": "all",
  "eslint.format.enable": true,
  "eslint.packageManager": "yarn",
  "[json]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  }
}
```
