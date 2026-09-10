# AI-Powered Digital Cognitive Companion
## Technical & Feature Documentation
### Smart India Hackathon — Problem Statement: MDoNER (Ministry of Development of North Eastern Region)
### Theme: MedTech / BioTech / HealthTech

---

## 1. Executive Summary

The **AI-Powered Digital Cognitive Companion** is an offline-first, AI-enabled mobile/tablet platform designed to support elderly dementia patients in the North Eastern Region (NER) of India. It combines adaptive cognitive gaming, personalized memory assistance, multilingual voice interaction, daily routine support, and caregiver monitoring into a single culturally-rooted, accessibility-first system.

**Core positioning statement:**
> A personalized digital cognitive companion that continuously learns from a patient's interaction, provides culturally familiar cognitive stimulation and memory assistance, supports daily routines, and enables caregivers to monitor progress — even in low-connectivity regions.

**Core solution flow:**
```
Patient → Plays/Interacts → AI analyzes performance → Difficulty/content adapts
   → Daily assistance triggers → Caregiver receives insights → Offline data syncs when connectivity returns
```

---

## 2. Problem Context (Reference)

- NER faces rising dementia/cognitive decline cases among the elderly, with limited access to neurological care due to geography and infrastructure gaps.
- Families and caregivers lack affordable, culturally relevant digital tools for cognitive engagement and monitoring.
- Connectivity in remote NER areas is unreliable, so any solution must function fully offline with background sync.
- Solution must work for low-literacy, low-tech-literacy elderly users, ideally in regional languages, with voice-first interaction.

---

## 3. System Users & Roles

| Role | Description | Primary Device |
|---|---|---|
| **Patient (Elderly/Dementia)** | Uses cognitive games, reminders, memory companion, voice interface | Tablet/Mobile (large-format preferred) |
| **Caregiver (Family member)** | Configures app, monitors dashboard, receives alerts, records personal memory content | Mobile/Web |
| **Healthcare Worker (ASHA/Clinician)** | Monitors multiple patients, views clinical trend reports, escalates cases | Web Dashboard |
| **Admin (System/NGO Operator)** | Manages users, content library, regional language packs | Web Admin Panel |

---

## 4. Core Feature Set (Detailed)

### 4.1 🧠 Adaptive Cognitive Games
- Memory-matching exercises (cards, faces, objects)
- Attention & concentration tasks (spot-the-difference, focus timers)
- Pattern and object recognition activities
- Daily routine recall exercises ("What comes after breakfast?")
- Emotionally engaging mini-games (music recall, familiar-voice matching)
- **AI-driven difficulty adaptation**: difficulty level auto-adjusts based on accuracy, response time, and error patterns per session
- Non-punitive feedback system — no "Fail/Wrong" language; only encouraging retries
- Session length auto-capped to avoid fatigue (clinically informed pacing)

### 4.2 👴 Personal Memory Companion
- Caregiver-uploaded family photos with name tagging
- Familiar people/places/objects library, personalized per patient
- Personalized recall questions generated from uploaded content (e.g., "Who is this in the photo?")
- Daily routine reference cards (visual schedule of the patient's actual day)
- Reminiscence mode: old photos/audio clips used as therapeutic recall triggers

### 4.3 🤖 AI Personalization Engine
- Tracks: accuracy, reaction time, error/mistake patterns, completion rate, session frequency
- Builds and updates a **patient cognitive-performance profile** over time
- Recommends next game type + difficulty level based on profile
- Generates **explainable insights** for caregivers (e.g., "Response time increased 30% this week") instead of an opaque score
- Lightweight on-device inference option for offline scenarios; full model updates sync when online

### 4.4 🗣️ Voice + Multilingual Interface
- Voice command navigation (minimal typing required)
- Speech-to-Text (STT) and Text-to-Speech (TTS) for all instructions
- Regional language support (Assamese, Bodo, Khasi, Mizo, Nagamese, Manipuri — expandable)
- Adjustable speech rate/volume
- Visual + audio redundancy for every instruction (text and icon shown alongside speech)

### 4.5 🌄 NER Cultural Personalization
- Regional language UI packs
- Familiar cultural themes: local food items, festivals, traditional objects, regional music/sounds
- Regionally familiar background imagery/art motifs (used as non-generic visual identity)
- Locally relevant example content in games (e.g., regional festival names in recall games)

### 4.6 ⏰ Daily Assistance & Reminders
- Medicine reminders (time-based, recurring)
- Hydration reminders
- Meal reminders
- Daily activity nudges
- Medical appointment reminders
- Simple "Today" screen showing the day's plan in sequence (reality-orientation design)
- Reminders function fully offline via local device scheduling

### 4.7 ❤️ Emotional & Social Engagement
- Daily mood check-in (simple emoji/face-tap interface)
- Family interaction module: voice messages, scheduled video/audio calls
- Reward mechanism: family voice-message unlock after completing an activity
- Encouraging, non-clinical language throughout ("Well done," "Let's try together")
- Companion avatar/character for continuity and comfort across sessions

### 4.8 👨‍👩‍👧 Caregiver Dashboard
- Patient activity history (daily/weekly/monthly views)
- Game performance and cognitive trend graphs
- Routine and reminder completion tracking
- Missed-reminder and behavior-change alerts (color-coded: green/amber/red)
- Downloadable/shareable weekly summary (PDF or shareable image, for ASHA worker reporting)
- Multi-patient view for healthcare workers

### 4.9 📴 Offline-First Design
- All games, reminders, and core AI logic function without internet
- Patient data stored locally (encrypted on-device database)
- Background sync queue: uploads data automatically when connectivity is restored
- Conflict-resolution logic for sync (last-write-wins with audit log, or merge strategy per data type)
- Content packs (games, images, audio) downloadable in advance for fully offline regions

### 4.10 🔐 Secure Patient Data Management
- Authentication (patient login simplified via caregiver-assisted PIN/biometric; caregiver/staff via standard auth)
- End-to-end encryption for data at rest and in transit
- Role-based access control (Patient / Caregiver / Healthcare Worker / Admin)
- Compliance alignment with India's **Digital Personal Data Protection (DPDP) Act, 2023**
- Audit logging for all data access (especially clinical/health data)

---

## 5. Accessibility & Elderly-Friendly Design Requirements

These are **mandatory UX constraints**, not optional polish — build every screen against this checklist.

### 5.1 Visual Accessibility
- App-wide adjustable text/icon scaling (persistent per user)
- High-contrast mode toggle
- Off-white/cream backgrounds (never pure white, to reduce glare)
- Color cues always paired with icons/shapes (never color-only)
- Fixed, consistent icon positions across sessions (spatial memory support)

### 5.2 Motor/Interaction Accessibility
- Minimum 48–60px tap targets
- Generous spacing between interactive elements
- Single-tap only navigation (no swipe/multi-touch/long-press as primary actions)
- No aggressive session timeouts
- Confirmation prompts before any destructive/irreversible action

### 5.3 Cognitive/Memory-Specific Design
- One task per screen — no clutter, no competing information
- Consistent "Today" home view (what's next: game/reminder/family)
- Repetition of the same icon/sound for the same action, always
- Gentle, encouraging error handling (never harsh negative feedback)
- Reality-orientation cues: date, day, time, season shown on home screen
- Progress shown via a simple growth metaphor (e.g., a garden growing) instead of numeric scores

### 5.4 Voice & Auditory Accessibility
- Voice-first interaction as a first-class path, not a fallback
- Adjustable TTS speech rate/volume
- Natural-sounding regional voices (avoid robotic default TTS where possible)
- Minimal background audio during spoken instructions

### 5.5 Emotional/Social Design
- Consistent companion character/voice with personalization ("You liked yesterday's music game!")
- Family-connection touchpoints embedded in the core flow, not a separate menu
- No performance-pressure language anywhere in the UI ("Score," "Failed," "Level" avoided)

### 5.6 Caregiver-Assisted Accessibility
- One-time caregiver setup mode (language, font size, reminders configured once)
- Remote nudge feature: caregiver sends a prompt that appears as a large gentle on-screen card
- Always-visible SOS/help button for one-tap contact to a designated family member/worker

---

## 6. System Architecture Overview

```
┌─────────────────────────────┐        ┌──────────────────────────────┐
│   PATIENT APP (Mobile/Tab)  │        │  CAREGIVER/CLINICIAN WEB APP  │
│   Flutter (Offline-First)   │        │  React.js Dashboard           │
└──────────────┬───────────────┘        └───────────────┬────────────────┘
               │  REST/GraphQL API (HTTPS)                │
               ▼                                          ▼
        ┌────────────────────────────────────────────────────────┐
        │                    BACKEND API LAYER                    │
        │        Node.js/Express or Django REST Framework         │
        │   Auth | Games API | Reminders API | Sync API | Alerts  │
        └───────────────┬───────────────────────┬─────────────────┘
                         │                       │
              ┌──────────▼─────────┐   ┌─────────▼─────────────┐
              │  AI/ML MICROSERVICE │   │   DATABASE LAYER       │
              │  FastAPI + Python   │   │  PostgreSQL (primary)  │
              │  Adaptive Difficulty│   │  Redis (cache/session) │
              │  Performance Model  │   │  S3/Cloud Storage      │
              └──────────────────────┘   │  (media: photos/audio)│
                                         └─────────────────────────┘
                         │
              ┌──────────▼─────────────┐
              │ VOICE & LANGUAGE LAYER  │
              │ Bhashini API / Google   │
              │ STT-TTS + Translation   │
              └─────────────────────────┘
```

**On-device (offline) components:**
- Local SQLite/Hive database (patient data, game state, reminders)
- Local rule-based/lightweight ML fallback for difficulty adaptation
- Background sync worker (queues changes, pushes when online)
- Pre-downloaded content packs (games, images, audio, language packs)

---

## 7. Frontend Layer — Detailed

### 7.1 Patient Mobile/Tablet App
- **Framework:** Flutter (Dart) — single codebase for Android/tablet, strong offline capability, smooth animation support for elderly-friendly UI
- **State Management:** Riverpod or Provider
- **Local Storage:** Hive or SQLite (encrypted) for offline-first data persistence
- **UI Components:**
  - Home/"Today" screen (routine + quick access to games/reminders)
  - Game modules (Memory, Attention, Pattern Recognition, Routine Recall)
  - Memory Companion screen (family photos, personalized recall)
  - Voice interaction overlay (always-accessible mic button)
  - Reminders screen (medicine, hydration, meals, appointments)
  - Mood check-in screen
  - SOS/Help button (persistent, fixed position)
  - Settings (managed primarily by caregiver setup mode)
- **Animations:** Lottie or Flutter's built-in animation framework for gentle, non-jarring feedback (celebration, encouragement)
- **Accessibility layer:** Flutter's Semantics widgets + dynamic text scaling + high-contrast theming

### 7.2 Caregiver/Clinician Web Dashboard
- **Framework:** React.js
- **Styling:** Tailwind CSS
- **Charting:** Recharts or Chart.js (cognitive trend graphs, activity heatmaps)
- **State Management:** Redux Toolkit or React Query (for API/data sync state)
- **Key Views:**
  - Patient list/overview (for healthcare workers managing multiple patients)
  - Individual patient dashboard (performance trends, routine adherence, alerts)
  - Alert center (color-coded: green/amber/red)
  - Content management (upload family photos, record voice messages)
  - Report export (PDF/shareable image generation)
- **PDF/Report generation:** jsPDF or server-side rendering via backend

---

## 8. Backend Layer — Detailed

### 8.1 Core API Backend
- **Framework options:**
  - Node.js + Express (fast to build, JS end-to-end, good for hackathon speed)
  - **OR** Django REST Framework (preferred if AI/ML team is Python-heavy — keeps stack unified)
- **Responsibilities:**
  - Authentication & authorization (JWT-based, role-based access control)
  - Patient, caregiver, and healthcare-worker CRUD APIs
  - Game session logging API (accuracy, reaction time, completion status)
  - Reminders API (create/update/complete reminders)
  - Sync API (handles offline-queued data merges from mobile app)
  - Alerts/notifications API (push alerts to caregiver dashboard)
  - Media upload API (family photos/voice notes → cloud storage)

### 8.2 AI/ML Microservice
- **Framework:** FastAPI (Python)
- **Responsibilities:**
  - Adaptive difficulty engine (rule-based + lightweight ML hybrid — e.g., a multi-armed bandit or simple regression model on accuracy/reaction-time trends)
  - Cognitive performance profile builder (aggregates session data into a trend profile)
  - Explainable insight generator (produces human-readable summaries for caregiver dashboard)
  - Model versioning: on-device lightweight fallback model + cloud-updated model, synced periodically
- **Libraries:** scikit-learn, pandas, numpy (kept lightweight and explainable — avoid black-box deep learning for a hackathon-scale demo)

### 8.3 Voice & Multilingual Service
- **Primary recommendation:** **Bhashini** (Government of India's National Language Translation Mission API) — strategically strong choice since this is a government-sponsored hackathon; demonstrates integration with an official digital-India initiative
- **Fallback/alternative:** Google Cloud Speech-to-Text / Text-to-Speech, or Azure Cognitive Services Speech
- **Responsibilities:** STT for voice commands, TTS for instructions/feedback, translation between regional languages and app content

### 8.4 Database Layer
- **Primary DB:** PostgreSQL — structured relational data (patients, caregivers, sessions, reminders, alerts)
- **Cache/session store:** Redis — session tokens, real-time alert queue
- **On-device DB:** SQLite or Hive — local mirror of patient's own data for offline function
- **Media storage:** Cloud object storage (AWS S3 / Firebase Storage / Cloudinary) for photos, voice notes, audio content packs

### 8.5 Sync & Offline Architecture
- **Mechanism:** Queue-based background sync
  - Every offline action (game session, reminder completion, mood check-in) written to local DB with a `synced: false` flag and timestamp
  - Background worker (Flutter `WorkManager`/`workmanager` package) attempts sync on connectivity detection
  - Conflict resolution: timestamp-based last-write-wins for simple fields; append-only logs for session/activity history (no overwrite risk)
- **Content pre-caching:** Game assets, language packs, and images downloaded and cached locally in advance, updated opportunistically when online

### 8.6 Security Layer
- **Auth:** JWT access + refresh tokens; caregiver-assisted PIN/biometric login for patients
- **Encryption:** TLS 1.2+ in transit; AES-256 for sensitive data at rest (both local device DB and cloud DB)
- **RBAC:** Enforced at API middleware level — Patient / Caregiver / Healthcare Worker / Admin scopes
- **Audit logging:** All access to health/cognitive data logged with timestamp, actor, and action
- **Compliance framing:** Aligned with DPDP Act 2023 principles (consent-based data use, purpose limitation, data minimization)

---

## 9. Full Tech Stack Summary Table

| Layer | Technology | Purpose |
|---|---|---|
| Patient Mobile/Tablet App | Flutter (Dart) | Offline-first, elderly-friendly cross-platform app |
| Local On-Device Storage | Hive / SQLite (encrypted) | Offline data persistence |
| Caregiver Web Dashboard | React.js + Tailwind CSS | Clinical/monitoring interface |
| Charting/Analytics UI | Recharts / Chart.js | Cognitive trend visualization |
| Core Backend API | Node.js + Express (or Django REST Framework) | Business logic, auth, CRUD, sync |
| AI/ML Microservice | Python + FastAPI + scikit-learn | Adaptive difficulty, performance profiling |
| Voice & Language | Bhashini API (primary) / Google Cloud Speech | STT, TTS, regional language translation |
| Primary Database | PostgreSQL | Structured relational data |
| Cache/Session Store | Redis | Sessions, real-time alerts |
| Media Storage | AWS S3 / Firebase Storage | Photos, voice notes, content packs |
| Background Sync | WorkManager (Flutter) | Offline-to-online data sync |
| Auth | JWT + RBAC middleware | Secure role-based access |
| Hosting (Demo) | Render / Railway / Vercel | Fast, free deployable demo environment |
| Push Notifications | Firebase Cloud Messaging (FCM) | Caregiver alerts, reminder nudges when online |

---

## 10. Suggested Database Schema (High-Level)

**Core tables/entities:**
- `users` (id, role, name, phone, language_pref, region, auth_credentials)
- `patients` (id, user_id, cognitive_profile_json, caregiver_id, region_theme)
- `caregivers` (id, user_id, linked_patient_ids)
- `game_sessions` (id, patient_id, game_type, accuracy, reaction_time_ms, difficulty_level, completed_at, synced)
- `reminders` (id, patient_id, type [medicine/hydration/meal/appointment], time, recurrence, status, completed_at)
- `memory_content` (id, patient_id, type [photo/audio/text], uploaded_by, tags, description)
- `mood_checkins` (id, patient_id, mood_value, timestamp)
- `alerts` (id, patient_id, type, severity [green/amber/red], message, created_at, resolved)
- `sync_log` (id, patient_id, entity_type, entity_id, action, timestamp, sync_status)

---

## 11. Suggested API Endpoint Structure (High-Level)

```
Auth
POST   /api/auth/login
POST   /api/auth/refresh

Patients
GET    /api/patients/:id
GET    /api/patients/:id/profile

Game Sessions
POST   /api/sessions               (log a completed game session)
GET    /api/sessions/:patientId    (fetch history for dashboard)

AI Engine
POST   /api/ai/recommend-difficulty
POST   /api/ai/generate-insight

Reminders
GET    /api/reminders/:patientId
POST   /api/reminders
PATCH  /api/reminders/:id/complete

Memory Companion
POST   /api/memory-content
GET    /api/memory-content/:patientId

Mood
POST   /api/mood-checkin

Caregiver Dashboard
GET    /api/dashboard/:patientId/summary
GET    /api/dashboard/:patientId/alerts

Sync
POST   /api/sync/batch             (bulk upload queued offline actions)
```

---

## 12. Recommended Build Priority (Hackathon Scope)

To keep the prototype demoable and polished rather than broad-but-shallow, build in this order:

1. **Patient app shell** with Today screen, one fully-working cognitive game (Memory Matching), and reminders — offline-first from day one.
2. **Basic AI difficulty adaptation** (even a simple rule-based version: 3 wrong answers → reduce difficulty).
3. **Caregiver dashboard** showing that one game's performance trend + reminder completion.
4. **Offline sync loop** — demonstrate an action taken offline appearing on the dashboard after reconnecting.
5. **Voice interaction** in at least one regional language, layered onto the existing game.
6. **Cultural personalization + Memory Companion** as the polish layer once the core loop works end-to-end.
7. Additional games and language packs only after the above loop is fully stable.

---

## 13. Key Differentiators to Emphasize in the Pitch

- Dual-audience design: emotionally warm for patients, clinically clean for caregivers.
- Explainable AI adaptation rather than a black-box score.
- Deep offline-first architecture, not just a "works without wifi" claim.
- Regional cultural personalization (language, imagery, festivals) as a core design layer, not a cosmetic add-on.
- Alignment with government digital infrastructure (Bhashini) and data protection law (DPDP Act 2023).
- Accessibility treated as three layers — Sensory, Cognitive, Emotional — not just "big buttons."

---

*End of Documentation*
