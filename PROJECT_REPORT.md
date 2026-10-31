# Project Report
## Medical Camp & Student Health Record Management System

### Abstract
The Medical Camp & Student Health Record Management System is a web-based application intended to simplify student registration, medical camp scheduling, appointment booking, health record management and institutional announcements. It uses a browser-based interface, an Express backend and MongoDB persistence.

### Introduction
Educational institutions may organize periodic health camps and maintain student health information across separate registers or spreadsheets. A centralized system can improve coordination, retrieval and administrative visibility.

### Problem Statement
Manual processes can cause duplicate registrations, scheduling conflicts, delayed communication and difficulty retrieving previous visit details. Confidential records also require controlled access.

### Objectives
- Digitize student registration and profile management.
- Publish and manage medical camps.
- Allow students to book and cancel appointments.
- Store student health visit records with role restrictions.
- Publish general and department-specific announcements.
- Provide an administrative dashboard with current statistics.

### Existing System
In a manual or spreadsheet-based process, information may be distributed across files and registers. Searching, updating and coordinating appointments can be time-consuming, and access control may be inconsistent.

### Proposed System
The proposed application provides a centralized web interface with role-based login. Student, camp, appointment, health record and notification data are stored in MongoDB and accessed through Express routes and Mongoose models.

### System Requirements
**Hardware:** Computer with 4 GB RAM minimum, modern browser and internet/local network access.  
**Software:** Node.js 18+, npm, MongoDB Community Server or MongoDB Atlas, modern browser and code editor.

### System Architecture
Browser (HTML/CSS/Bootstrap/jQuery/JavaScript/EJS) → Express.js routes/controllers/middleware → Mongoose ODM → MongoDB. Session data is persisted using connect-mongo. bcrypt hashes passwords; CSRF middleware protects form submissions.

### Database Design
- Users: identity, unique email, password hash, role and optional Student reference.
- Students: unique Student ID, personal/academic/contact/guardian details.
- MedicalCamps: name, date/time, location, capacity, staff and active status.
- Appointments: Student and Camp ObjectId references, date and status; compound unique index prevents duplicate student/camp bookings.
- HealthRecords: Student reference, medical history, observations, assessment, treatment and doctor.
- Notifications: title, message, audience target, department and publishing user.

### Module Description
1. **Student Registration:** validates required details, checks duplicate ID/email and creates a student account.
2. **Camp Scheduling:** admin/staff can create and edit camps; admins can deactivate camps.
3. **Appointment Management:** students book camps; the application checks duplicate bookings and current capacity. Staff/admin update appointment status.
4. **Health Records:** admin/staff create and search clinical visit records. Students cannot access the records module.
5. **Notifications:** staff/admin publish announcements for all students or a selected department.
6. **Dashboard:** displays MongoDB counts and recent registrations, appointments and notifications.
7. **Authentication:** bcrypt password hashes, server-side sessions, CSRF tokens and role middleware.

### Implementation
The backend is built with Node.js and Express.js. Mongoose defines schemas and references. EJS renders dynamic pages; Bootstrap provides responsive layout; jQuery supports client-side validation and AJAX configuration. Environment variables store connection details and secrets.

### Testing
Refer to the README testing checklist. Execute each test locally and record actual results/screenshots before submission. Expected outcomes include duplicate registration rejection, duplicate appointment prevention, capacity checks, role restrictions and MongoDB persistence.

### Results
When configured and run successfully, the application provides a centralized interface for student records, camp schedules, appointments, health visits and announcements. Actual test results must be recorded after running the project in the target environment.

### Future Enhancements
- Atomic capacity allocation and booking transactions.
- Audit trail and immutable access logs.
- Email/SMS reminders and calendar integration.
- CSV/PDF exports and advanced reporting.
- Password reset, MFA and account lifecycle controls.
- Automated unit, integration and accessibility testing.
- Security/privacy review and deployment hardening.

### Conclusion
The project demonstrates a complete academic full-stack workflow using the required frontend, backend and database technologies. It offers a foundation for centralized medical camp administration while clearly separating academic demonstration use from production clinical systems.


## Premium modules added

- Analytics dashboard with appointment status and six-month activity charts.
- Medical camp calendar.
- Medicine inventory with stock adjustment, reorder alerts and expiry tracking.
- Admin audit trail for selected create/update actions.
- Student digital health card with authenticated QR destination.
- Login and registration rate limiting.
- Responsive premium visual theme.

These features are intended for academic demonstration. Validate all workflows locally before presenting; do not store real patient data in a public demo.
