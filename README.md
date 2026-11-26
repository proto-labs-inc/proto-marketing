# Proto marketing

Standalone marketing pages extracted from `proto-labs-inc/proto` at commit
`626d1f81f9653ec212e42b9baee02168183cf666`, including the working-copy memo text.
The source repository is unchanged.

## Pages

- `/`: marketing homepage
- `/landing`: homepage alias
- `/download`: Mac download page
- `/early-access`: early-access form
- `/early-access/application`: early-access application
- `/memo`: email-gated memo
- `/shapes`: interactive shapes
- `/k7p4-access`: legacy early-access message

The repo contains the shared components, styles, fonts, portraits, video, and
referenced preview images required by these pages. It excludes the gallery,
Frame, desktop app, authentication, staff tools, and prototype workspaces.

## Development

Requires Node.js 22 or later and pnpm 10.34.9.

```sh
pnpm install
cp .env.example .env.local
pnpm dev
```

Open http://localhost:3001. Run `pnpm typecheck` and `pnpm build` to validate,
then `pnpm start` to serve the production build on port 3001.

## Services

Page rendering does not require credentials. Real form submissions and the
waitlist count require `DATABASE_URL` for a Neon PostgreSQL database with the
existing marketing tables `early_access_requests` and `memo_views`. The API
routes are copied from the source app; no database migrations run during builds.
The table definitions are recorded in `database-schema.sql` for a new, empty
database. Do not run that file against an existing database.

`DESKTOP_RELEASE_MANIFEST_URL` enables `/api/desktop/download` using the existing
release manifest format and integrity checks. `PROTO_CLOUD` is optional and
provides the trusted origin for memo preview messages when embedded in Proto.

No environment values or credentials have been copied. Configure them in the
hosting environment before enabling real submissions or downloads. With missing
configuration, those endpoints report an unavailable or error response.

## Deployment

Deploy this repository as a Next.js application with `pnpm build`. It has no
workspace dependencies or dependency on the source checkout. Vercel Analytics is
retained from the source app. Configure domains in your hosting provider and
environment-specific values in environment variables.
