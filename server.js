// MediCare Hospital Management System - Backend Server
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { v4: uuidv4 } = require('uuid');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname)));

// In-memory data storage (in production, use a database)
let doctors = [
    {
        id: 'sarah-johnson',
        name: 'Dr. Sarah Johnson',
        specialty: 'Cardiology',
        email: 'sarah.johnson@medicare.com',
        phone: '+1 (555) 123-4567',
        experience: '15 years',
        status: 'available',
        image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400',
        availableSlots: ['09:00', '09:30', '10:00', '10:30', '11:00', '14:00', '14:30', '15:00']
    },
    {
        id: 'michael-chen',
        name: 'Dr. Michael Chen',
        specialty: 'Neurology',
        email: 'michael.chen@medicare.com',
        phone: '+1 (555) 234-5678',
        experience: '12 years',
        status: 'available',
        image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400',
        availableSlots: ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00']
    },
    {
        id: 'emily-williams',
        name: 'Dr. Emily Williams',
        specialty: 'Pediatrics',
        email: 'emily.williams@medicare.com',
        phone: '+1 (555) 345-6789',
        experience: '10 years',
        status: 'available',
        image: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=400',
        availableSlots: ['09:00', '09:30', '10:30', '11:00', '15:00', '15:30']
    },
    {
        id: 'james-anderson',
        name: 'Dr. James Anderson',
        specialty: 'Orthopedics',
        email: 'james.anderson@medicare.com',
        phone: '+1 (555) 456-7890',
        experience: '18 years',
        status: 'busy',
        image: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=400',
        availableSlots: ['10:00', '11:00', '14:00', '16:00']
    },
    {
        id: 'robert-martinez',
        name: 'Dr. Robert Martinez',
        specialty: 'General Medicine',
        email: 'robert.martinez@medicare.com',
        phone: '+1 (555) 567-8901',
        experience: '20 years',
        status: 'available',
        image: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=400',
        availableSlots: ['09:00', '09:30', '10:00', '10:30', '11:30', '14:00', '14:30', '15:00', '15:30', '16:00']
    },
    {
        id: 'lisa-thompson',
        name: 'Dr. Lisa Thompson',
        specialty: 'Ophthalmology',
        email: 'lisa.thompson@medicare.com',
        phone: '+1 (555) 678-9012',
        experience: '14 years',
        status: 'available',
        image: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=400',
        availableSlots: ['09:00', '10:00', '11:00', '14:30', '15:30']
    },
    {
        id: 'david-wilson',
        name: 'Dr. David Wilson',
        specialty: 'Pulmonology',
        email: 'david.wilson@medicare.com',
        phone: '+1 (555) 789-0123',
        experience: '11 years',
        status: 'available',
        image: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=400',
        availableSlots: ['09:30', '10:30', '11:00', '14:00', '15:00']
    },
    {
        id: 'jennifer-lee',
        name: 'Dr. Jennifer Lee',
        specialty: 'Gastroenterology',
        email: 'jennifer.lee@medicare.com',
        phone: '+1 (555) 890-1234',
        experience: '13 years',
        status: 'available',
        image: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=400',
        availableSlots: ['09:00', '10:00', '14:00', '15:00', '16:00']
    }
];

let patients = [
    {
        id: 'P001',
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@email.com',
        phone: '+1 (555) 111-2222',
        dob: '1990-05-15',
        gender: 'male',
        bloodType: 'O+',
        address: '123 Main St, City',
        status: 'active',
        createdAt: '2024-01-15T10:00:00Z'
    },
    {
        id: 'P002',
        firstName: 'Jane',
        lastName: 'Smith',
        email: 'jane.smith@email.com',
        phone: '+1 (555) 222-3333',
        dob: '1985-08-22',
        gender: 'female',
        bloodType: 'A+',
        address: '456 Oak Ave, Town',
        status: 'active',
        createdAt: '2024-01-20T14:30:00Z'
    },
    {
        id: 'P003',
        firstName: 'Michael',
        lastName: 'Brown',
        email: 'michael.brown@email.com',
        phone: '+1 (555) 333-4444',
        dob: '1978-12-10',
        gender: 'male',
        bloodType: 'B+',
        address: '789 Pine Rd, Village',
        status: 'active',
        createdAt: '2024-02-01T09:15:00Z'
    }
];

let appointments = [
    {
        id: 'APT001',
        patientId: 'P001',
        patientName: 'John Doe',
        doctorId: 'sarah-johnson',
        doctorName: 'Dr. Sarah Johnson',
        department: 'Cardiology',
        date: new Date().toISOString().split('T')[0],
        time: '09:00',
        reason: 'Regular heart checkup',
        type: 'followup',
        status: 'confirmed',
        createdAt: new Date().toISOString()
    },
    {
        id: 'APT002',
        patientId: 'P002',
        patientName: 'Jane Smith',
        doctorId: 'michael-chen',
        doctorName: 'Dr. Michael Chen',
        department: 'Neurology',
        date: new Date().toISOString().split('T')[0],
        time: '10:30',
        reason: 'Headache consultation',
        type: 'new',
        status: 'confirmed',
        createdAt: new Date().toISOString()
    },
    {
        id: 'APT003',
        patientId: 'P003',
        patientName: 'Michael Brown',
        doctorId: 'emily-williams',
        doctorName: 'Dr. Emily Williams',
        department: 'Pediatrics',
        date: new Date(Date.now() + 86400000).toISOString().split('T')[0],
        time: '14:00',
        reason: 'Child vaccination',
        type: 'new',
        status: 'pending',
        createdAt: new Date().toISOString()
    }
];

let users = [
    {
        id: 'admin-001',
        username: 'admin',
        password: 'admin123',
        email: 'admin@medicare.com',
        role: 'admin',
        name: 'Admin User'
    },
    {
        id: 'patient-001',
        username: 'patient',
        password: 'patient123',
        email: 'patient@medicare.com',
        role: 'patient',
        name: 'John Doe'
    }
];

// API Routes

// Get all doctors
app.get('/api/doctors', (req, res) => {
    res.json({
        success: true,
        data: doctors
    });
});

// Get doctor by ID
app.get('/api/doctors/:id', (req, res) => {
    const doctor = doctors.find(d => d.id === req.params.id);
    if (doctor) {
        res.json({ success: true, data: doctor });
    } else {
        res.status(404).json({ success: false, message: 'Doctor not found' });
    }
});

// Get doctors by specialty
app.get('/api/doctors/specialty/:specialty', (req, res) => {
    const filtered = doctors.filter(d => 
        d.specialty.toLowerCase().includes(req.params.specialty.toLowerCase())
    );
    res.json({ success: true, data: filtered });
});

// Get all patients
app.get('/api/patients', (req, res) => {
    res.json({
        success: true,
        data: patients
    });
});

// Get patient by ID
app.get('/api/patients/:id', (req, res) => {
    const patient = patients.find(p => p.id === req.params.id);
    if (patient) {
        res.json({ success: true, data: patient });
    } else {
        res.status(404).json({ success: false, message: 'Patient not found' });
    }
});

// Add new patient
app.post('/api/patients', (req, res) => {
    const newPatient = {
        id: 'P' + String(patients.length + 1).padStart(3, '0'),
        ...req.body,
        status: 'active',
        createdAt: new Date().toISOString()
    };
    patients.push(newPatient);
    res.json({ success: true, data: newPatient });
});

// Update patient
app.put('/api/patients/:id', (req, res) => {
    const index = patients.findIndex(p => p.id === req.params.id);
    if (index !== -1) {
        patients[index] = { ...patients[index], ...req.body };
        res.json({ success: true, data: patients[index] });
    } else {
        res.status(404).json({ success: false, message: 'Patient not found' });
    }
});

// Delete patient
app.delete('/api/patients/:id', (req, res) => {
    const index = patients.findIndex(p => p.id === req.params.id);
    if (index !== -1) {
        patients.splice(index, 1);
        res.json({ success: true, message: 'Patient deleted' });
    } else {
        res.status(404).json({ success: false, message: 'Patient not found' });
    }
});

// Get all appointments
app.get('/api/appointments', (req, res) => {
    res.json({
        success: true,
        data: appointments
    });
});

// Get appointment by ID
app.get('/api/appointments/:id', (req, res) => {
    const appointment = appointments.find(a => a.id === req.params.id);
    if (appointment) {
        res.json({ success: true, data: appointment });
    } else {
        res.status(404).json({ success: false, message: 'Appointment not found' });
    }
});

// Get appointments by patient
app.get('/api/appointments/patient/:patientId', (req, res) => {
    const filtered = appointments.filter(a => a.patientId === req.params.patientId);
    res.json({ success: true, data: filtered });
});

// Get appointments by doctor
app.get('/api/appointments/doctor/:doctorId', (req, res) => {
    const filtered = appointments.filter(a => a.doctorId === req.params.doctorId);
    res.json({ success: true, data: filtered });
});

// Get today's appointments
app.get('/api/appointments/today', (req, res) => {
    const today = new Date().toISOString().split('T')[0];
    const todayAppointments = appointments.filter(a => a.date === today);
    res.json({ success: true, data: todayAppointments });
});

// Create new appointment
app.post('/api/appointments', (req, res) => {
    const newAppointment = {
        id: 'APT' + String(appointments.length + 1).padStart(3, '0'),
        ...req.body,
        status: 'pending',
        createdAt: new Date().toISOString()
    };
    appointments.push(newAppointment);
    res.json({ success: true, data: newAppointment });
});

// Update appointment
app.put('/api/appointments/:id', (req, res) => {
    const index = appointments.findIndex(a => a.id === req.params.id);
    if (index !== -1) {
        appointments[index] = { ...appointments[index], ...req.body };
        res.json({ success: true, data: appointments[index] });
    } else {
        res.status(404).json({ success: false, message: 'Appointment not found' });
    }
});

// Cancel appointment
app.delete('/api/appointments/:id', (req, res) => {
    const index = appointments.findIndex(a => a.id === req.params.id);
    if (index !== -1) {
        appointments[index].status = 'cancelled';
        res.json({ success: true, message: 'Appointment cancelled' });
    } else {
        res.status(404).json({ success: false, message: 'Appointment not found' });
    }
});

// Login
app.post('/api/auth/login', (req, res) => {
    const { email, password } = req.body;
    const user = users.find(u => u.email === email && u.password === password);
    
    if (user) {
        const { password: _, ...userWithoutPassword } = user;
        res.json({ success: true, data: userWithoutPassword });
    } else {
        res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
});

// Register
app.post('/api/auth/register', (req, res) => {
    const { email, password, firstName, lastName, phone, dob } = req.body;
    
    // Check if user exists
    if (users.find(u => u.email === email)) {
        return res.status(400).json({ success: false, message: 'Email already exists' });
    }
    
    // Create new user
    const newUser = {
        id: uuidv4(),
        email,
        password,
        role: 'patient',
        name: `${firstName} ${lastName}`
    };
    users.push(newUser);
    
    // Create patient record
    const newPatient = {
        id: 'P' + String(patients.length + 1).padStart(3, '0'),
        firstName,
        lastName,
        email,
        phone,
        dob,
        status: 'active',
        createdAt: new Date().toISOString()
    };
    patients.push(newPatient);
    
    const { password: _, ...userWithoutPassword } = newUser;
    res.json({ success: true, data: userWithoutPassword });
});

// Dashboard statistics
app.get('/api/dashboard/stats', (req, res) => {
    const today = new Date().toISOString().split('T')[0];
    
    const stats = {
        totalPatients: patients.length,
        todayAppointments: appointments.filter(a => a.date === today).length,
        totalDoctors: doctors.length,
        pendingAppointments: appointments.filter(a => a.status === 'pending').length,
        completedAppointments: appointments.filter(a => a.status === 'confirmed').length,
        cancelledAppointments: appointments.filter(a => a.status === 'cancelled').length
    };
    
    res.json({ success: true, data: stats });
});

// Get departments
app.get('/api/departments', (req, res) => {
    const departments = [
        { id: 'cardiology', name: 'Cardiology', icon: 'fa-heartbeat' },
        { id: 'neurology', name: 'Neurology', icon: 'fa-brain' },
        { id: 'orthopedics', name: 'Orthopedics', icon: 'fa-bone' },
        { id: 'pediatrics', name: 'Pediatrics', icon: 'fa-baby' },
        { id: 'general-medicine', name: 'General Medicine', icon: 'fa-user-nurse' },
        { id: 'ophthalmology', name: 'Ophthalmology', icon: 'fa-eye' },
        { id: 'pulmonology', name: 'Pulmonology', icon: 'fa-lungs' },
        { id: 'gastroenterology', name: 'Gastroenterology', icon: 'fa-utensils' },
        { id: 'dermatology', name: 'Dermatology', icon: 'fa-user-md' },
        { id: 'gynecology', name: 'Gynecology', icon: 'fa-female' }
    ];
    res.json({ success: true, data: departments });
});

// Serve static files
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Start server
app.listen(PORT, () => {
    console.log(`\n🏥 MediCare Hospital Management System`);
    console.log(`   Server running at: http://localhost:${PORT}`);
    console.log(`   Admin Dashboard: http://localhost:${PORT}/admin-dashboard.html`);
    console.log(`   Patient Portal: http://localhost:${PORT}/patient-portal.html\n`);
});

module.exports = app;

