# FLCut — Link Shortener for Finite Loop Club


**Live:** [https://flcut.pdevdat.qzz.io/]  
---

## What is this?
FLCut is a URL shortener tool designed keeping in mind for the purpose of Finite Loop Club's events/resoursce sharing using custom URL for easy sharing and avoiding long URLs

---

## Stack

- **Framework:** Next.js + TypeScript
- **Database:** PostgreSQL via Supabase
- **ORM:** Prisma 
- **UI:** shadcn/ui + Tailwind CSS 
- **Deployment:** Vercel

---

## Features

- Shorten any URL to a clean slug
- Custom aliases (e.g. `/flc26`)
- Scheduled links — set a go-live time
- Expiring links — set an expiry time
- Click cap — stop redirecting after N clicks
- Analytics — total clicks, unique clicks, device, referrer
- Bot filtering — skips known scrappers
- Dashboard — view, disable, reactivate, delete links

---

## Data Model

<!-- Why two tables: Link and AnalyticsEvent -->
The database scheme for this project consists of two tables: Link and AnalyticsEvent.
Both are linked by refering the 'id' primary key in Link table.
- The Link table consists of all the details of the links such as the shortURL, OriginalURL, expiration schedule etc.
- The AnaliticsEvent table holds all the details of number of clicks, device used, uniqueness and hashed IP Address

<!-- Why two tables? -->
The current schema only has 2 tables and avoids a login system and some other features to keep it simple given the deadline for submission, though has a scope for further advancement.

### Link
| Field | Type | 
|-------|------|
| id | uuid | 
| shortSlug | text (unique) | 
| originalUrl | text | 
| expiresAt | timestamp? |
| scheduledAt | timestamp? |
| clickCap | int? | 
| createdAt | timestamp | 

### AnalyticsEvent
| Field | Type |
|-------|------|
| id | uuid | 
| linkId | text | 
| timestamp | timestamp |
| referrer | text? |
| device | text? |
| ipHash | text? |
| isUnique | bool | 

---

## If I Only Had 4 Hours

<!-- What would you build first? What would you cut entirely?-->
Given a 4 hours duration, I would've focused on setting up the DB first and made only the main page which allowed for creating the links.
With that duration I would avoid the dashboard page and alternatively even ORM and use supabase directly with nextjs.

---

## One Tradeoff I Made
I avoided authentication to speed up the build process and avoid complicating the DB

---

## Assumptions I Made

Avoided a user base assuming that the project is meant for internal FLC use and not for general access therefore only the club needs the URL shortner access

---

## What I Would Do Next

Set up user authentication and also add proper onboarding and homepage

---

## Hard Problems — How I Approached Them

### Slug generation & collisions
- Slugs are generated using an NPM module 'nanoid' which generates a 6 digit random code for non custom links.
- Collisions are avoided while creation by cross verifying with the DB while creation.
- Keywords like admin, api,dashboard are reserved to avoid future collisions for the same URL.

### Scheduling & expiry
- Scheduled URLs before time are redirected to not-yet page while expired pages are redirected to the expired page

### Analytics & uniqueness
- Unique users are identified using hashed IP and also device type
- Known basic bot scrappers are blocked before any analytics
- Analytics such as uniqueness and also number of clicks are counted

---



---

## Environment Variables

| Variable | Description |
|----------|-------------|
| DATABASE_URL | PostgreSQL connection string from Supabase |


---

Built by Devdat for Finite Loop Club Tech Team RecruitmentRound 1, 2026-27