# Repo Scan Summary (UniApply backend)

This repository contains a TypeScript + Express backend API for UniApply admissions.

## Structure
- `src/index.ts` boots the server, runs DB connectivity checks, mounts Swagger and `/api/v1` routes.
- `src/api/v1/routes` defines route groups for auth, programs, courses, coordinators, applicant profile, applications, and dean review.
- `src/api/v1/controllers` handles HTTP transport concerns.
- `src/api/v1/services` contains business logic.
- `src/api/v1/models` contains MySQL query access for users, programs, courses, coordinators, applicant profiles, and applications.
- `src/api/v1/validations` contains zod schemas.
- `src/api/v1/middlewares` contains auth, role, validation, not-found, and error middleware.
- `src/swagger/index.ts` contains OpenAPI docs.
- `tests/*.api.test.ts` includes integration tests for each API area.

## Key scripts
- `npm run dev` – run in development via `ts-node-dev`.
- `npm run build` – compile TypeScript.
- `npm run start` – run built JS from `dist`.
- `npm test` – run Jest tests.

## Endpoint groups (high level)
- Auth: register/login/me.
- Programs: public list/get + dean create/update + dean assign coordinator.
- Courses: public list/get + dean create/update/delete.
- Program coordinators: public get + dean create/update.
- Applicant profile: applicant get/upsert profile.
- Applications: applicant submit (profile+application transaction) and list own applications.
- Dean applications: dean list/get/accept/reject.

## Data entities (high level)
- `users`
- `programs`
- `courses`
- `program_coordinators`
- `applicant_profiles`
- `applications`

## Story fit notes
- JWT auth with `dean` and `applicant` roles is implemented.
- Programs/courses/public-read and dean-write model is implemented.
- Program coordinator (no auth account) and assignment/unassignment to programs is implemented.
- Applicant master apply endpoint and dean review endpoints are implemented, including transaction and re-review prevention.
- There are no chatbot modules/routes yet.
- Difference from strict product story: public registration allows creating multiple `dean` users; no enforced single-dean constraint is visible in backend code.
