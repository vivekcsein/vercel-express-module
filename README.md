# Enterprise Express + TypeScript + Vercel Backend

Production-ready Express backend template using:

- Express
- TypeScript
- Vercel Serverless Functions
- HTTP-only Cookie Authentication
- Zod Validation
- Modular Architecture
- Enterprise-ready structure

---

# Features

- ✅ Express server
- ✅ TypeScript strict mode
- ✅ Vercel deployment ready
- ✅ Modular folder structure
- ✅ HTTP-only auth cookies
- ✅ Access + Refresh token strategy
- ✅ Zod request validation
- ✅ Enterprise scalable architecture
- ✅ Better Auth ready
- ✅ OAuth ready (Google / Discord)
- ✅ Serverless compatible

---

# Folder Structure

```txt
api/
 └── index.ts

src/
 ├── api/
 │    └── auth/
 │
 ├── packages/
 │    ├── configs/
 │    ├── middlewares/
 │    ├── schemas/
 │    ├── utils/
 │    └── env/
 │
 ├── app.ts
 └── server.ts
```

---

# Installation

```bash
pnpm install
```

---

# Development

```bash
pnpm run dev
```

Runs local Express server using:

```txt
src/server.ts
```

---

# Production Build

```bash
pnpm run build
```

Compiled output:

```txt
dist/
```

---

# Local Production Start

```bash
pnpm run start
```

---

# Authentication Strategy

This project uses:

- HTTP-only cookies
- Access token
- Refresh token
- Secure cookie strategy
- Session-ready architecture

Cookie names:

```txt
access_token
refresh_token
```

---

# Auth Routes

## Signup

```http
POST /api/auth/signup
```

## Signin

```http
POST /api/auth/signin
```

## Logout

```http
POST /api/auth/logout
```

## Refresh Session

```http
POST /api/auth/refresh
```

## Current User

```http
GET /api/auth/me
```

---

# TypeScript Configurations

This project supports TWO stable configurations.

---

# Version 1 (Recommended Modern Setup)

Best for:

- modern TypeScript
- cleaner imports
- no `.js` extensions
- better DX
- Vercel serverless

## package.json

```json
{
  "type": "module"
}
```

## tsconfig.json

```json
{
  "compilerOptions": {
    "target": "ES2022",

    "module": "Preserve",

    "moduleResolution": "Bundler"
  }
}
```

## vercel.json

```json
{
  "version": 2,

  "builds": [
    {
      "src": "api/index.ts",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "api/index.ts"
    }
  ]
}
```

### Advantages

- ✅ No `.js` imports
- ✅ Cleaner TypeScript experience
- ✅ Modern ecosystem compatibility
- ✅ Better with TSX
- ✅ Better with Bun
- ✅ Easier development

---

# Version 2 (NodeNext Hybrid Setup)

Best for:

- CommonJS compatibility
- older ecosystem compatibility
- hybrid Node runtime

## package.json

```json
{
  "type": "commonjs"
}
```

## tsconfig.json

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "NodeNext",
    "moduleResolution": "NodeNext"
  }
}
```

## vercel.json

```json
{
  "version": 2,
  "routes": [
    {
      "src": "/(.*)",
      "dest": "api/index.ts"
    }
  ]
}
```

### Advantages

- ✅ Stable CommonJS compatibility
- ✅ Easier migration from old projects
- ✅ Better for older Node ecosystems

### Disadvantages

- ❌ Requires `.js` import extensions
- ❌ More ESM friction
- ❌ Harder DX

---

# Recommended Configuration

For new projects:

```txt
Version 1
```

Recommended stack:

```txt
type: module
module: Preserve
moduleResolution: Bundler
```

This gives the cleanest modern backend experience.

---

# Vercel Deployment

## Install Vercel CLI

```bash
pnpm add -g vercel
```

## Deploy

```bash
vercel
```

---

# Important Notes

## Local Development

Uses:

```txt
src/server.ts
```

## Vercel Production

Uses:

```txt
api/index.ts
```

---

# Security Notes

- Use HTTPS in production
- Use secure cookies in production
- Never expose refresh tokens
- Store secrets in environment variables
- Use database-backed sessions for production apps

---

# Future Improvements

- PostgreSQL integration
- Better Auth adapter
- Google OAuth
- Discord OAuth
- Redis session store
- JWT signing
- Email verification
- Password reset
- Rate limiting
- Device sessions
- Session revocation

---

# Recommended Tech Stack

- Express
- TypeScript
- Zod
- Better Auth
- PostgreSQL
- Drizzle ORM
- Redis
- Vercel

---

# License

MIT
