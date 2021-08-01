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

This will automatically:

1. Update the changelog
2. Create and checkout a new version branch
3. Bump the version and tag it
4. Push the branch and tags
5. Generate a new Github Release
6. Build and publish it to npm

## Recommended IDE Settings

### VS Code

`settings.json`

```json
{
  "editor.formatOnSave": true,
  "editor.rulers": [100]
}
```
