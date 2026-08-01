# Protech Notes

Encrypted note-taking web app with client-side encryption.

## Features

- Create, read, update, and delete notes
- Encrypt notes and download as JSON files
- Decrypt notes by uploading JSON files
- Client-side AES-256 encryption using Web Crypto API
- User authentication via Clerk
- Dark mode support

## Tech Stack

- Next.js (App Router)
- Clerk (authentication)
- Neon Postgres (database)
- Drizzle ORM
- Tailwind CSS
- Playwright for end-to-end testing

## Getting Started

Install dependencies:

```bash
npm install
```

Run the development server:

```bash
npm run dev
```

Open the app at http://localhost:3000

## Build

```bash
npm run build
```

### Run tests

```bash
npm run test:e2e
```

### Run tests in headed mode

```bash
npm run test:e2e:headed
```


### Generate HTML report

```bash
npm run test:e2e:report
```

## Notes

- If you want to run authenticated flows, set `CLERK_TEST_USERNAME` and `CLERK_TEST_PASSWORD` in your environment.
- The easiest test coverage in this repo is currently:
  - `tests/e2e/home.spec.ts`
  - `tests/e2e/contact.spec.ts`
  - `tests/e2e/login.spec.ts`

## Contact

This is a demo app, so contact form submissions are handled client-side for demonstration only.
