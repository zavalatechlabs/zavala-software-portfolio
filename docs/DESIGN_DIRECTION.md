# Design Direction Document

**Project:** Zavala Software Portfolio  
**Last Updated:** 2026-02-08  
**Designer/Frontend Lead:** ZTL Claw 🦞  
**Client:** Max @ Zavala TechLabs

---

## Design Philosophy

**Core Identity:** Minimal, modern, and deeply technical — a portfolio that feels like a polished developer tool, not a marketing brochure.

**Aesthetic:** Clean, dark-themed interfaces with subtle animations and interactive elements that showcase technical sophistication without overwhelming the visitor.

**Target Audience:** Recruiters, potential clients, and fellow developers who appreciate attention to detail and modern web capabilities.

---

## Inspiration Analysis

### Primary Inspirations (Sites Reviewed)

#### 1. **abdulrehmanwaseem.me**
**What We Love:**
- Minimal, cool style with excellent typography
- Very techy aesthetic — feels like a developer's portfolio
- Clean information hierarchy
- Professional yet approachable tone

**Key Takeaways:**
- Use monospace/technical fonts for certain elements
- Keep layout clean with plenty of whitespace
- Dark theme as primary (light mode optional)
- Section-based scrolling structure

---

#### 2. **aakashrajbanshi.com.np**
**What We Love:**
- Resume section with prominent download button
- Clear call-to-action for downloading resume

**Key Takeaways:**
- Dedicated resume/CV section
- Prominent "Download Resume" button (PDF)
- Make it easy for recruiters to get documents

**Implementation:**
- Resume section on About page or dedicated page
- Styled download button (icon + text)
- PDF hosted in `/public/resume.pdf`

---

#### 3. **toukoum.fr**
**What We Love:** 🌟 **HIGH PRIORITY**
- AI chat option embedded in the site
- Modern, interactive feature that brings forward buttons and animations
- Unique way to engage visitors

**Key Takeaways:**
- Integrate an AI chat widget (like a modern help chat)
- Use it for interactive portfolio exploration
- Animated entrance/exit for the chat widget
- Can answer questions about Max's work, skills, projects

**Implementation Options:**
1. **Custom AI Chat Widget:**
   - Floating button (bottom-right corner)
   - Expands to chat interface
   - Powered by OpenAI API or similar
   - Trained on portfolio content (RAG pattern)
   - Can answer: "What projects has Max worked on?" "What's his tech stack?" etc.

2. **Simpler Alternative (MVP):**
   - Pre-defined question buttons that expand sections
   - Animated interactions to reveal content
   - Can upgrade to full AI later

**Design:**
- Floating chat bubble icon (bottom-right)
- Smooth slide-in animation
- Dark themed chat interface
- Quick action buttons: "View Projects", "Download Resume", "Contact"
- Future: Full conversational AI

---

#### 4. **redoyanulhaque.me**
**What We Love:**
- "What I Do" section split between roles (Full Stack Developer | AI Developer)
- Nice box designs for service/skill categories

**Key Takeaways:**
- Split Max's identity: "Software Engineer | AI Enthusiast" (or similar)
- Use card/box layouts for skills or service areas
- Visual separation of different expertise domains

**Implementation:**
- Hero section: "Max Zavala — Software Engineer | AI Explorer"
- "What I Do" section with 2-3 categorized boxes:
  - Full-Stack Development
  - AI & Automation
  - System Architecture (or whatever makes sense for Max)

**Design:**
- Card-based layout with hover effects
- Icons or subtle graphics for each category
- Brief description of each area

---

#### 5. **zunedaalim.com** 🌟 **MUST-HAVE**
**What We Love:**
- **REALLY LIKE:** Initial load animation with name appearing
- **REALLY LIKE:** Text deciphering effect on scroll (under "Selected Works")

**Key Takeaways:**
- Name reveal animation is the HERO feature
- Text scramble/decipher effect creates intrigue
- Animations should feel premium, not gimmicky

**Implementation Priority: HIGH**

**1. Initial Load Animation:**
- Page loads with dark background
- Max's name appears letter-by-letter or with a glitch/decipher effect
- Options:
  - **Typewriter effect:** Letters appear sequentially
  - **Glitch/Matrix effect:** Characters cycle through random chars before settling
  - **Fade + slide:** Each letter fades and slides into place
- Duration: 2-3 seconds total
- After name reveal, rest of page fades in smoothly

**Technical Approach:**
- Use Framer Motion for orchestrated animations
- `AnimatePresence` for entrance effects
- Stagger children animations for letter-by-letter reveal

**Example Code Pattern:**
```typescript
<motion.h1
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  transition={{ duration: 1, delay: 0.5 }}
>
  {name.split('').map((char, i) => (
    <motion.span
      key={i}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: i * 0.1 }}
    >
      {char}
    </motion.span>
  ))}
</motion.h1>
```

**2. Text Deciphering Effect on Scroll:**
- Project titles/headings start as scrambled characters
- As user scrolls into view, text "deciphers" to reveal real content
- Creates mystery and engagement

**Technical Approach:**
- Use Intersection Observer to detect when element enters viewport
- Animate character replacement (random → real characters)
- Libraries: `react-text-scramble` or custom implementation with Framer Motion

**Example:**
```typescript
// Before scroll: "X$#@!& F%$#"
// After scroll:  "Project Name"
```

**Design:**
- Apply to section headings ("Selected Projects", "About Me", etc.)
- Can also apply to project cards on hover
- Timing: 0.5-1 second decipher duration
- Use monospace font for effect

---

#### 6. **abdulbasit-005.vercel.app**
**What We Love:**
- Terminal window showing `Portfolio.ts` with JSON/class structure
- Creative way to display developer info as code

**Key Takeaways:**
- Developers love seeing portfolio content represented as code
- Terminal aesthetic resonates with technical audience
- Nice-to-have feature (not critical path)

**Implementation:**
- Could be hero section variant OR footer element
- Mock terminal window with syntax-highlighted JSON/TypeScript

**Example Content:**
```typescript
// Portfolio.ts
interface Developer {
  name: string;
  role: string;
  focus: string[];
  passion: string;
  location: string;
}

const max: Developer = {
  name: "Max Zavala",
  role: "Software Engineer",
  focus: ["Full-Stack", "AI", "Cloud Infrastructure"],
  passion: "Building intelligent systems",
  location: "PST"
};

export default max;
```

**Design:**
- Dark terminal background (#1e1e1e or similar)
- Syntax highlighting (VS Code theme)
- Fake terminal header (close, minimize, maximize buttons)
- Placement: Bottom of about page or footer area

---

#### 7. **vyomdubey.com**
**What We Love:**
- Tech stack shown as terminal output
- Developer-centric way to display skills

**Key Takeaways:**
- Alternative approach to skills section
- Terminal theme for tech stack display

**Implementation (Nice-to-Have):**
- Skills section formatted as terminal output
- Example:
  ```
  $ max --show-skills
  
  Languages:     TypeScript, Python, JavaScript
  Frameworks:    Next.js, React, Node.js
  Tools:         Docker, Git, AWS
  Databases:     PostgreSQL, MongoDB
  ```

**Design:**
- Monospace font (Fira Code, JetBrains Mono, or similar)
- Terminal prompt style
- Optional: Animated typing effect

---

## Feature Priority Matrix

### 🔴 Must-Have (Phase 4 Implementation)

1. **Name Reveal Animation (Load)**
   - Initial page load with name appearing effect
   - 2-3 second animation
   - Sets the tone for entire site

2. **Text Decipher Effect (Scroll)**
   - Apply to major section headings
   - Scrambled → Real text as user scrolls
   - Creates engagement and intrigue

3. **Minimal, Techy Aesthetic**
   - Clean typography (sans-serif primary, monospace accents)
   - Dark theme with high contrast
   - Generous whitespace
   - Technical feel without being cluttered

4. **Resume Download Section**
   - Prominent button on About page
   - Clear call-to-action
   - Hosted PDF in `/public/`

5. **Split Identity Hero**
   - "Max Zavala — Software Engineer | AI Enthusiast"
   - Clear dual-focus presentation
   - Hero section with name + tagline

### 🟡 High Priority (Phase 4 Implementation)

6. **AI Chat Widget / Interactive Assistant**
   - Floating chat button (bottom-right)
   - Animated entrance
   - Phase 1: Quick action buttons (not full AI yet)
   - Phase 2: Full conversational AI powered by OpenAI

7. **"What I Do" Categorized Boxes**
   - Card-based layout
   - 2-3 categories (Full-Stack, AI, etc.)
   - Hover effects
   - Brief descriptions

8. **Project Cards with Hover Effects**
   - Grid layout for projects
   - Smooth hover animations
   - Tech stack tags visible

### 🟢 Nice-to-Have (Post-Launch Polish)

9. **Terminal Window (Code Representation)**
   - Portfolio info displayed as TypeScript/JSON
   - Could be footer or About page element
   - Syntax highlighted

10. **Terminal-Style Tech Stack Display**
    - Skills formatted as terminal output
    - Monospace font, command-line aesthetic

11. **Additional Animations**
    - Scroll-triggered animations on project images
    - Parallax effects
    - Smooth page transitions

---

## Color Palette

### Primary Colors
- **Background:** `#0a0a0a` (near-black)
- **Surface:** `#1a1a1a` (cards, elevated elements)
- **Border:** `#2a2a2a` (subtle dividers)

### Accent Colors
- **Primary Accent:** `#3b82f6` (blue - for CTAs, links)
- **Secondary Accent:** `#10b981` (green - for success states, hover effects)
- **Code Accent:** `#f97316` (orange - for code snippets, terminal prompts)

### Text Colors
- **Primary Text:** `#f5f5f5` (near-white)
- **Secondary Text:** `#a3a3a3` (muted gray)
- **Accent Text:** `#60a5fa` (lighter blue for links)

### Special Effects
- **Glow/Highlight:** `rgba(59, 130, 246, 0.1)` (subtle blue glow)
- **Shadow:** `rgba(0, 0, 0, 0.5)` (depth on cards)

**Tailwind Config:**
```javascript
theme: {
  extend: {
    colors: {
      'zavala-bg': '#0a0a0a',
      'zavala-surface': '#1a1a1a',
      'zavala-border': '#2a2a2a',
      'zavala-primary': '#3b82f6',
      'zavala-secondary': '#10b981',
      'zavala-code': '#f97316',
    }
  }
}
```

---

## Typography

### Font Families

**Primary (Body & Headings):**
- **Font:** Inter or SF Pro Display
- **Weights:** 400 (regular), 500 (medium), 600 (semibold), 700 (bold)
- **Usage:** Main content, headings, UI elements

**Monospace (Code & Technical Elements):**
- **Font:** JetBrains Mono or Fira Code
- **Weights:** 400 (regular), 500 (medium), 600 (semibold)
- **Usage:** Code snippets, terminal windows, tech stack, data structures

**Tailwind Config:**
```javascript
fontFamily: {
  sans: ['Inter', 'system-ui', 'sans-serif'],
  mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
}
```

### Type Scale
- **Hero Name:** `text-6xl md:text-8xl` (96px desktop, 60px mobile)
- **Hero Tagline:** `text-xl md:text-2xl` (24px desktop, 20px mobile)
- **Section Headings:** `text-3xl md:text-5xl` (48px desktop, 30px mobile)
- **Subsection Headings:** `text-2xl md:text-3xl` (30px desktop, 24px mobile)
- **Body Text:** `text-base md:text-lg` (18px desktop, 16px mobile)
- **Small Text:** `text-sm` (14px)

---

## Layout Structure

### Page Sections

#### **Homepage:**
1. **Hero Section**
   - Name reveal animation on load
   - Full viewport height
   - Name + tagline + scroll indicator
   - Dark background with subtle gradient

2. **About (Brief)**
   - 2-3 sentence introduction
   - "What I Do" categorized boxes
   - CTA: "Learn More" → About page

3. **Featured Projects**
   - 3-4 highlighted projects
   - Card layout with hover effects
   - Tech stack tags
   - CTA: "View All Projects" → Projects page

4. **Contact CTA**
   - Simple prompt: "Let's build something together"
   - Button: "Get in Touch" → Contact page

5. **Footer**
   - Social links
   - Copyright
   - Optional: Terminal code snippet

#### **About Page:**
1. **Hero Section**
   - Professional photo/avatar
   - Name + current role

2. **Bio Section**
   - Full professional story
   - Background, experience, interests
   - Split identity: Software Engineer | AI Enthusiast

3. **Resume Section**
   - Work experience timeline
   - Education
   - **Prominent Download Resume Button**

4. **Skills/Tech Stack**
   - Grid or list layout
   - Categorized (Languages, Frameworks, Tools, etc.)
   - Optional: Terminal-style display

#### **Projects Page:**
1. **Hero Section**
   - Page title with decipher effect
   - Brief description

2. **Projects Grid**
   - Card-based layout (3 columns desktop, 1-2 mobile)
   - Each card:
     - Project image/screenshot
     - Title + brief description
     - Tech stack tags
     - View button → Project detail page

3. **Filters (Optional for Later)**
   - Filter by tech stack
   - Filter by category (Web, Mobile, AI, etc.)

#### **Individual Project Page:**
1. **Hero Section**
   - Project name + tagline
   - Live link + GitHub repo buttons

2. **Project Overview**
   - Detailed description
   - Problem + Solution
   - Tech stack used

3. **Visual Gallery**
   - Screenshots/demos
   - Optional: Video walkthrough

4. **Key Features**
   - Bullet list or card layout

5. **Challenges & Learnings**
   - Technical challenges faced
   - What was learned

6. **Call-to-Action**
   - "View Live" / "View Code" buttons
   - "Back to Projects" link

#### **Contact Page:**
1. **Hero Section**
   - "Let's Connect" or similar heading
   - Brief message

2. **Contact Form**
   - Name, Email, Message fields
   - Submit button
   - Form validation
   - Success/error messages

3. **Alternative Contact Methods**
   - Email link
   - Social links (GitHub, LinkedIn, Twitter, etc.)

4. **Optional:**
   - Availability status: "Currently open to opportunities"
   - Location: "Based in PST"

---

## Animation Specifications

### 1. Name Reveal Animation (Load)
**Trigger:** Page load  
**Duration:** 2-3 seconds  
**Effect:** Letters appear sequentially with slight delay between each

**Implementation:**
- Use Framer Motion
- Stagger animation on each character
- Fade + slight Y-axis movement
- After completion, fade in rest of content

**Code Pattern:**
```typescript
const nameVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.5,
      ease: 'easeOut',
    },
  }),
};

<div>
  {name.split('').map((char, i) => (
    <motion.span
      key={i}
      custom={i}
      variants={nameVariants}
      initial="hidden"
      animate="visible"
    >
      {char}
    </motion.span>
  ))}
</div>
```

---

### 2. Text Decipher Effect (Scroll)
**Trigger:** Element enters viewport (Intersection Observer)  
**Duration:** 0.5-1 second  
**Effect:** Scrambled characters resolve to real text

**Implementation:**
- Use `react-intersection-observer` hook
- When in view, trigger character animation
- Randomly cycle through characters before settling on real character

**Libraries:**
- `react-text-scramble` (ready-made)
- OR custom with Framer Motion + character randomization

**Code Pattern:**
```typescript
const decipherText = (text: string, duration: number) => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*';
  let iterations = 0;
  const interval = setInterval(() => {
    setText(
      text
        .split('')
        .map((char, i) => {
          if (i < iterations) return text[i];
          return chars[Math.floor(Math.random() * chars.length)];
        })
        .join('')
    );
    if (iterations >= text.length) clearInterval(interval);
    iterations += 1 / 3;
  }, 30);
};
```

---

### 3. AI Chat Widget Animation
**Trigger:** Click floating button  
**Duration:** 0.3 seconds  
**Effect:** Chat window slides up from bottom-right

**Implementation:**
- Floating button (fixed position: bottom-right)
- Click expands to chat interface
- Slide-in animation from bottom
- Backdrop blur on rest of page (optional)

**Code Pattern:**
```typescript
<motion.div
  initial={{ y: 100, opacity: 0 }}
  animate={{ y: 0, opacity: 1 }}
  exit={{ y: 100, opacity: 0 }}
  transition={{ duration: 0.3, ease: 'easeOut' }}
>
  {/* Chat content */}
</motion.div>
```

---

### 4. Card Hover Effects
**Trigger:** Mouse hover  
**Duration:** 0.2 seconds  
**Effect:** Subtle lift + shadow increase + accent glow

**Implementation:**
- Transform: translateY(-8px)
- Shadow: Increase blur and opacity
- Optional: Border glow (accent color)

**Code Pattern:**
```typescript
<motion.div
  whileHover={{
    y: -8,
    boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
    borderColor: 'rgba(59, 130, 246, 0.5)',
  }}
  transition={{ duration: 0.2 }}
>
  {/* Card content */}
</motion.div>
```

---

### 5. Scroll-Triggered Fade-Ins
**Trigger:** Element enters viewport  
**Duration:** 0.6 seconds  
**Effect:** Fade in + slight Y-axis movement

**Implementation:**
- Use Intersection Observer or Framer Motion's `whileInView`
- Apply to sections, project cards, etc.

**Code Pattern:**
```typescript
<motion.div
  initial={{ opacity: 0, y: 50 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true, amount: 0.3 }}
  transition={{ duration: 0.6 }}
>
  {/* Content */}
</motion.div>
```

---

## Component Specifications

### 1. Hero Section (Homepage)
**Layout:**
- Full viewport height
- Centered content
- Name + tagline + scroll indicator

**Elements:**
- Name (with reveal animation)
- Tagline: "Software Engineer | AI Enthusiast"
- Scroll indicator (animated arrow or text)

**Background:**
- Solid dark color OR subtle gradient
- Optional: Animated gradient mesh or particles (low priority)

---

### 2. Project Card
**Layout:**
- Card with image, title, description, tech tags

**Elements:**
- Project image (aspect ratio 16:9)
- Title (text-xl, font-semibold)
- Brief description (text-sm, 2-3 lines)
- Tech stack tags (pills/badges)
- "View Project" button (appears on hover)

**Interactions:**
- Hover: Card lifts, shadow increases
- Click: Navigate to project detail page

**Design:**
- Dark background (#1a1a1a)
- Subtle border (#2a2a2a)
- Rounded corners (rounded-lg)
- Padding: p-6

---

### 3. AI Chat Widget
**Layout:**
- Floating button (fixed bottom-right)
- Expands to chat interface on click

**Floating Button:**
- Circular or rounded square
- Icon: chat bubble or AI sparkle
- Size: 56x56px
- Subtle pulse animation (idle state)

**Chat Interface:**
- Width: 400px (desktop), full-width (mobile)
- Height: 500px max
- Dark themed
- Message bubbles (user vs bot)
- Input field at bottom
- Quick action buttons at top

**Interactions:**
- Click button: Slide in chat
- Click backdrop: Close chat
- Type message: Send to AI (or trigger predefined responses)

**MVP Implementation:**
- Quick action buttons only (no AI yet):
  - "View Projects" → scroll to projects
  - "Download Resume" → trigger download
  - "Contact Me" → navigate to contact page

**Future Enhancement:**
- Full conversational AI
- RAG system trained on portfolio content
- Natural language queries

---

### 4. Terminal Code Window
**Layout:**
- Mock terminal window with header bar

**Elements:**
- Header bar with window controls (close, minimize, maximize)
- Code content area (syntax highlighted)
- File name tab (e.g., "Portfolio.ts")

**Design:**
- Background: #1e1e1e (VS Code dark)
- Header bar: #323233
- Window controls: colored dots (red, yellow, green)
- Syntax highlighting: VS Code One Dark theme

**Content Example:**
```typescript
// Portfolio.ts
interface Developer {
  name: string;
  role: string;
  focus: string[];
  passion: string;
}

const max: Developer = {
  name: "Max Zavala",
  role: "Software Engineer",
  focus: ["Full-Stack", "AI", "Cloud"],
  passion: "Building intelligent systems"
};
```

**Placement:**
- About page (bottom section)
- OR Footer area

---

### 5. Resume Download Section
**Layout:**
- Prominent section on About page
- Clear heading + button

**Elements:**
- Heading: "Resume"
- Brief text: "Download my full resume for detailed experience and education"
- Button: "Download Resume (PDF)" with download icon

**Design:**
- Large button (px-8 py-4)
- Primary accent color background
- Hover: Slightly darker, lift effect
- Icon: Download arrow

**Implementation:**
- Button triggers download of `/public/resume.pdf`
- Track download analytics (optional)

---

## Technical Implementation Notes

### Framer Motion Best Practices
- Use `AnimatePresence` for enter/exit animations
- Stagger animations with `transition.staggerChildren`
- `whileInView` for scroll-triggered animations
- `viewport={{ once: true }}` to prevent re-triggering on every scroll

### Performance Considerations
- Lazy load images (Next.js Image component)
- Code split heavy animations (dynamic imports)
- Optimize Framer Motion bundle (only import needed components)
- Test on mobile devices (animations should be performant)

### Accessibility
- Respect `prefers-reduced-motion` media query
- Provide skip links for animations
- Ensure keyboard navigation works with animations
- ARIA labels on interactive elements

### Responsive Design
- Mobile-first approach
- Test on: iPhone (375px), iPad (768px), Desktop (1440px)
- Adjust animation speeds for mobile (faster)
- Simplify some animations on mobile (e.g., simpler name reveal)

---

## Content Placeholders

**NOTE:** Content details (bio, projects, etc.) will be defined in Phase 3 content planning. For now, Phase 4 implementation will use placeholder content.

### Homepage Hero
- Name: "Max Zavala"
- Tagline: "Software Engineer | AI Enthusiast"

### About Page Bio (Placeholder)
```
I'm Max, a software engineer passionate about building intelligent systems 
and exploring the intersection of full-stack development and AI. 

With a background in [PLACEHOLDER], I specialize in creating scalable web 
applications and experimenting with cutting-edge AI technologies.

When I'm not coding, you'll find me [PLACEHOLDER] or contributing to 
open-source projects.
```

### Project Cards (Placeholder)
```
Project 1: E-commerce Platform
Tech: Next.js, TypeScript, Stripe, PostgreSQL
Description: Full-stack e-commerce solution with secure payments

Project 2: AI Chat Assistant
Tech: Python, OpenAI, LangChain, FastAPI
Description: Conversational AI trained on custom knowledge base

Project 3: Task Management Dashboard
Tech: React, Node.js, MongoDB, Socket.io
Description: Real-time collaborative task tracking application
```

---

## Phase 4 Implementation Roadmap

### Sprint 1: Core Layout & Animation Foundation
1. Implement base layout (Navbar, Footer)
2. Set up Framer Motion configuration
3. Build name reveal animation (homepage hero)
4. Build text decipher animation component (reusable)
5. Apply animations to section headings

### Sprint 2: Page Structure & Components
1. Build homepage structure
2. Build about page structure
3. Build projects page structure
4. Build contact page structure
5. Create project card component
6. Create resume download section

### Sprint 3: Interactive Features
1. Build AI chat widget (MVP: quick actions only)
2. Implement project card hover effects
3. Add scroll-triggered animations
4. Build terminal code window component
5. Integrate into About page or Footer

### Sprint 4: Polish & Refinement
1. Refine all animations (timing, easing)
2. Test on multiple devices/browsers
3. Optimize performance
4. Accessibility audit
5. Final design tweaks

---

## Design System Summary

**This document serves as the single source of truth for:**
- Visual design decisions
- Feature priorities
- Animation specifications
- Component designs
- Color palette and typography
- Layout structures

**Future sub-agents should:**
- Read this document before starting implementation
- Follow the specified priorities (Must-Have → High Priority → Nice-to-Have)
- Use the provided code patterns as starting points
- Maintain consistency with the established design system
- Create sub-issues for any additional work discovered

---

## Design Decisions (Answered by Max - 2026-02-08)

1. **AI Chat Widget:** ✅ Placeholder/fake for v1 (visual only, no functionality). Will add real AI in later phase.

2. **Terminal Code Window:** ✅ Footer area - place where it adds value and doesn't distract from main content.

3. **Light/Dark Mode:** ✅ Build both modes with dark as default. Easy toggle switch in navbar.

4. **Projects:** ✅ 5 mocked projects for initial implementation.

5. **Split Identity:** ✅ "Software Engineer | AI Enthusiast"

6. **Social Links:** ✅ GitHub and LinkedIn only.

7. **Resume:** ✅ Mock resume info following aakashrajbanshi.com.np pattern:
   - Dedicated resume page/section
   - Work experience, education, skills
   - Download button at bottom (similar to inspiration site)
   - PDF download functionality

---

**End of Design Direction Document**

_This document will be updated as design decisions are finalized in Phase 3._
