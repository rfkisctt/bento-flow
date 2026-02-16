<div align="center">

<img src="public/favicon.ico" alt="BentoFlow Logo" width="80" height="80" />

# BentoFlow

**Craft beautiful bento grids in seconds. Export production-ready code instantly.**

[![Live Demo](https://img.shields.io/badge/Live_Demo-BentoFlow-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://bento-flow.vercel.app/)
[![Next.js](https://img.shields.io/badge/Next.js-16-000000?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-Proprietary-EB3C27?style=for-the-badge)](LICENSE)

<br/>

<img src="public/poster.png" alt="BentoFlow Preview" width="100%" style="border-radius: 16px;" />

<br/>

_Design tool for developers who want to create stunning, responsive bento grid layouts._

</div>

---

## <img src="https://api.iconify.design/lucide:heart.svg?color=white" width="20" height="20" align="top" /> Support the Project

If BentoFlow has helped you build faster, consider supporting development:

<div align="center">

[![Saweria](https://img.shields.io/badge/Saweria-Support_Me-F96854?style=for-the-badge&logo=buymeacoffee&logoColor=white)](https://saweria.co/rfkisctt)

</div>

Your support helps us keep BentoFlow free for everyone.

---

## <img src="https://api.iconify.design/lucide:sparkles.svg?color=white" width="20" height="20" align="top" /> Features

### <img src="https://api.iconify.design/lucide:layout-grid.svg?color=white" width="18" height="18" align="top" /> Visual Grid Builder

- **Drag & Drop**: Intuitive click-and-drag interface to resize, move, and arrange blocks on a live canvas
- **Liquid Physics Engine**: Smart collision detection ensures blocks never overlap; they intelligently shift to maintain a clean layout
- **Real-time Preview**: Toggle between edit and preview mode to see your final grid without guidelines
- **Customizable Canvas**: Adjust columns, rows, gap spacing, and border radius to match your design system

### <img src="https://api.iconify.design/lucide:zap.svg?color=white" width="18" height="18" align="top" /> One-Click Code Export

- <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg" width="16" height="16" /> **CSS**: Clean, vanilla CSS grid code
- <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-original.svg" width="16" height="16" /> **Tailwind CSS**: Utility-first classes ready to paste into your project
- <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/bootstrap/bootstrap-original.svg" width="16" height="16" /> **Bootstrap**: Bootstrap-compatible grid markup
- <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/sass/sass-original.svg" width="16" height="16" /> **SCSS**: Sass-powered stylesheets with variables and nesting

### <img src="https://api.iconify.design/lucide:brain.svg?color=white" width="18" height="18" align="top" /> Smart Workflow

- **Full Undo/Redo History**: Never lose your progress with `Ctrl+Z` / `Ctrl+Y`
- **Keyboard Shortcuts**: Power-user commands for duplicating, moving, resizing, and deleting blocks
- **Block Selection**: Click to select, arrow keys to move, Shift+Arrow to resize
- **Copy & Paste Blocks**: Duplicate layouts with `Ctrl+C` / `Ctrl+V`

### <img src="https://api.iconify.design/lucide:smartphone.svg?color=white" width="18" height="18" align="top" /> Fully Responsive

- **Mobile-First Design**: Every component scales gracefully from 375px to 1440px+
- **Adaptive UI**: Icon-only toolbar buttons on mobile, bottom-sheet settings panel, single-column modals
- **iOS Safe**: Proper text-size-adjust and touch-friendly tap targets

### <img src="https://api.iconify.design/lucide:shield-check.svg?color=white" width="18" height="18" align="top" /> Built-in Security

- **Source Map Protection**: Production builds ship without source maps
- **Anti-Inspect**: Right-click disabled, DevTools shortcuts blocked, image drag prevented
- **Security Headers**: X-Frame-Options, X-Content-Type-Options, XSS Protection, Referrer Policy, and more
- **Powered-By Hidden**: No server framework fingerprinting

---

## <img src="https://api.iconify.design/lucide:rocket.svg?color=white" width="20" height="20" align="top" /> Tech Stack

| Layer             | Technology                                                                  |
| ----------------- | --------------------------------------------------------------------------- |
| **Framework**     | [Next.js 16](https://nextjs.org/) (App Router + Turbopack)                  |
| **Styling**       | [Tailwind CSS 4](https://tailwindcss.com/)                                  |
| **Animations**    | [Framer Motion](https://www.framer.com/motion/) + [GSAP](https://gsap.com/) |
| **Smooth Scroll** | [Lenis](https://lenis.darkroom.engineering/)                                |
| **Icons**         | [Lucide React](https://lucide.dev/)                                         |
| **Marquee**       | [React Fast Marquee](https://www.react-fast-marquee.com/)                   |
| **Language**      | TypeScript                                                                  |
| **Deployment**    | [Vercel](https://vercel.com/)                                               |

---

## <img src="https://api.iconify.design/lucide:flag.svg?color=white" width="20" height="20" align="top" /> Getting Started

### Prerequisites

- **Node.js** 18+
- **npm**, **yarn**, **pnpm**, or **bun**

### Installation

```bash
# Clone the repository
git clone https://github.com/rfkisctt/bento-flow.git

# Navigate to the project
cd bento-flow

# Install dependencies
npm install

# Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the landing page, then navigate to `/builder` to start creating grids.

### Build for Production

```bash
npm run build
npm start
```

---

## <img src="https://api.iconify.design/lucide:keyboard.svg?color=white" width="20" height="20" align="top" /> Keyboard Shortcuts

| Action           | Shortcut             |
| ---------------- | -------------------- |
| Undo             | `Ctrl + Z`           |
| Redo             | `Ctrl + Y`           |
| Duplicate Block  | `Ctrl + D`           |
| Copy Block       | `Ctrl + C`           |
| Paste Block      | `Ctrl + V`           |
| Move Block       | `Arrow Keys`         |
| Resize Block     | `Shift + Arrow Keys` |
| Next Block       | `Tab`                |
| Delete Block     | `Delete`             |
| Deselect / Close | `Escape`             |

---

## <img src="https://api.iconify.design/lucide:git-branch.svg?color=white" width="20" height="20" align="top" /> Architecture

```mermaid
graph TD
    User([User visits BentoFlow]) -->|Request| Config[next.config.ts: Security Headers]
    Config --> Layout[RootLayout: layout.tsx]
    Layout --> AntiInspect[AntiInspect: Code Protection]
    Layout --> Preloader[StairPreloader: Page Loader]
    Layout --> Scroll[ScrollManager: Lenis Smooth Scroll]
    Layout --> Template[Template: Framer Motion Transitions]
    Template --> Router{App Router: Next.js 15}
    Router -->|route: /| Landing[LandingPage.tsx]
    Landing --> Navbar[Navbar]
    Landing --> Hero[Hero: MaskedTextReveal + GSAP]
    Landing --> Showcase[GridShowcase: React Fast Marquee]
    Landing --> FAQ[FAQ: Spring Accordion]
    Landing --> Footer[Footer]
    Router -->|route: /builder| Builder[BentoBuilder.tsx: Core Engine]
    Builder --> Block[ResizableBlock: Drag/Resize/Collision]
    Builder --> Onboarding[BuilderOnboarding: First-time Guide]
    Builder --> Slider[LiquidSlider: Canvas Settings]
    Builder --> History[Undo/Redo: History Stack]
    Builder --> Shortcuts[Keyboard Shortcuts]
    Builder --> Export[Code Export Engine]
    Export --> CSS[CSS]
    Export --> Tailwind[Tailwind CSS]
    Export --> Bootstrap[Bootstrap]
    Export --> SCSS[SCSS]
```

> [!NOTE]
> The architecture follows the **Next.js App Router** pattern. The `RootLayout` wraps every page with global providers (scroll management, preloader, code protection), while the `Template` component handles animated page transitions between routes.

---

## <img src="https://api.iconify.design/lucide:folder.svg?color=white" width="20" height="20" align="top" /> Project Structure

```
bento-flow/
├── app/
│   ├── builder/           # Builder page (/builder)
│   ├── components/
│   │   ├── landing/       # Landing page components
│   │   │   ├── Navbar.tsx
│   │   │   ├── Hero.tsx
│   │   │   ├── Footer.tsx
│   │   │   ├── SectionComponents.tsx
│   │   │   └── grid-showcase.tsx
│   │   ├── design/        # Design elements (SelectionBox)
│   │   └── ui/            # Reusable UI (LiquidSlider, MaskedTextReveal)
│   ├── globals.css
│   ├── layout.tsx
│   ├── page.tsx           # Landing page (/)
│   └── template.tsx       # Page transition wrapper
├── components/
│   ├── bento-builder.tsx  # Core builder engine
│   ├── resizable-block.tsx
│   ├── builder-onboarding.tsx
│   ├── bento-constants.ts
│   ├── anti-inspect.tsx   # Code protection
│   └── stair-preloader.tsx
├── public/
│   ├── bentoflow.png      # Logo
│   ├── poster.png         # OG Image
│   └── vid_landing.mp4    # Hero video
└── next.config.ts         # Security headers & config
```

---

## <img src="https://api.iconify.design/lucide:gavel.svg?color=white" width="20" height="20" align="top" /> License

Copyright (c) 2026 [rfkisctt](https://github.com/rfkisctt).

This project is licensed under a **Proprietary License**. You are free to view and learn from the code, and use it for personal, non-commercial purposes. However, you are **not** permitted to:

- **Modify & Redistribute**: You may not redistribute the source code or modified versions of it.
- **Commercial Use**: You may not sell, lease, or commercialize the Software or any part of its source code.
- **Branding**: You may not claim ownership or use the Branding for commercial gain.

> [!IMPORTANT]
> The **core builder engine** is proprietary software. For licensing inquiries or commercial permissions, please [contact me](mailto:jorrviklvy@gmail.com).

For full details, see the [LICENSE](LICENSE) file.

---

## <img src="https://api.iconify.design/lucide:mail.svg?color=white" width="20" height="20" align="top" /> Contact & Socials

<div align="center">

[![Website](https://img.shields.io/badge/Website-bentoflow.vercel.app-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://bento-flow.vercel.app/)
[![GitHub](https://img.shields.io/badge/GitHub-BentoFlow-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/rfkisctt/bento-flow)

**Need help?** Open an [Issue](https://github.com/rfkisctt/bento-flow/issues) or reach out via email for support.

<br/>

_BentoFlow © 2026. All rights reserved._

</div>
