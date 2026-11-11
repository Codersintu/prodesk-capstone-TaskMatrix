# db

To install dependencies:

```bash
bun install
```

To run:

```bash
bun run index.ts
```

This project was created using `bun init` in bun v1.3.14. [Bun](https://bun.com) is a fast all-in-one JavaScript runtime.

## Prisma

The Prisma schema includes the models required by the NextAuth Prisma adapter. Regenerate the client after changing the schema:

```bash
bun run --cwd packages/db build
```

For local development, apply schema changes to the configured database with:

```bash
bun run --cwd packages/db prisma db push
```

Use Prisma migrations rather than `db push` when managing a production database.
