# Backend Deployment Hardening Checklist

## Runtime and Secrets
- Use strong JWT_SECRET generated from a secret manager.
- Never commit .env files; only commit .env.example.
- Rotate database and API credentials regularly.

## Network and Platform
- Enforce HTTPS at the platform or load balancer level.
- Restrict MongoDB network access to app egress addresses.
- Disable direct database access from public internet where possible.

## Application Guards
- Keep AUTH_RATE_LIMIT_WINDOW_MS and AUTH_RATE_LIMIT_MAX tuned for traffic.
- Keep security headers enabled via helmet.
- Keep request body limits conservative.

## Operations
- Enable health checks against /api/health.
- Require CI success before merge.
- Keep rollback instructions and previous known-good build artifact.
- Monitor 5xx, auth failures, and elevated 429 trends.
