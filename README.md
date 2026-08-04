This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load fonts.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app).

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

---

## Database & Prisma (Production)

A `.env.example` has been added to document required environment variables for production and local development. Important points:

- DATABASE_URL (pooled): Use at runtime for your Next.js app when your Postgres is behind a pooler (Neon, Supabase, PgBouncer). This prevents exhausting database connections in serverless environments.

- DIRECT_URL (direct/unpooled): Required for Prisma migrations. `prisma migrate deploy` should use a direct DB connection (not the pooled one).

Example GitHub Actions step for running migrations:

```yaml
- name: Run Prisma Migrations
  run: npx prisma migrate deploy
  env:
    DATABASE_URL: ${{ secrets.DATABASE_URL }}
    DIRECT_URL: ${{ secrets.DIRECT_URL }}
```

Local / troubleshooting tips:

- Keep real secrets out of version control. `.env.example` is safe to commit (placeholders only); set actual values in your hosting provider or CI secrets.
- Ensure `NEXTAUTH_SECRET` is a long, random value and `NEXTAUTH_URL` points to your canonical domain.
- `NEXT_PUBLIC_GOOGLE_CLIENT_ID` is safe to expose; `GOOGLE_CLIENT_SECRET` must stay server-side.

If you want, I can also add a short CI workflow file or update existing workflows to ensure migrations use `DIRECT_URL` during deploys.
