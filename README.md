# Course Notes Platform (MVP)

A focused **Educational Note-Taking** web application (SPA + Serverless) for organizing study materials and enhancing learning sessions.

## Features (MVP)

- **User Accounts**: Secure sign-up and login for students
- **Note Management**: Create, read, update, and delete (CRUD) study notes
- **Smart Organization**: Categorize notes by Subject and Tags
- **Search**: Real-time filtering by title, subject, or tags
- **Study Mode**: Integrated YouTube player for video-based learning with side-by-side note taking
- **Markdown Support**: Rich text formatting for notes using `react-simplemde-editor`
- **Shared Notes**: simple email-based note sharing with other users
- **Image Upload**: Upload images directly into your notes

## Technical Specification & Project Plan

### Introduction

The Course Notes Platform is a web-based educational tool designed to streamline the study process for students. By combining video learning resources with an advanced note-taking interface, it addresses the context-switching problem often faced during online learning. The application follows a Single Page Application (SPA) architecture and utilizes a serverless backend for scalability and reliability.

### Objectives

- Provide a distraction-free environment for video-based learning
- Enable efficient organization of course materials
- Ensure data persistence and security across sessions
- Support active learning through simultaneous watching and summarizing
- Offer a responsive and modern user interface

### User Roles

**Student (Standard User)**
- Creates and manages personal account
- Creates private notes or shares them via email
- Accesses Study Mode
- Manages personal note tags and subjects

### Data Lifecycle

Data in the system follows a persistence pattern:
- **Local State**: Immediate updates for responsive UI
- **Firestore Sync**: Near real-time synchronization with the cloud database
- **Offline Resilience**: Basic offline support (via Firebase client SDK)

### Functional Requirements

- Users must authenticate to access the dashboard
- Dashboard must display a list of all user's notes (owned and shared)
- Users can create new notes and modify existing ones
- Study Mode must allow embedding YouTube videos
- Notes written in Study Mode must be saved to the database automatically or on demand

### Non-Functional Requirements

- Responsive UI (Standard Desktop focus)
- Secure authentication (Firebase Auth)
- Real-time data availability
- Minimal load times (Vite)

### System Architecture

The Course Notes Platform uses a Modern Serverless architecture:

- **Frontend**: React 19 (SPA)
- **Build Tool**: Vite
- **Backend/Database**: Firebase (Firestore, Auth, & Storage)
- **Hosting**: Static Web Hosting compatible

### Data Model

**User Entity** (Firebase Auth)
- `uid`
- `email`
- `displayName`

**Note Entity** (Firestore Collection: `notes`)
- `id` (Document ID)
- `userId` (Owner UID)
- `title` (String)
- `content` (String - for search indexing)
- `markdown` (String - raw markdown content)
- `subject` (String)
- `tags` (Array of Strings)
- `sharedWith` (Array of Strings - emails)
- `createdAt` (Timestamp)
- `updatedAt` (Timestamp)

### API Overview

**Authentication** (Firebase SDK)
- `signInWithEmailAndPassword`
- `createUserWithEmailAndPassword`
- `signOut`

**Notes Management** (Firestore SDK)
- `addDoc('notes')` - Create
- `getDocs(query(...))` - Read (Filtered by User & Shared)
- `updateDoc(docRef)` - Update
- `deleteDoc(docRef)` - Delete

### Access Control Rules

- Users can only read and write documents where `userId` matches their Auth UID OR where their email is in `sharedWith`.
- Unauthenticated users are redirected to the Login page.

### Future Enhancements

- PDF export needed for printing notes
- Flashcard generation from notes
- Progress tracking for study sessions
- Real-time collaborative editing (currently simple overwrite)

### Project Status

This project is currently implemented as an MVP and is active for development.

## Tech Stack

### Backend (Serverless)
- Firebase Authentication
- Firebase Firestore (NoSQL Database)
- Firebase Storage (for images)

### Frontend
- React 19
- Vite
- Lucide React (Icons)
- React Router DOM
- CSS Modules
- React SimpleMDE (Markdown Editor)

## Getting Started

### Prerequisites

- Node.js 18+
- npm

## Install & Run (Tutorial)

This tutorial walks you through setting up the project.

### 0) Clone the repository

```bash
git clone <YOUR_REPO_URL>
cd proiect
```

### 1) Configuration

The project currently uses a `src/services/firebase.js` file for configuration.
Ensure you have set up your Firebase project and enabled Authentication, Firestore, and Storage.

> **Note**: For production usage, it is recommended to move sensitive keys to `.env` variables.

### 2) Install Dependencies

```bash
npm install
```

### 3) Run Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:5173` (or the next available port).

---

## Deployment (Overview)

The application is frontend-focused and can be deployed easily.

1. Build the production bundle:
   ```bash
   npm run build
   ```
2. Deploy the `dist/` folder to any static host:
   - Firebase Hosting (Recommended)
   - Vercel
   - Netlify
   - GitHub Pages

---

## Project Structure

```
+--- public/              # Static assets
+--- src/
|   +--- assets/            # Images and icons
|   +--- components/        # Reusable React components
|   |   +--- notes/         # Note-specific components (Editor, Card)
|   |   +--- common/        # Shared components (ProtectedRoute)
|   +--- context/           # React Context (AuthContext)
|   +--- pages/             # Page views (Dashboard, Login, StudyMode)
|   +--- services/          # API/Firebase service layers (auth, notes, storage)
|   +--- styles/            # Global styles
|   +--- App.jsx            # Main Router
|   +--- main.jsx           # Entry point
+--- .gitignore
+--- package.json
+--- vite.config.js
+--- README.md
```

---

## Notes

This documentation reflects the MVP state of the "Course Notes Platform".

---

## License

This project is developed for educational purposes.
