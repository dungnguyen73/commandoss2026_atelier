# DESIGN.md

## 1. Overview & Creative North Star: The Digital Curator

ChainPassport is designed as a premium provenance experience — a digital passport for food origin, custody, and trust. The interface should feel calm, authoritative, and editorial, turning supply chain data into a polished narrative rather than a dense ledger view.

This design system is built on **Soft Minimalism**, **Atmospheric Depth**, and **clear typographic hierarchy**. The aim is to make complex traceability information feel easy to scan, easy to trust, and visually refined.

### Core Design Principles
- Trust over spectacle.
- Clarity over density.
- Breathing room over borders.
- Editorial presentation over dashboard clutter.
- Subtle depth over heavy shadows.
- Precise alignment over decorative noise.

---

## 2. Design Voice

The product should feel:
- premium,
- calm,
- credible,
- human,
- modern,
- and slightly ceremonial, like a certificate or passport.

The visual tone should never feel like a crypto exchange, NFT marketplace, or enterprise admin panel. It should feel like a carefully curated record of origin.

---

## 3. Color System & Surface Philosophy

### Palette Intent
Colors are used to support trust, readability, and state recognition. Green is the primary trust color, while deep slate anchors the typography and core content.

### Core Colors
- `primary`: #006e2f
- `primary_container`: #22c55e
- `secondary`: #2f6a3c
- `surface`: #faf8ff
- `surface-container-low`: #f2f3ff
- `surface-container-lowest`: #ffffff
- `surface-bright`: #faf8ff
- `on-surface`: #131b2e
- `outline-variant`: rgba(19, 27, 46, 0.15)

### Surface Hierarchy
Treat the UI like stacked paper.
- `surface`: global canvas.
- `surface-container-low`: section background.
- `surface-container-lowest`: cards and content panels.
- `surface-bright`: overlays and open space.

### No-Line Rule
Do not use hard 1px gray borders to separate major sections.
Use:
- background contrast,
- spacing,
- elevation,
- and tonal shifts.

If a stroke is needed for accessibility, use a very subtle outline with low opacity.

### Glass & Gradient Rule
Use glass or blur only for:
- top navigation,
- floating actions,
- modals,
- scanner overlays.

Use the primary gradient only for high-priority actions:
- `linear-gradient(135deg, #006e2f 0%, #22c55e 100%)`

---

## 4. Typography

### Typeface System
- **Manrope** for display and headings.
- **Inter** for body text, labels, and data.

### Type Philosophy
Typography must feel crisp, balanced, and highly readable at small sizes. Use a strong hierarchy and avoid excessive weights.

### Hierarchy
- Hero heading: large, tight, editorial.
- Page title: confident and restrained.
- Section title: clear and functional.
- Body text: legible, neutral, calm.
- Labels and metadata: compact, stamped, and consistent.

### Typography Rules
- Use tight tracking only for large headings.
- Keep body text open and readable.
- Never rely on font weight alone to establish meaning.
- Keep line lengths comfortable.
- Avoid all-caps unless for small labels or badges.

---

## 5. Elevation & Depth

Depth should come from layering, not from heavy shadows.

### Rules
- Prefer tonal separation over borders.
- Use shadows only for floating elements.
- Keep shadows soft and tinted.
- Use blur sparingly and only when it improves the composition.

### Shadow Token
- `0px 20px 40px rgba(19, 27, 46, 0.06)`

### Layering Principle
A higher layer should feel as if it sits above the page, not detached from it.
Use:
- background shifts,
- scale,
- spacing,
- and soft shadow.

---

## 6. Layout System

### Page Rhythm
- Large outer margins.
- Spacious section separation.
- Content blocks should not touch the edges.
- Prefer a calm vertical rhythm.

### Grid
- Desktop: 12-column layout.
- Tablet: 8-column layout.
- Mobile: stacked single-column layout.

### Spacing Scale
Use a consistent spacing scale:
- 4
- 8
- 12
- 16
- 24
- 32
- 48
- 64

### Container Rules
- Max content width: comfortable reading width.
- Hero sections should breathe.
- Avoid dense multi-column layouts unless necessary.

---

## 7. Components

### 7.1 Cards
Cards are pages within the passport.

Rules:
- Radius: `md` / `0.75rem`
- No strong borders
- Soft shadow or tonal background only
- Title first, supporting data below
- Use generous internal padding

### 7.2 Buttons
#### Primary Button
- Pill shape
- Gradient fill
- White text
- Slight shadow
- Used for the single main action

#### Secondary Button
- Neutral surface background
- No border
- Quiet but clear

#### Tertiary Button
- Text-style or subtle ghost button
- Used for low-priority actions

### 7.3 Inputs
Inputs should feel calm and lightweight.
- Background: `surface-container-low`
- Focus: shift to `surface-container-lowest`
- Add a subtle primary outline on focus
- Use helpful labels and clear placeholders
- Keep helper text short and calm

### 7.4 Badges
Badges indicate trust and status.
Examples:
- Verified
- In Transit
- Created
- Flagged
- Pending

Badge styling:
- rounded pill
- small size
- muted but clear contrast

### 7.5 Timeline
The timeline is the heart of the product.

Rules:
- Vertical layout
- Primary colored node
- Soft track line
- No boxed cards around every node
- Use whitespace to guide the sequence
- Each event should have:
  - label,
  - timestamp,
  - location,
  - supporting note

### 7.6 QR Elements
QR components should be visually prominent but not noisy.
- Square frame
- Centered
- Clear caption
- Optional copy/share action
- Scanner overlay should feel focused and calm

---

## 8. Page Experience Rules

### 8.1 Landing Page
- Strong hero statement.
- A single primary CTA.
- Support text should explain the trust value quickly.
- Use a simple visual of provenance, QR, or a passport-style card.

### 8.2 Dashboard
- Should be structured but not busy.
- Use cards for summary data.
- Keep lists short and scannable.
- Show the current role clearly.

### 8.3 Create Batch
- Keep the form as short as possible.
- Break into steps only if it reduces friction.
- Use section headings and clear labels.
- Show success immediately after minting.

### 8.4 Scan Page
- Mobile-first.
- Full-screen scanner area.
- One obvious action.
- Clear fallback for manual input.
- Strong permission and error states.

### 8.5 Item Detail Page
The item page is a provenance passport.
It should include:
- item summary at top,
- trust badge,
- metadata block,
- timeline,
- ownership/custody history,
- actions like copy/share/scan.

---

## 9. States & Feedback

### Loading
- Use elegant skeletons.
- Avoid busy spinners unless necessary.
- Loading should feel intentional and calm.

### Success
- Use soft confirmations.
- Include concise success copy.
- Show transaction state clearly.

### Error
- Show direct language.
- Explain what happened.
- Offer a clear next step.

### Empty State
Empty states should educate and guide.
- Short title
- One explanatory sentence
- One clear CTA

---

## 10. Motion & Interaction

Motion should be subtle and purposeful.
- Fade in sections
- Gentle lift on hover
- Smooth modal transitions
- Scanner focus animation
- Soft success transitions

Avoid:
- bouncy animation
- flashy glow effects
- excessive motion
- rapid parallax

---

## 11. Accessibility

Accessibility is a first-class requirement.

### Rules
- Maintain strong contrast.
- Never rely on color alone.
- Keep text readable at small sizes.
- Ensure all buttons have clear labels.
- Support keyboard navigation.
- Make scanner and form actions accessible.
- Keep blur and glass effects subtle enough for readability.

If transparency affects legibility, reduce it.

---

## 12. Mobile Behavior

The mobile experience is essential.

### Mobile Principles
- Thumb-friendly actions.
- Single-column layout.
- Large tap targets.
- Scanner-first interactions.
- Compact but readable data cards.
- Minimal chrome.

### Mobile Navigation
- Prefer a compact top bar or bottom bar.
- Keep primary actions visible.
- Avoid crowded menus.

---

## 13. Do’s and Don’ts

### Do
- Do use whitespace as the primary separator.
- Do keep the interface calm and intentional.
- Do use Manrope for headlines and Inter for body text.
- Do make the primary action obvious.
- Do use pill buttons and soft surfaces.
- Do present provenance like a premium certificate.
- Do make scan, verify, and timeline the central product story.
- Do keep cards quiet and content-first.
- Do use subtle glass only where it improves utility.
- Do maintain consistency across every screen.

### Don’t
- Don’t use neon crypto colors.
- Don’t use strong 1px gray dividers.
- Don’t use pure black text.
- Don’t overuse glassmorphism.
- Don’t build cluttered admin-style screens.
- Don’t make the app feel technical before it feels trustworthy.
- Don’t overload one screen with too many actions.

---

## 14. Suggested shadcn/ui Usage

Use shadcn/ui as the component foundation, then style it to match the system.

Recommended components:
- Button
- Card
- Badge
- Dialog
- Input
- Label
- Tabs
- Table
- Skeleton
- Toast
- Dropdown Menu
- Sheet
- Separator only when absolutely necessary and never as a visual divider for major sections

---

## 15. Final Product Identity

ChainPassport should feel like an Apple-grade digital passport for food provenance: polished, breathable, trustworthy, and elegant. It should communicate confidence through simplicity and transform traceability from a technical ledger into a premium, human-readable experience.