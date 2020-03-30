# Contributing

## Get Started

```bash
yarn
```

## Test

- All Tests: `yarn test`
- E2E Tests: `yarn test:e2e` (run `yarn setup` before to setup the containers running the sample
  PostgREST instance).
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
