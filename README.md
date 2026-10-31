# Medical Camp & Student Health Record Management System

A full-stack academic project built with HTML5, CSS3, Bootstrap 5, jQuery, JavaScript, Node.js, Express.js, MongoDB and Mongoose.

## Features
- Student self-registration and login, with unique Student ID/email checks.
- Role-based Admin, Staff and Student access.
- Premium admin/doctor dashboard with live MongoDB counts, appointment status chart, six-month appointment analytics, recent activity and low-stock watchlist.
- Student CRUD, camp CRUD/deactivation, appointment booking/cancellation/status updates.
- Duplicate appointment prevention and capacity checks.
- Confidential health record creation/search for Admin, Staff and Doctors; students can see only their own records.
- All-student and department-targeted announcements.
- Session storage in MongoDB, bcrypt password hashing, CSRF protection, Helmet and server-side access checks.
- JSON API endpoints under `/api`.
- Medical camp calendar with upcoming schedule cards.
- Medicine inventory with batch, expiry, reorder-level alerts and stock adjustments.
- Admin audit trail for key record, camp, appointment, inventory and doctor-account changes.
- Student digital health card with QR code that opens an authenticated card page; the QR contains no clinical details.
- Login and registration attempt rate limiting.

## Requirements
- Node.js 18 or newer (20 LTS recommended)
- MongoDB Community Server or a MongoDB Atlas database
- npm

## Run locally (Windows / macOS / Linux)
1. Install Node.js and MongoDB. Start the MongoDB service, or create an Atlas cluster.
2. Extract this project and open a terminal in `medical-camp-management`.
3. Install packages:
   ```bash
   npm install
   ```
4. Copy `.env.example` to `.env` and set `MONGODB_URI` and a long random `SESSION_SECRET`.
   - Local MongoDB default: `mongodb://127.0.0.1:27017/medical_camp_management`
   - Atlas: use your connection string and URL-encode special password characters.
5. Create the demo administrator:
   ```bash
   npm run seed
   ```
6. Start the application:
   ```bash
   npm run dev
   ```
7. Open `http://localhost:3000`.

Demo administrator credentials (change immediately for any shared deployment):
- Email: `admin@medicamp.local`
- Password: `Admin@12345`

Students can register at `/register`. Student registration creates a student account. Admin can create camps, manage students, appointments and notifications. Admin/Staff can create health records.

## Roles and access
- **Admin:** dashboard, student CRUD, camps, appointments, records, notifications.
- **Staff:** dashboard, students, camps, appointments, records and notifications; cannot delete students or deactivate camps.
- **Student:** own dashboard, own appointments, camp browsing, booking/cancellation, profile and notifications.
- Students can view only health records linked to their own authenticated Student ID. Other student records are not exposed to them.

## Main routes
| Method | Route | Purpose |
|---|---|---|
| GET/POST | `/register` | Student registration |
| GET/POST | `/login` | Authentication |
| POST | `/logout` | Logout |
| GET | `/admin` | Admin/staff dashboard |
| GET/POST | `/admin/students` | List/create students |
| GET/POST | `/admin/students/:id` | Edit student |
| POST | `/admin/students/:id/delete` | Delete student (admin) |
| GET/POST | `/camps` | Browse/create camps |
| GET/POST | `/camps/:id` | Update camp |
| GET | `/appointments` | Appointment list |
| GET/POST | `/appointments/book` and `/appointments` | Booking |
| POST | `/appointments/:id/status` | Status/cancellation |
| GET/POST | `/records` | View/create health records (admin/staff/doctor) |
| GET/POST | `/notifications` | View/publish announcements |
| `/api/*` | JSON API | Student, camp, appointment and record endpoints |

## Database collections
- `users`: login email, bcrypt hash, role, optional student reference.
- `students`: unique Student ID, identity, academic, contact and guardian information.
- `medicalcamps`: camp timing, location, staff, capacity and active flag.
- `appointments`: student/camp references, date and status; unique compound index on student + camp.
- `healthrecords`: student reference and clinical visit details.
- `notifications`: announcement content, audience target and author.
- `sessions`: server-side Express sessions stored by connect-mongo.

## Testing checklist
| Test | Steps | Expected result |
|---|---|---|
| Student registration | Submit valid registration | Student and student login created |
| Duplicate student | Reuse Student ID or email | Registration rejected |
| Student login | Log in with registered credentials | Student dashboard opens |
| Admin login | Use seeded admin | Admin dashboard opens |
| Student CRUD | Add/edit/delete from admin | Database reflects change |
| Camp management | Create/edit/deactivate camp | Camp list reflects changes |
| Appointment booking | Student books active camp | Confirmed appointment created |
| Duplicate booking | Book same camp again | Rejected |
| Capacity | Fill camp capacity and try another booking | Rejected |
| Cancellation | Student cancels own pending/confirmed booking | Status becomes Cancelled |
| Health record | Staff adds record for student | Record appears in staff record list |
| Privacy | Student requests `/records` | HTTP 403 |
| Notification | Admin publishes announcement | Notification appears to audience |
| Persistence | Restart server and sign in again | MongoDB data remains |
| CSRF | Submit form without valid CSRF token | Request rejected |

Run these tests manually in a local demo environment. Do not report them as passed until actually executed.

## Deployment (example: Render + MongoDB Atlas)
1. Push the project to a private Git repository; never commit `.env`.
2. Create a MongoDB Atlas cluster and database user. Restrict network access to the deployment provider where possible.
3. Create a web service on Render and connect the repository.
4. Build command: `npm install`; start command: `npm start`.
5. Add environment variables in the host dashboard: `NODE_ENV=production`, `MONGODB_URI`, `SESSION_SECRET`, and optionally `PORT` if required by the host.
6. Deploy and open the HTTPS URL supplied by the host.
7. Run the seed command securely once, or create the first admin using a controlled setup process. Remove/change demo credentials before public access.
8. Verify HTTPS cookies, login, role restrictions, database persistence and all major workflows.

## Important security and academic limitations
This project is intended for academic demonstration with fictional sample data. It is **not production-ready for real patient information**. A real deployment needs a formal privacy/security review, legal and regulatory assessment, strong operational controls, audit logging, backup/retention policies, encryption and clinical governance. Do not enter real patient data into a public demo.

## Known scope notes
- This starter implementation uses EJS templates for server-rendered pages, alongside HTML, CSS, Bootstrap, jQuery and JavaScript.
- The JSON API currently exposes core read/create/update/delete operations for students, camp listing/creation, appointments and health-record lookup. Browser UI uses protected Express routes and MongoDB models.
- For a production-grade multi-user booking system, implement an atomic capacity reservation transaction (with replica-set support), rate limits on all authentication endpoints, audit logs, password reset, stronger schema validation and automated integration tests.


## Premium enhancements
- Admin can create doctor login accounts from **Doctors** in the navigation. Doctor accounts can access the doctor dashboard and health-record functions, but not student/camp administration.
- Dashboard includes an appointment-status chart.
- Health-record list supports searching by student name or student ID.
- Health records can be exported as an Excel-compatible CSV file.
- Each health record has a print-friendly page; use the browser Print dialog and choose **Save as PDF**.
- Medical camp calendar, medicine inventory, expiry and low-stock alerts, admin audit trail, student QR health card and login/register rate limiting have been added.
- Existing student, camp, appointment, notification, and student-only health-record visibility workflows are retained.

### Doctor login setup
1. Sign in using an administrator account.
2. Open **Doctors** in the navigation.
3. Create a doctor account with a unique email and a password of at least 8 characters.
4. Sign out and sign in with the doctor's email and password.

### Exports
- Open **Health Records** and choose **Export Excel CSV** to download a CSV that opens in Excel.
- Choose **Print / PDF** beside a record, then use **Print → Save as PDF** in the browser.

## Premium module verification checklist
- [ ] Open **Calendar** as a signed-in user and verify active camps are listed by date.
- [ ] Add an inventory item as Admin/Staff; verify it appears in Inventory.
- [ ] Adjust stock up and down; verify negative stock is rejected.
- [ ] Set quantity at or below reorder level; verify low-stock alert appears on the dashboard.
- [ ] Set an expiry date within 30 days; verify the expiry counter increments.
- [ ] Create a camp, health record, appointment, or inventory item; verify Admin can see the event in **Audit Trail**.
- [ ] Sign in as a student and open **My health card**; verify QR opens the authenticated health-card route.
- [ ] Verify a student cannot open `/records`, `/inventory`, or `/admin/audit`.
- [ ] Verify a non-admin cannot open `/admin/audit`.
- [ ] Verify the site layout at desktop and mobile widths.

The QR health card is an identity/check-in aid only; it does not expose medical information in the QR payload. The audit trail is a basic academic audit log, not a tamper-proof compliance system.
