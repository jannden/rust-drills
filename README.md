# RD

## How to use

### Setup environment variables

Make sure you have `.env.local` with required variables.

When updating env variables, make sure to update `./src/env.mjs` as well.

To use Prisma locally, you have to have `dotenv-cli` installed globally. [Read more](https://www.prisma.io/docs/guides/development-environment/environment-variables/managing-env-files-and-setting-variables#using-dotenv-cli-via-command-line).

### Install the databases in a Docker container

```bash
docker-compose up -d --remove-orphans --no-start
```

Then start whichever database you need.

### Global dependencies

```bash
bun install --global dotenv-cli
bun install --global prisma
bun install --global tsx
```

### Install project dependencies

Make sure you have NodeJS >= 20 and [BUN](https://bun.sh/) installed.

Install with:

```bash
bun install
```

### Schema Migrations

Apply migrations and seed the DB with:

```bash
bun db:push
```

Or, once we start with migrations, apply them with:

```bash
bun db:migrate
```

### Run locally

```bash
bun dev
```

### Expose local server to the internet

When testing webhooks, you might need to expose localhost to the internet. Use [Serveo](https://serveo.net/).

```bash
ssh -R 80:localhost:3000 serveo.net
```

### Deploy

Project is deployed when merged to `main` branch.

## Code Style Guide

These are propositions for code style. Not all of them are implemented yet.

- Use `bun` instead of `npm` or `yarn`.
- Use Prettier code formatter on save.
- Use function declarations instead of function expressions. For example: `export default function Dashboard() {}`.
- Use default exports for Pages and Components.
- Don't create separate folders for Components.
- Put Components related to particular Pages into the same folder as the Page.
- Put truly reusable Components in the `@/components` directory.
- Keeps types in the same file as the code that uses them.
- Put truly reusable types in the `@/lib/types.ts` file.
- Use `@/lib` for libraries and utilities.
- Regularly run `npx npm-check-updates` to keep dependencies up to date.

## User Flow

The `app` folder contains two groups: `(marketing)` which is the public part of the app and `(user)` which is the private part of the app.

Authentication is handled by [Clerk](https://clerk.com/) and uses oAuth from Github. Users are then redirected to `/sign-up`, where their account is created in our DB or their `lastLogin` is updated. Then the users are redirected to `/dashboard`.

## OpenAI API

There are three types of interactions with the OpenAI API:

- Chat not-streaming
- Chat streaming
- Assistants

### Chat not-streaming

This is the simplest type of interaction and can be done entirely server-side.

1. We save in our DB a prompt together with `maxTokens`.
2. We send the prompt and the AI responds with a single message. We wait for the message to complete and we save the response together with the actual tokens used for prompt and for response.

### Chat streaming

This is using Vercel's AI SDK in addition to the OpenAI API. It allows us to send a prompt and then stream messages from the AI which looks much faster from UX perspective.
This is client-side communicating with the server-side.

1. We save in our DB a prompt together with `maxTokens`. This can be done entirely server-side or sometimes client-side is doing a request to the server to save the prompt.
2. Client-side sends a prompt to the server, server contacts OpenAI, and the AI responds with a streaming message. We stream the message to the client.
3. We wait for the message to complete and the client calls server to save the response. Server also calculates the actual tokens used for prompt and for response and saves them in the DB. The calculation is handled by a third-party library as OpenAI doesn't offer an official way to get the actual tokens used when streaming.

### Assistants

This is most complex, very new, and very promising way of interacting with the AI. It allows us to create a persona and then interact with the AI as that persona. It's like having a dedicated AI assistant.
It can be done entirely server-side. Not possible to stream at the moment. Feels much slower than the other two types of interactions, but has more accurate results.

1. We save in our DB a prompt together with `maxTokens` and `persona`.
2. We create a thread (if not created already).
3. We add a message to the thread.
4. We run the assistant on the thread.
5. We repeatedly verify the status of the run until it's completed.
6. We save the response together with the actual tokens used for prompt and for response.

## Spaced Repetition

The spaced repetition algorithm is based on [SM2](https://www.supermemo.com/en/blog/application-of-a-computer-to-improve-the-results-obtained-in-working-with-the-supermemo-method) and more specifically on [FreshCards](https://freshcardsapp.com/srs/write-your-own-algorithm.html).

Our algorithm is implemented in `@/lib/algorithm.ts`. There are four core parts to it:

- repetition: how many times the user has repeated the item
- eFactor: easiness factor
- interval: the interval between repetitions
- dateTimePlanned: the date and time when the next repetition is planned

We are saving additional details in the DB for the possibility of future improvements, such as the actual number of mistakes from each repetition. There is space for fine-tuning the algorithm or even plugging it into AI.

## Prisma Migrations

Important - based on which filename you use for your env variables, you might need to prefix any `prisma` command with: `dotenv -e .env.local --`.

### The Process of Switching to Migrations

During the prototyping phase, simply use the `prisma push --force-reset` command to force any Prisma Schema changes to the database.

If you already have a database you want to use, then run `prisma db pull` to create Prisma Model.

When first switching from push to migrations, use the `prisma migrate dev --name init` command to create a new migration SQL file from the Prisma Model.

Create folder `mkdir -p prisma/migrations/0_init` for the first migration and run the following script to create the migration file:

```bash
npx prisma migrate diff \
--from-empty \
--to-schema-datamodel prisma/schema.prisma \
--script > prisma/migrations/0_init/migration.sql
```

Then you can run `prisma migrate resolve --applied 0_init` to tell Prisma that the database is already in the state of the `0_init` migration.

### Using Migrations

Modify the Prisma Schema and then use the `prisma migrate dev --name <given-name>` command (adjusting given name) to create a new migration SQL file and automatically apply it to the local database.On Vercel, the migrations will be applied with the `prisma migrate deploy` command.

If you want to adjust the migration SQL file before applying it, then use the `prisma migrate dev --create-only` command. You can adjust the SQL and then run the migration locally with `prisma migrate dev`.

When necessary to seed the database, use the `prisma db seed` command.
