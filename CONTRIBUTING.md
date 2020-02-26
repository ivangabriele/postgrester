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

## Release

```bash
npm version [major|minor|patch]
```

This will automatically update the changelog, tag, push, build and publish postgrester to Github
releases & npm.

## Recommended IDE Settings

### VS Code

`settings.json`

```json
{
  "editor.formatOnSave": true,
  "editor.rulers": [100]
}
```
