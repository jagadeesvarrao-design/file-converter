# ⚡ Converta — The Future of File Precision

Converta is an ultra-modern, high-performance, in-browser and server-less file conversion platform. Built using Next.js 15, Tailwind CSS v4, and WebAssembly, Converta offers lightning-fast, high-precision format conversions with zero quality loss and absolute privacy.

Designed with a premium **Neo-Precision** aesthetic, the application features an elegant glassmorphism dark theme, cyber-lime glowing accents, and a smooth, interactive dashboard interface.

---

## ✨ Features

- **⚡ WASM-Accelerated local conversions:** Convert smaller media files directly in your browser using client-side WebAssembly, ensuring 100% data privacy.
- **🛡️ Secure Cloud Processing:** Larger files are routed through private, secure APIs for maximum speed and scale.
- **🎨 Neo-Precision UI:** A cutting-edge dark theme with glassmorphic cards, custom cyber-lime glowing states, dynamic animations via Framer Motion, and high-fidelity typography.
- **📁 Multi-Format Support:**
  - **Images:** PNG, JPG, WEBP, TIFF, etc.
  - **Video:** MP4, WEBM, MKV, etc.
  - **Audio:** WAV, FLAC, AAC, MP3, etc.
  - **Documents:** PDF, TXT, DOCX, MD, etc.
- **📊 Real-time Conversion Tracker:** Interactive sidebar showing recent activity, progress bars, and status updates (Pending, Active, Completed).
- **🖱️ Smooth UI UX Flow:** Dynamic action cards designed to smoothly scroll and navigate the user to the interactive drag-and-drop zone.

---

## 🛠️ Tech Stack

- **Framework:** [Next.js](https://nextjs.org/) (App Router, Turbopack)
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/)
- **Animation:** [Framer Motion](https://www.framer.com/motion/)
- **Media Engine:** [FFmpeg WASM](https://ffmpegwasm.netlify.app/)
- **Icons:** Material Symbols

---

## 🚀 Getting Started

### Prerequisites

- Node.js (v18.x or higher)
- npm, yarn, or pnpm

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/jagadeesvarrao-design/file-converter.git
   cd file-converter
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:3000` (or `http://localhost:3001` if port 3000 is occupied).

---

## 🏗️ Project Structure

```
├── public/                 # Static assets
└── src/
    ├── app/
    │   ├── api/            # Serverless conversion API endpoints
    │   ├── dashboard/      # Conversion dashboard application
    │   ├── globals.css     # Global styles & Neo-Precision Tailwind variables
    │   ├── layout.tsx      # App-wide layout with font loading
    │   └── page.tsx        # High-fidelity landing page
    └── components/         # Reusable dashboard UI components
```

---

## 🌐 Deployment to Vercel

To deploy your own instance of Converta:

1. Install the Vercel CLI:
   ```bash
   npm install -g vercel
   ```
2. Log in and deploy:
   ```bash
   vercel
   ```
3. Follow the CLI wizard to link the repository and complete your deployment.
