// MediCare Hospital - Admin Dashboard JavaScript with API

document.addEventListener('DOMContentLoaded', function() {
    initAdmin();
});

// Initialize Admin Dashboard
function initAdmin() {
    initNavigation();
    loadDashboardData();
    loadDoctorsFromAPI();
    loadPatientsFromAPI();
    loadAppointmentsFromAPI();
    initFilters();
    initMobileMenu();
}

// Navigation
function initNavigation() {
    const navItems = document.querySelectorAll('.admin-nav-item');
    
    navItems.forEach(item => {
        item.addEventListener('click', function() {
            const section = this.dataset.section;
            switchSection(section);
        });
    });
}

function switchSection(sectionId) {
    document.querySelectorAll('.admin-nav-item').forEach(item => {
        item.classList.remove('active');
        if (item.dataset.section === sectionId) {
            item.classList.add('active');
        }
    });

    document.querySelectorAll('.admin-section').forEach(section => {
        section.classList.remove('active');
    });
    document.getElementById(sectionId).classList.add('active');

    const sidebar = document.querySelector('.admin-sidebar');
    sidebar.classList.remove('active');
}

// Mobile Menu
function initMobileMenu() {
    const toggle = document.getElementById('adminMenuToggle');
    const sidebar = document.querySelector('.admin-sidebar');
    
    if (toggle && sidebar) {
        toggle.addEventListener('click', () => {
            sidebar.classList.toggle('active');
        });
    }
}

// Load Dashboard Data from API
async function loadDashboardData() {
    const result = await MediCare.API.get('/dashboard/stats');
    
    if (result.success) {
        const stats = result.data;
        document.getElementById('totalPatients').textContent = stats.totalPatients || 0;
        document.getElementById('todayAppointments').textContent = stats.todayAppointments || 0;
        document.getElementById('pendingAppointments').textContent = stats.pendingAppointments || 0;
    }

    // Load recent appointments
    loadRecentAppointments();
}

async function loadRecentAppointments() {
    const result = await MediCare.API.get('/appointments');
    const container = document.getElementById('recentAppointments');
    
    if (result.success) {
        const appointments = result.data.slice(0, 5);
        
        if (appointments.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-calendar-times"></i>
                    <p>No recent appointments</p>
                </div>
            `;
            return;
        }

        container.innerHTML = appointments.map(apt => {
            const date = new Date(apt.date);
            const formattedDate = date.toLocaleDateString('en-US', {
                weekday: 'short', month: 'short', day: 'numeric'
            });
            
            const formattedTime = MediCare.formatTime(apt.time || '09:00');

            return `
                <div class="appointment-item">
                    <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100" alt="Patient" class="appointment-avatar">
                    <div class="appointment-info">
                        <h4>${apt.patientName}</h4>
                        <p>${apt.doctorName} - ${apt.department}</p>
                    </div>
                    <div class="appointment-time">
                        <span>${formattedDate}</span>
                        <span class="status ${apt.status}">${apt.status}</span>
                    </div>
                </div>
            `;
        }).join('');
    }
}

// Load Doctors from API
async function loadDoctorsFromAPI() {
    const result = await MediCare.API.get('/doctors');
    const container = document.getElementById('doctorsGrid');
    
    if (result.success) {
        container.innerHTML = result.data.map(doctor => `
            <div class="doctor-admin-card">
                <div class="doctor-admin-header">
                    <img src="${doctor.image}" alt="${doctor.name}" onerror="this.src='https://via.placeholder.com/80?text=Dr'">
                </div>
                <div class="doctor-admin-body">
                    <h3>${doctor.name}</h3>
                    <span class="specialty">${doctor.specialty}</span>
                    <div class="doctor-meta">
                        <p><i class="fas fa-envelope"></i> ${doctor.email}</p>
                        <p><i class="fas fa-phone-alt"></i> ${doctor.phone}</p>
                        <p><i class="fas fa-briefcase"></i> ${doctor.experience}</p>
                    </div>
                </div>
                <div class="doctor-admin-footer">
                    <button class="btn btn-sm btn-primary" onclick="viewDoctor('${doctor.id}')">
                        <i class="fas fa-eye"></i> View
                    </button>
                    <button class="btn btn-sm btn-outline" onclick="editDoctor('${doctor.id}')">
                        <i class="fas fa-edit"></i> Edit
                    </button>
                </div>
            </div>
        `).join('');
    }
}

// Load Patients from API
async function loadPatientsFromAPI() {
    const result = await MediCare.API.get('/patients');
    const container = document.getElementById('patientsTable');
    
    if (result.success) {
        container.innerHTML = result.data.map(patient => {
            const dob = new Date(patient.dob);
            const formattedDob = dob.toLocaleDateString('en-US', {
                year: 'numeric', month: 'short', day: 'numeric'
            });

            return `
                <tr>
                    <td>${patient.id}</td>
                    <td>${patient.firstName} ${patient.lastName}</td>
                    <td>${patient.email}</td>
                    <td>${patient.phone}</td>
                    <td>${formattedDob}</td>
                    <td>${patient.bloodType || 'N/A'}</td>
                    <td><span class="badge badge-${patient.status === 'active' ? 'success' : 'warning'}">${patient.status}</span></td>
                    <td>
                        <div class="table-actions">
                            <button class="edit-btn" onclick="viewPatient('${patient.id}')"><i class="fas fa-eye"></i></button>
                            <button class="edit-btn" onclick="editPatient('${patient.id}')"><i class="fas fa-edit"></i></button>
                            <button class="delete-btn" onclick="deletePatient('${patient.id}')"><i class="fas fa-trash"></i></button>
                        </div>
                    </td>
                </tr>
            `;
        }).join('');
    }
}

// Load Appointments from API
async function loadAppointmentsFromAPI() {
    const result = await MediCare.API.get('/appointments');
    const container = document.getElementById('appointmentsTable');
    
    if (result.success) {
        renderAppointmentsTable(result.data);
    } else {
        // Load sample data if API fails
        renderAppointmentsTable(getSampleAppointments());
    }
}

function renderAppointmentsTable(appointments) {
    const container = document.getElementById('appointmentsTable');
    
    container.innerHTML = appointments.map(apt => {
        const date = new Date(apt.date);
        const formattedDate = date.toLocaleDateString('en-US', {
            year: 'numeric', month: 'short', day: 'numeric'
        });
        
        const formattedTime = MediCare.formatTime(apt.time || '09:00');
        const statusClass = apt.status === 'confirmed' ? 'success' : apt.status === 'pending' ? 'warning' : 'danger';

        return `
            <tr>
                <td>${apt.id}</td>
                <td>${apt.patientName}</td>
                <td>${apt.doctorName}</td>
                <td>${apt.department}</td>
                <td>${formattedDate}</td>
                <td>${formattedTime}</td>
                <td><span class="badge badge-${statusClass}">${apt.status}</span></td>
                <td>
                    <div class="table-actions">
                        <button class="edit-btn" onclick="viewAppointment('${apt.id}')"><i class="fas fa-eye"></i></button>
                        <button class="edit-btn" onclick="editAppointment('${apt.id}')"><i class="fas fa-edit"></i></button>
                        <button class="delete-btn" onclick="cancelAppointment('${apt.id}')"><i class="fas fa-times"></i></button>
                    </div>
                </td>
            </tr>
        `;
    }).join('');

    // Update stats
    const pendingCount = appointments.filter(a => a.status === 'pending').length;
    document.getElementById('pendingAppointments').textContent = pendingCount;
}

function getSampleAppointments() {
    return [
        { id: 'APT001', patientName: 'John Doe', doctorName: 'Dr. Sarah Johnson', department: 'Cardiology', date: new Date().toISOString().split('T')[0], time: '09:00', status: 'confirmed' },
        { id: 'APT002', patientName: 'Jane Smith', doctorName: 'Dr. Michael Chen', department: 'Neurology', date: new Date().toISOString().split('T')[0], time: '10:30', status: 'confirmed' },
        { id: 'APT003', patientName: 'Michael Brown', doctorName: 'Dr. Emily Williams', department: 'Pediatrics', date: new Date().toISOString().split('T')[0], time: '14:00', status: 'pending' }
    ];
}

// Initialize Filters
function initFilters() {
    const statusFilter = document.getElementById('appointmentStatusFilter');
    const dateFilter = document.getElementById('appointmentDateFilter');
    
    if (statusFilter) {
        statusFilter.addEventListener('change', filterAppointments);
    }
    if (dateFilter) {
        dateFilter.addEventListener('change', filterAppointments);
    }

    const patientSearch = document.getElementById('patientSearch');
    if (patientSearch) {
        patientSearch.addEventListener('input', filterPatients);
    }
}

async function filterAppointments() {
    const status = document.getElementById('appointmentStatusFilter').value;
    const date = document.getElementById('appointmentDateFilter').value;
    
    let result = await MediCare.API.get('/appointments');
    let appointments = result.success ? result.data : getSampleAppointments();

    if (status) {
        appointments = appointments.filter(apt => apt.status === status);
    }
    if (date) {
        appointments = appointments.filter(apt => apt.date === date);
    }

    renderAppointmentsTable(appointments);
}

function resetFilters() {
    document.getElementById('appointmentStatusFilter').value = '';
    document.getElementById('appointmentDateFilter').value = '';
    loadAppointmentsFromAPI();
}

async function filterPatients() {
    const search = document.getElementById('patientSearch').value.toLowerCase();
    const result = await MediCare.API.get('/patients');
    const container = document.getElementById('patientsTable');
    
    let patients = result.success ? result.data : [];
    
    const filtered = patients.filter(p => 
        (p.firstName + ' ' + p.lastName).toLowerCase().includes(search) || 
        p.email.toLowerCase().includes(search) ||
        p.id.toLowerCase().includes(search)
    );
    
    container.innerHTML = filtered.map(patient => {
        const dob = new Date(patient.dob);
        const formattedDob = dob.toLocaleDateString('en-US', {
            year: 'numeric', month: 'short', day: 'numeric'
        });

        return `
            <tr>
                <td>${patient.id}</td>
                <td>${patient.firstName} ${patient.lastName}</td>
                <td>${patient.email}</td>
                <td>${patient.phone}</td>
                <td>${formattedDob}</td>
                <td>${patient.bloodType || 'N/A'}</td>
                <td><span class="badge badge-${patient.status === 'active' ? 'success' : 'warning'}">${patient.status}</span></td>
                <td>
                    <div class="table-actions">
                        <button class="edit-btn"><i class="fas fa-eye"></i></button>
                        <button class="edit-btn"><i class="fas fa-edit"></i></button>
                        <button class="delete-btn" onclick="deletePatient('${patient.id}')"><i class="fas fa-trash"></i></button>
                    </div>
                </td>
            </tr>
        `;
    }).join('');
}

// Modal Functions
function openAddPatientModal() {
    document.getElementById('addPatientModal').classList.add('active');
}

function openAddDoctorModal() {
    alert('Add Doctor modal would open here');
}

function closeModal(modalId) {
    document.getElementById(modalId).classList.remove('active');
}

async function savePatient() {
    const form = document.getElementById('addPatientForm');
    const formData = new FormData(form);
    
    const patientData = {
        firstName: formData.get('firstName') || form.querySelectorAll('input')[0].value,
        lastName: formData.get('lastName') || form.querySelectorAll('input')[1].value,
        email: form.querySelectorAll('input')[2]?.value || 'patient@email.com',
        phone: form.querySelectorAll('input')[3]?.value || '+1234567890',
        dob: form.querySelectorAll('input')[4]?.value || '1990-01-01',
        bloodType: form.querySelector('select')?.value || 'O+'
    };

    const result = await MediCare.API.post('/patients', patientData);
    
    if (result.success) {
        alert('Patient saved successfully!');
        closeModal('addPatientModal');
        loadPatientsFromAPI();
    } else {
        alert('Failed to save patient. Please try again.');
    }
}

// Action Functions
function viewDoctor(id) {
    console.log('View doctor:', id);
    alert(`Viewing doctor: ${id}`);
}

function editDoctor(id) {
    console.log('Edit doctor:', id);
    alert(`Editing doctor: ${id}`);
}

async function viewPatient(id) {
    const result = await MediCare.API.get(`/patients/${id}`);
    if (result.success) {
        alert(`Patient: ${result.data.firstName} ${result.data.lastName}\nEmail: ${result.data.email}`);
    }
}

async function editPatient(id) {
    alert(`Editing patient: ${id}`);
}

async function deletePatient(id) {
    if (confirm('Are you sure you want to delete this patient?')) {
        const result = await MediCare.API.delete(`/patients/${id}`);
        if (result.success) {
            alert('Patient deleted successfully!');
            loadPatientsFromAPI();
        }
    }
}

async function viewAppointment(id) {
    const result = await MediCare.API.get(`/appointments/${id}`);
    if (result.success) {
        const apt = result.data;
        alert(`Appointment Details:\nPatient: ${apt.patientName}\nDoctor: ${apt.doctorName}\nDate: ${apt.date}\nTime: ${apt.time}`);
    }
}

async function editAppointment(id) {
    const result = await MediCare.API.put(`/appointments/${id}`, { status: 'confirmed' });
    if (result.success) {
        alert('Appointment confirmed!');
        loadAppointmentsFromAPI();
        loadRecentAppointments();
    }
}

async function cancelAppointment(id) {
    if (confirm('Are you sure you want to cancel this appointment?')) {
        const result = await MediCare.API.delete(`/appointments/${id}`);
        if (result.success) {
            alert('Appointment cancelled successfully!');
            loadAppointmentsFromAPI();
            loadRecentAppointments();
        }
    }
}

window.AdminModule = {
    switchSection,
    openAddPatientModal,
    openAddDoctorModal,
    closeModal,
    savePatient
};

