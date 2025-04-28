# Gleam ✨

A personal journaling Progressive Web App (PWA) designed to help you capture and reflect on life's moments. Gleam allows you to create entries, upload photos, and leverages AI to generate insightful summaries.

Built with SvelteKit and powered by Jazz for real-time synchronization.

## Features

*   **Moment Creation:** Easily create and manage journal entries.
*   **Photo Uploads:** Attach photos to your moments (powered by `jazz-browser-media-images`).
*   **AI Summaries:** Get AI-generated summaries for your moments using Google Generative AI.
*   **Real-time Sync:** Data is synchronized in real-time across devices using Jazz.
*   **PWA Enabled:** Install Gleam on your device for offline access and a native app-like experience.
*   **Markdown Support:** Write your entries using Markdown (rendered with `marked`, sanitized with `dompurify`).
*   **Modern UI:** Styled with Tailwind CSS and DaisyUI.

## Technology Stack

*   **Framework:** SvelteKit
*   **Language:** TypeScript, Svelte 5
*   **Data & Sync:** Jazz (`jazz-svelte`, `jazz-tools`, `jazz-browser-media-images`)
*   **AI:** Google Generative AI (`@google/generative-ai`)
*   **Styling:** Tailwind CSS, DaisyUI (`@tailwindcss/vite`, `@tailwindcss/typography`)
*   **UI Components:** Custom Svelte components
*   **Build Tool:** Vite
*   **Linting/Formatting:** ESLint, Prettier

## Project Structure

```
/Users/joe/WebDev/gleam
├── src/
│   ├── app.css           # Global styles
│   ├── app.d.ts          # Global type definitions
│   ├── app.html          # Main HTML template
│   ├── lib/              # Reusable components, utilities, schema
│   │   ├── components/   # Svelte components (e.g., Dock)
│   │   ├── schema.ts     # Jazz data schema (GleamAccount)
│   │   └── utils/        # Utility functions
│   └── routes/           # Application pages and layouts
│       ├── +layout.svelte  # Main layout (includes JazzProvider)
│       ├── +page.svelte    # Home page
│       ├── moment/         # Routes related to moments
│       ├── profile/        # Routes related to user profile
│       └── summary/        # Routes related to summaries
├── static/             # Static assets (icons, fonts, manifest)
├── package.json        # Project metadata and dependencies
├── svelte.config.js    # SvelteKit configuration
├── vite.config.ts      # Vite configuration
├── tsconfig.json       # TypeScript configuration
└── README.md           # This file
```

## Getting Started

### Prerequisites

*   Node.js (LTS version recommended)
*   pnpm (`npm install -g pnpm`)
*   A running Jazz peer instance. You can run one locally using `npx jazz-nodejs`, which will be accessible at ws://localhost:4200

### Installation

1.  **Clone the repository (if you haven't already):**
    ```bash
    git clone <your-repository-url>
    cd gleam
    ```

2.  **Install dependencies:**
    ```bash
    pnpm install
    ```

3.  **Environment Variables:**
    *   Create a `.env` file in the root of your project.
    *   Add the Jazz sync peer using PUBLIC_API_URL

### Running the Application

1.  **Start the development server:**
    ```bash
    pnpm run dev
    ```
    This will start the Vite development server, typically available at `http://localhost:5173`.

2.  **Build for production:**
    ```bash
    pnpm run build
    ```

3.  **Preview the production build:**
    ```bash
    pnpm run preview
    ```

## Contributing

Contributions are welcome! Please follow standard coding practices and ensure linting and formatting checks pass (`pnpm run lint`, `pnpm run format`).
