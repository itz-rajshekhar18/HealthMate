# HealthMate

HealthMate is a comprehensive health tracking application designed to log vital statistics, monitor health trends, and generate PDF summaries. This repository contains the complete source code, documentation, and design references for the HealthMate app.

---

## App Flow

The flow of the application has been thoughtfully designed to ensure ease-of-use and seamless navigation. Below you'll find a detailed flowchart of the app, covering all core screens and user actions.

**View Flow of App**  
[HealthMate App Flow (Figma Board)](https://figma.com/board/KhCQHDgZabVWC9zJ3ImLcn/Flow-of-App--HeathMate-?node-id=0-1&t=CrRKm0htoOMZbxg9-1)

Key steps in the app flow include:
- Splash Screen / Onboarding
- User Login & Registration
- Dashboard & Overview
- Log Vital Statistics (Blood Pressure, Heart Rate, Glucose, etc.)
- View and Analyze Trends
- Export Health Summary as PDF
- Settings & Profile Management

For the most up-to-date visual flow and screen navigation, please refer to the Figma board linked above.

---

## Recent Development Progress

The following milestones highlight the major features and enhancements recently implemented:

### Complete Authentication Flow
- Welcome/onboarding screen with dynamic health stats and feature highlights
- Email/password login and registration with form validation
- Forgot password functionality with email reset
- Cross-navigation links and consistent blue-themed UI
- Responsive layouts for all authentication screens
- Integrated Google OAuth and Firebase Authentication
- Centralized authentication state management and detailed error handling

### Health Dashboard and Navigation
- Professional dashboard displaying key vitals (Blood Pressure, Heart Rate, SpO2, Temperature)
- Quick actions, recent activity, and user greetings
- Authentication-aware routing and user flow
- Tab-based navigation system with health overview, activity tracker, and user profile pages

### Vitals Recording & Analytics Features
- Full-featured vitals recording with validation (BP, HR, SpO2, Temp, Weight)
- Firestore CRUD operations with user-specific data segregation
- Interactive charts for health data visualization with date and type filters
- AI-powered health insights, personalized recommendations, and color-coded feedback cards
- Comprehensive navigation flows between dashboard and stats, activity, and chart insights

### Technical & UX Enhancements
- TypeScript and module resolution improvements
- Cross-platform compatibility (web/mobile)
- Cohesive design system and responsive layouts
- Documented services and architecture (including Chart and Firestore guides)
- Robust error handling, state management, and diagnostics
- Security enhancements with strict Firestore rules and email-based data separation

### New and Updated Pages
- Welcome (Onboarding)
- Login, Signup, and Forgot Password
- Dashboard
- Add Vitals
- Health Overview
- Activity Tracker
- User Profile
- Charts & Insights

### Ready For
- PDF health summary export (coming soon)
- Advanced analytics, predictions, and health data sharing
- Multi-user comparison and extended historic analytics

For technical guides and API documentation, see the dedicated `CHART_SERVICE_GUIDE.md` and `FIRESTORE_INDEX_SETUP.md` in the repo.

---

## Figma Design

All UI components and screens are designed in Figma. You can preview and collaborate on designs using the following link:

**View Full App Design**  
[HealthMate - Vitals Logger & PDF Summary (Figma Design)](https://figma.com/design/Bm6K2i92mDuEzeIjEvM5bI/HealthMate---Vitals-Loggers-and-PDF-Summary?node-id=3-4&t=wy48YMOUkTzVQGyZ-1)

Screens available in the design prototype:
- Login & Registration Pages
- Dashboard
- Vitals Logger
- Trend Analysis
- PDF Export
- User Profile
- Settings

---

## Getting Started

> **Note:** To view the latest code, go to the `master` branch of this repository.

1. Clone the repo:  
   ```bash
   git clone https://github.com/itz-rajshekhar18/HealthMate.git
   ```
2. Install dependencies and run the project as per the instructions in your preferred environment.

## License

This project is licensed under the MIT License.

---

## Feedback & Contributing

Feel free to submit issues and pull requests! Suggestions for the flow and design are welcome on the linked Figma boards.
