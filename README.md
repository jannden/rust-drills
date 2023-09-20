# Frankie
Use NodeJS >= 18

**Setup environment variables**

Make sure you have `.env.local`.

When changing env vars, also update `lib/getEnv.ts`

Because of Prisma using `.env` instead of NextJS's `.env.local`, you must dotenv-cli: `npm install -g dotenv-cli`

**Install the database in a Docker container**

```bash
docker compose up -d
```

**Install project dependencies**

```bash
pnpm install
```

**Run locally**

```bash
pnpm dev
```

**Deploy**
```bash
vercel
```