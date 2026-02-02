# JustCheck Backend

This backend is environment-configured but logic-stable.
All environments (dev / prod) run the same code.

## Environment Variable Contract (F.6.1.2)

The following environment variables are permitted:

### Required in production
- PORT  
  Network port the HTTP server listens on.

### Optional (safe defaults applied)
- NODE_ENV  
  Defaults to `development` if not set.

No other environment variables may be used without
explicitly updating this contract.

Adding or changing environment variables is a
breaking infrastructure change and must be intentional.
