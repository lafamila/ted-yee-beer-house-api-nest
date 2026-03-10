# ted-yee-beer-house-api-nest

NestJS 11 BFF (Backend-for-Frontend) — pure HTTP proxy to FastAPI. No database, no business logic.

## STRUCTURE

```
src/
├── main.ts                 # Bootstrap: ValidationPipe, CORS, global prefix /api, port 3031
├── app.module.ts           # Root module: ConfigModule (global) + TodoModule
├── app.controller.ts       # Health check: GET / → "Hello World!"
├── app.service.ts          # Health check service
└── todo/
    ├── todo.module.ts      # HttpModule.registerAsync with TODO_API_BASE_URL from ConfigService
    ├── todo.controller.ts  # REST routes: /todo/projects, /todo/memos, versions
    ├── todo.service.ts     # Axios proxy: forwards all requests to FastAPI, passes errors through
    ├── dtos/
    │   ├── create-project.input.ts  # CreateProjectInput + VerifyPasswordInput (class-validator)
    │   ├── create-memo.input.ts     # CreateMemoInput
    │   └── update-memo.input.ts     # UpdateMemoInput
    └── interfaces/
        └── todo.interface.ts    # ProjectInterface, MemoInterface, MemoVersionInterface
test/
└── jest-e2e.json            # E2E test config (tests match *.e2e-spec.ts)
```

## WHERE TO LOOK

| Task | Location | Notes |
|------|----------|-------|
| Add new proxy endpoint | `todo.controller.ts` + `todo.service.ts` | Controller defines route, service does HTTP call |
| Add DTO validation | `src/todo/dtos/` | Use `class-validator` decorators. `whitelist: true` strips unknown fields |
| Add response types | `src/todo/interfaces/` | Match FastAPI response shape (camelCase) |
| Configure upstream URL | `.env` → `TODO_API_BASE_URL` | Used by `HttpModule.registerAsync` in `todo.module.ts` |

## CONVENTIONS

- **Proxy pattern**: `try { firstValueFrom(http.method()) } catch { handleAxiosError() }`
- **Error forwarding**: `handleAxiosError()` re-throws FastAPI's status/body as `HttpException`
- **DTO naming**: `Create{Entity}Input`, `Update{Entity}Input`, `Verify{Action}Input`
- **All DTOs use `!` definite assignment** with `class-validator` decorators (`@IsString()`, `@IsBoolean()`, `@IsOptional()`)
- **Module pattern**: NestJS standard (module/controller/service per domain)
- **Prettier**: singleQuote, trailingComma: all
- **tsconfig**: `noImplicitAny: false`, `strictNullChecks: true`, target ES2023, moduleResolution nodenext

## ANTI-PATTERNS

- `@typescript-eslint/no-explicit-any: 'off'` in eslint config
- One `eslint-disable @typescript-eslint/no-unsafe-member-access` in `todo.service.ts` line 33
- `as AxiosError<any>` cast in `handleAxiosError` — unsafe but contained
- Request/response logging via axios interceptors in constructor (not middleware)

## NOTES

- **Global prefix** `/api` — all controller routes resolve under `/api/todo/*`
- **Upstream calls** go to `/api/*` on FastAPI (the path is relative to `baseURL` from config)
- **10s timeout** configured on HttpModule
- **CORS** enabled with `origin: true` (allows all origins)