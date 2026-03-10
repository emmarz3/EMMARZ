# MediCare Hospital Management System

A comprehensive Hospital Management System with **Frontend** and **Backend** integration.

## 🚀 Features

### Frontend
- **Responsive Design** - Works on mobile, tablet, and desktop
- **Modern UI** - Clean, professional medical website design
- **6 HTML Pages**:
  - `index.html` - Main landing page with hero, services, doctors, testimonials
  - `services.html` - Detailed medical services listing
  - `doctors.html` - Searchable doctor directory with filtering
  - `appointment.html` - Online appointment booking system
  - `patient-portal.html` - Patient login/dashboard
  - `admin-dashboard.html` - Hospital administration panel

### Backend (Node.js + Express)
- **RESTful API** with full CRUD operations
- **Authentication** - Login/Register system
- **Database** - In-memory data storage (easily replaceable with real DB)
- **8 API Endpoints**:
  - `/api/doctors` - Get all doctors
  - `/api/patients` - Patient management
  - `/api/appointments` - Appointment booking & management
  - `/api/auth/login` - User authentication
  - `/api/auth/register` - User registration
  - `/api/dashboard/stats` - Dashboard statistics
  - `/api/departments` - Medical departments

## 📁 Project Structure

```
hospital-management/
├── index.html              # Main landing page
├── services.html          # Medical services
├── doctors.html           # Doctor profiles
├── appointment.html       # Book appointments
├── patient-portal.html    # Patient dashboard
├── admin-dashboard.html   # Admin panel
├── server.js             # Node.js backend server
├── package.json          # Dependencies
├── css/
│   ├── style.css         # Main styles
│   ├── responsive.css    # Mobile styles
│   └── admin.css        # Admin dashboard styles
└── js/
    ├── main.js           # Core functionality + API
    ├── doctors.js       # Doctor page logic
    ├── appointment.js   # Booking system
    └── admin.js        # Admin panel logic
```

## 🛠️ Installation & Running

### Prerequisites
- Node.js (v14 or higher)

### Steps

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Start the Server**
   ```bash
   npm start
   # or
   node server.js
   ```

3. **Open in Browser**
   ```
   http://localhost:3000
   ```

## 🔑 Demo Credentials

### Patient Portal
- **Email**: patient@medicare.com
- **Password**: patient123

### Admin Dashboard
- **Email**: admin@medicare.com
- **Password**: admin123

## 🎨 Technology Stack

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Backend**: Node.js, Express.js
- **Icons**: Font Awesome 6
- **Fonts**: Google Fonts (Poppins, Open Sans)

## 📱 Pages Overview

| Page | Description |
|------|-------------|
| Home | Hero slider, services overview, doctors showcase, testimonials |
| Services | 10+ medical departments with detailed info |
| Doctors | Searchable/filterable doctor directory |
| Appointment | Multi-step booking form with validation |
| Patient Portal | Login, register, view appointments, medical records |
| Admin Dashboard | Manage patients, appointments, doctors, view reports |

## 🔌 API Examples

```javascript
// Get all doctors
GET /api/doctors

// Create appointment
POST /api/appointments
{
  "patientName": "John Doe",
  "doctorId": "sarah-johnson",
  "date": "2024-03-20",
  "time": "10:00",
  "reason": "Heart checkup"
}

// Login
POST /api/auth/login
{
  "email": "patient@medicare.com",
  "password": "patient123"
}
```

## 📄 License

This project is for educational purposes.

---

**Built with ❤️ for Healthcare**

