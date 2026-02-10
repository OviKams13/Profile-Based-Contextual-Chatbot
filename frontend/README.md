# UniApply Frontend (minimal API integration)

## Setup
1. Copy env:
   - `cp .env.example .env`
2. Install:
   - `npm install`
3. Run dev:
   - `npm run dev`

Default API base URL:
- `VITE_API_BASE_URL=http://localhost:4000/api/v1`

## Routes implemented
- Public:
  - `/admin/login`
  - `/applicant/signup`
  - `/applicant/login`
  - `/programs`
  - `/programs/:id`
- Applicant protected:
  - `/apply/:programId`
  - `/me/applications`
- Dean protected:
  - `/admin`
  - `/admin/programs`
  - `/admin/applications`

## Flows to test
### Admin
1. Login from `/admin/login` with dean account.
2. Open `/admin/programs`:
   - Add Program (Step 1)
   - Add/Edit Courses (Step 2)
   - Create/Assign Coordinator (Step 3)
3. Open `/admin/applications`:
   - View list
   - Open detail modal
   - Accept/Reject

### Applicant
1. Signup/login (`/applicant/signup`, `/applicant/login`).
2. Browse `/programs`, search/filter/alpha ordering.
3. Open program detail (`/programs/:id`) and tabs.
4. Continue Application (`/apply/:programId`) and submit.
5. Verify `/me/applications`.

## Notes
- UI intentionally minimal (black/white, basic CSS).
- JWT stored in `localStorage`; private requests use `Authorization: Bearer <token>`.
- API errors are shown as plain text blocks.
