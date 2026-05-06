# **App Name**: HostelFlow

## Core Features:

- Secure Multi-Role Authentication: User login system using Phone OTP for students, and Email/Password for Admin and Dean roles, with pre-registration by Admin for students. Leverages Firebase Authentication for security.
- Student Check-in/Check-out: Students record entry/exit by capturing a selfie, with automatic timestamping and GPS location verification (to ensure they are within hostel premises). Saves data to Firestore and images to Firebase Storage.
- Visitor Management: Students can register visitors, capture their details (name, phone, reason), and take a joint selfie for proof. This system also tracks entry and exit times for visitors.
- AI-Powered Selfie Verification Tool: A tool that analyzes captured selfies to confirm the presence of faces and potentially count faces for visitor entries, adding a layer of verification for entry records.
- Real-time Dashboard & Reporting: Admin and Dean users can view all student and visitor entry/exit data in real-time, with filtering capabilities (e.g., 'In/Out' status, 'Hostel Type'). Dean's view is read-only.
- Student Enrollment & Management (Admin): Admin users can add new students (name, roll, phone, hostel, room) to the system for pre-registration, and mark existing students as inactive.
- Personal Entry History: Students can view their own historical check-in, check-out, and visitor entry records within the application.

## Style Guidelines:

- A calm, modern, and trustworthy aesthetic is achieved with a primary color 'Arctic Blue' (#21AFDE) for actions and highlights. This hue represents clarity and efficiency, vital for a management system.
- The background uses a subtly tinted white 'Whisper Blue' (#ECF6F9), which is visibly related to the primary color but ensures optimal readability and a fresh, clean interface.
- An energetic accent color, 'Teal Horizon' (#0CC7BA), provides visual contrast for important call-to-actions and status indicators, aligning with the dynamic nature of real-time data.
- A single sans-serif font, 'Inter', for both headlines and body text. Its modern, neutral, and highly readable design ensures clarity across all data and user interactions.
- Utilize a consistent set of clean, minimalist vector icons that clearly communicate functionality. Icons should support quick recognition of actions and statuses, especially on mobile devices.
- Adopt a responsive, card-based layout that organizes information hierarchically. This approach ensures an intuitive user experience on both web and progressive web app (PWA) contexts, emphasizing mobile usability.
- Subtle, non-distracting micro-animations for interactive elements such as button presses, form submissions, and data loading. These animations should provide immediate feedback and enhance the perceived responsiveness of the application.