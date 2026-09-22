# Production Deployment and Recovery

## Required environment variables

Set these in the hosting provider, never in source control:

- `ADMIN_SECRET`: long random value; production admin auth fails closed when missing.
- `DATABASE_URL`: Neon/Postgres connection string; the app fails during initialization when missing.
- `EMAIL_USER`, `EMAIL_PASS`, `ADMIN_EMAIL`: required for email notifications; notifications are disabled safely when incomplete.
- `NEXT_PUBLIC_SITE_URL`: production HTTPS origin used by sitemap and robots metadata.
- `TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID`: optional Telegram notifications; both are required together.

## Neon backup

1. In the Neon Console, open the production project and branch.
2. Confirm the branch's **Restore** or **Point-in-time restore** capability and retention window under **Backups/Branches**.
3. Before a risky migration, create a protected branch from the production branch at the current point in time.
4. For an independent export, use `pg_dump` with the production `DATABASE_URL` from a secure operator machine:

```bash
pg_dump --format=custom --file=axb-production-YYYYMMDD.dump "$DATABASE_URL"
```

Do not commit the dump or print the connection string in logs. Neon plan-level retention, point-in-time restore, and branching availability must be verified in the Neon Console for the actual account and plan; do not assume they are enabled.

## Restore

1. Stop writes or put the store in maintenance mode.
2. Prefer Neon point-in-time restore or a protected branch for a targeted recovery.
3. For a dump restore into an approved empty/recovery database:

```bash
pg_restore --clean --if-exists --no-owner --dbname="$RECOVERY_DATABASE_URL" axb-production-YYYYMMDD.dump
```

4. Verify product, order, and expense counts and run `npm run build` before pointing the application at the recovered database.
5. Rotate database credentials if the dump or connection string may have been exposed.

## Operational rules

- Deploy with `next build` followed by `next start`; never expose development mode.
- Configure HTTPS, backups, uptime/error monitoring, and an operator alert path.
- Run `npm audit` regularly and plan the Next.js/PostCSS upgrade migration.
