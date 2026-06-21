# Edura Non-Screen System Functions

| # | Feature | System Function | Description |
|---|---|---|---|
| 1 | Authentication | Local Auth API | Provides endpoints for local user registration and JWT-based authentication for both Students and Tutors. |
| 2 | Authentication | Google SSO | Handles single sign-on authentication flow via Google OAuth. |
| 3 | Authentication | Token Management | Manages short-lived access tokens, refresh token issuance, and secure logout mechanisms. |
| 4 | Authentication | OTP & Password Recovery | Handles OTP generation, email delivery, OTP verification, and secure password reset workflows. |
| 5 | Notification | SMTP Email Service | Background service responsible for dispatching transactional emails (e.g., OTPs, booking status, application results). |
| 6 | Notification | Event-Driven Alerts | System listening to internal domain events (Booking Created, Dispute Opened, Review Submitted) to trigger automated notifications. |
| 7 | Payment | Gateway Integration | Service interfacing with the PayOS payment gateway to generate payment links and manage transaction states. |
| 8 | Payment | Webhook Handler | API endpoint listening for asynchronous callbacks from the payment gateway to automatically confirm or reject booking payments. |
| 9 | Booking | Session Generator | Service that automatically provisions a schedule of learning sessions once a booking package is confirmed. |
| 10 | Booking | Rescheduling Workflow | Handles the business logic for session date modifications: proposing, approving, or rejecting new session times. |
| 11 | Booking | Attendance Tracking | API enabling Tutors to mark attendance and Students to confirm their participation in a session. |
| 12 | Chat | Real-time WebSockets | Socket.io gateway managing real-time bidirectional messaging, connection states, and read receipts between users. |
| 13 | Meeting | Google Meet Provider | Service that automatically interacts with Google APIs to provision unique Google Meet links for scheduled learning sessions. |
| 14 | Recommendation | AI Tutor Matching | HTTP service interacting with an external AI model to suggest the most suitable tutors based on student requirements. |
| 15 | Storage | Cloud File Storage | Service handling the direct or buffered upload of files, documents, and user avatars to Cloudinary or Supabase. |
| 16 | Storage | Presigned URLs | API generating secure, time-limited URLs to allow clients to upload large files directly to cloud storage providers. |
| 17 | Tutor Application | Application Workflow | System managing the lifecycle of tutor applications from submission to administrator approval or rejection. |
| 18 | Tutor Request | Bidding System | Workflow allowing students to broadcast tutoring requests, tutors to submit bids, and students to select their preferred tutor. |
| 19 | Dispute | Dispute Resolution | API flow handling the creation of session disputes, facilitating dispute communication, and allowing admins to resolve them. |
| 20 | System Sync | RabbitMQ Event Publisher | Background process syncing crucial user and tutor profile updates to external microservices via a RabbitMQ message broker. |
| 21 | Resource | Content Management API | CRUD APIs enabling the creation, retrieval, updating, and deletion of internal learning materials and teaching documents. |
| 22 | Schedule | Availability Manager | API processing the logic for tutors to define, update, and expose their recurring or specific available time slots. |
| 23 | Academic Catalog | Subject/Grade Indexing | API for administrators to manage the core platform metadata, including standardized academic subjects and grade levels. |
| 24 | Health Check | System Monitoring | API endpoint utilized by monitoring tools to verify the operational status of the application, Prisma Database, and Redis instances. |
