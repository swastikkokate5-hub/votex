# SmartVote Verify Design Guidelines

## Design Approach: Material Design System (Government/Civic Application)

**Rationale**: As a security-critical civic application prioritizing clarity, accessibility, and trust over visual flair, Material Design provides the robust component library and clear visual feedback needed for polling booth operations.

**Core Principles**:
- Absolute clarity over aesthetics
- Trust through professional presentation
- Zero tolerance for UI ambiguity
- Immediate status comprehension

---

## Typography

**Font Family**: Inter (via Google Fonts CDN)
- Primary: Inter (400, 500, 600, 700)

**Hierarchy**:
- Page Headers: text-3xl font-bold
- Section Headers: text-xl font-semibold
- Step Indicators: text-lg font-medium
- Body Text: text-base font-normal
- Status Messages: text-sm font-medium
- Labels: text-sm font-medium
- Helper Text: text-xs

---

## Layout System

**Spacing Primitives**: Tailwind units of **2, 4, 6, and 8**
- Component padding: p-4 to p-8
- Section gaps: gap-6 or gap-8
- Card spacing: space-y-4
- Button padding: px-6 py-2 or px-8 py-3

**Container Strategy**:
- Officer Dashboard: max-w-7xl mx-auto
- Verification Screens: max-w-4xl mx-auto
- Voting Interface: max-w-2xl mx-auto
- Forms: max-w-md

---

## Component Library

### Officer Login
- Centered card layout (max-w-md)
- Government seal/logo at top
- Input fields with clear labels
- Large, prominent "Secure Login" button
- Session status indicator

### Officer Dashboard
- Two-column layout (sidebar + main content)
- Sidebar: Navigation, officer profile, logout
- Main: Large "Start Next Voter" button (prominent, centered)
- Stats cards: Total verified, pending, suspicious activity
- Recent activity log table

### Voter Identification
- QR scanner viewport (simulated camera feed box)
- Manual ID input with large, clear text field
- Dual-action buttons: "Scan QR" and "Enter Manually"
- Fetched voter details display as card with photo

### Verification Screens
- Split layout: Live camera feed (left 40%) + Verification status (right 60%)
- Face Verification: Match score progress indicator, pass/fail status with icons
- Fingerprint: Fingerprint placement illustration, scanning animation, match result
- Clear "Verified ✓" or "Rejected ✗" badges with appropriate styling

### Camera Monitoring
- Persistent camera feed in corner (200x150px) with red recording indicator
- "Camera Active - Do Not Leave" warning banner

### Candidate Selection
- Grid layout: 2 columns on desktop, 1 on mobile
- Candidate cards: Party symbol (large), name (bold), party name
- Selected state: Thick border, checkmark overlay
- Lock mechanism: Disabled opacity on unselected after selection
- Confirmation modal with selected candidate summary

### Vote Submission
- Success screen with checkmark animation
- Voter ID blocked confirmation
- "Return to Dashboard" button
- Timestamp and booth ID footer

### Status Indicators
- Verification stages: Stepper component showing Officer Login → Voter ID → Face → Fingerprint → Vote
- Status badges: Pending (amber), Verified (green), Rejected (red), Blocked (gray)

---

## Icons
**Library**: Material Icons (via CDN)
- Biometric: fingerprint, face
- Security: verified_user, lock, camera
- Actions: qr_code_scanner, how_to_vote
- Status: check_circle, cancel, warning

---

## Forms & Inputs
- Large touch-friendly inputs (h-12)
- Clear floating labels
- Validation states with inline icons
- Disabled states clearly visible

---

## Buttons
**Primary Actions**: 
- Large (px-8 py-4 text-lg) for critical actions like "Start Next Voter", "Submit Vote"
- Medium (px-6 py-3) for secondary actions

**States**: 
- Default, Hover, Active, Disabled
- Loading state with spinner for verification processes

---

## Images

**Government Seal/Logo**: Small (80x80px) centered on login page

**Voter Photo**: Display fetched photo at 150x150px in verification card

**Party Symbols**: 100x100px in candidate cards

**Fingerprint Illustration**: Static illustration for fingerprint placement guidance

**No hero images** - this is a functional application, not marketing

---

## Accessibility
- WCAG 2.1 AA compliance mandatory
- High contrast for all text (minimum 4.5:1)
- Keyboard navigation for all workflows
- Screen reader support for status changes
- Touch targets minimum 44x44px

---

## Animation: MINIMAL ONLY
- Verification success/failure: Simple fade-in for status badges
- Loading states: Standard Material spinner
- NO decorative animations - polling booth stability is critical