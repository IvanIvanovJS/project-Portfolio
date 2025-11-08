# Development Guidelines

## Build and Validation Rules

**CRITICAL: DO NOT RUN `npm run build` DURING DEVELOPMENT**

- The computer is very slow and running builds is extremely frustrating
- **NEVER** use `npm run build` to check for errors
- **ALWAYS** use `npm run type-check` for TypeScript validation
- **ALWAYS** use `npm run lint` for linting checks
- Use `getDiagnostics` tool for quick file-specific error checking

## Validation Commands

### Type Checking

```bash
npm run type-check
```

Use this to verify TypeScript types and compilation errors.

### Linting

```bash
npm run lint
```

Use this to check for code style and linting issues.

### Diagnostics Tool

Use the `getDiagnostics` tool to check specific files for errors without running full builds.

## When to Build

Only run `npm run build` when:

- Explicitly requested by the user
- Preparing for production deployment
- Final verification before committing major changes

## Summary

**DO**: Use `type-check`, `lint`, or `getDiagnostics`
**DON'T**: Use `npm run build` during active development
