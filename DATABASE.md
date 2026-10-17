# novera database setup

install node js and postgresql and create an empty database named novera

1. run `npm install`
2. copy `.env.example` to `.env` and set your own postgres credentials
3. run `npm run db:init`
4. run `npm start`
5. open http://localhost:3000/api/health

## api

- GET /api/foundations
- GET /api/chapters
- GET /api/chapters/chapter-1/lessons
- POST /api/learners
- GET /api/learners/:id/progress
- PUT /api/learners/:id/progress/:chapter with JSON step and completed

## important

this is a development prototype not a production ready authentication system

learner identifiers are not authentication credentials and progress routes currently do not enforce account ownership

do not expose this server publicly until authentication authorization and rate limits are implemented

the current website still uses browser localStorage for progress the database API is not yet wired into the frontend

never commit .env or database credentials
