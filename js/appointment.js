// MediCare Hospital - Appointment Page JavaScript with API

// Doctor data for each department
const doctorData = {
    'cardiology': [
        { id: 'sarah-johnson', name: 'Dr. Sarah Johnson', specialty: 'Cardiology' },
        { id: 'mark-thompson', name: 'Dr. Mark Thompson', specialty: 'Cardiology' }
    ],
    'neurology': [
        { id: 'michael-chen', name: 'Dr. Michael Chen', specialty: 'Neurology' },
        { id: 'lisa-chen', name: 'Dr. Lisa Chen', specialty: 'Neurology' }
    ],
    'orthopedics': [
        { id: 'james-anderson', name: 'Dr. James Anderson', specialty: 'Orthopedics' },
        { id: 'robert-brown', name: 'Dr. Robert Brown', specialty: 'Orthopedics' }
    ],
    'pediatrics': [
        { id: 'emily-williams', name: 'Dr. Emily Williams', specialty: 'Pediatrics' },
        { id: 'susan-davis', name: 'Dr. Susan Davis', specialty: 'Pediatrics' }
    ],
    'general-medicine': [
        { id: 'robert-martinez', name: 'Dr. Robert Martinez', specialty: 'General Medicine' },
        { id: 'john-smith', name: 'Dr. John Smith', specialty: 'General Medicine' }
    ],
    'ophthalmology': [
        { id: 'lisa-thompson', name: 'Dr. Lisa Thompson', specialty: 'Ophthalmology' },
        { id: 'david-garcia', name: 'Dr. David Garcia', specialty: 'Ophthalmology' }
    ],
    'pulmonology': [
        { id: 'david-wilson', name: 'Dr. David Wilson', specialty: 'Pulmonology' },
        { id: 'mary-taylor', name: 'Dr. Mary Taylor', specialty: 'Pulmonology' }
    ],
    'gastroenterology': [
        { id: 'jennifer-lee', name: 'Dr. Jennifer Lee', specialty: 'Gastroenterology' },
        { id: 'paul-johnson', name: 'Dr. Paul Johnson', specialty: 'Gastroenterology' }
    ],
    'dermatology': [
        { id: 'amanda-white', name: 'Dr. Amanda White', specialty: 'Dermatology' }
    ],
    'gynecology': [
        { id: 'sarah-moore', name: 'Dr. Sarah Moore', specialty: 'Gynecology' },
        { id: 'rachel-clark', name: 'Dr. Rachel Clark', specialty: 'Gynecology' }
    ]
};

document.addEventListener('DOMContentLoaded', function() {
    initAppointmentForm();
    initDatePicker();
    checkURLParams();
    loadDepartmentsFromAPI();
});

// Load departments from API
async function loadDepartmentsFromAPI() {
    const result = await MediCare.API.get('/departments');
    if (result.success) {
        const departmentSelect = document.getElementById('department');
        if (departmentSelect) {
            departmentSelect.innerHTML = '<option value="">Select Department</option>';
            result.data.forEach(dept => {
                const option = document.createElement('option');
                option.value = dept.id;
                option.textContent = dept.name;
                departmentSelect.appendChild(option);
            });
        }
    }
}

// Initialize appointment form
function initAppointmentForm() {
    const departmentSelect = document.getElementById('department');
    const doctorSelect = document.getElementById('doctor');
    const form = document.getElementById('appointmentForm');

    if (!departmentSelect || !doctorSelect || !form) return;

    // Department change event
    departmentSelect.addEventListener('change', async function() {
        const department = this.value;
        
        doctorSelect.innerHTML = '<option value="">Select Doctor</option>';
        
        if (department) {
            // Try to fetch from API first
            const result = await MediCare.API.get(`/doctors/specialty/${department}`);
            
            if (result.success && result.data.length > 0) {
                doctorSelect.disabled = false;
                result.data.forEach(doctor => {
                    const option = document.createElement('option');
                    option.value = doctor.id;
                    option.textContent = doctor.name;
                    option.dataset.specialty = doctor.specialty;
                    doctorSelect.appendChild(option);
                });
            } else if (doctorData[department]) {
                // Fallback to local data
                doctorSelect.disabled = false;
                doctorData[department].forEach(doctor => {
                    const option = document.createElement('option');
                    option.value = doctor.id;
                    option.textContent = doctor.name;
                    option.dataset.specialty = doctor.specialty;
                    doctorSelect.appendChild(option);
                });
            } else {
                doctorSelect.disabled = true;
                doctorSelect.innerHTML = '<option value="">No doctors available</option>';
            }
        } else {
            doctorSelect.disabled = true;
            doctorSelect.innerHTML = '<option value="">Select Department First</option>';
        }
    });

    // Form submission
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        if (validateForm()) {
            await submitAppointment();
        }
    });
}

// Initialize date picker with restrictions
function initDatePicker() {
    const dateInput = document.getElementById('appointmentDate');
    if (!dateInput) return;

    const today = new Date();
    const minDate = today.toISOString().split('T')[0];
    
    dateInput.setAttribute('min', minDate);
    
    const maxDate = new Date(today);
    maxDate.setDate(maxDate.getDate() + 60);
    dateInput.setAttribute('max', maxDate.toISOString().split('T')[0]);

    dateInput.addEventListener('change', function() {
        const selectedDate = new Date(this.value);
        const day = selectedDate.getDay();
        
        if (day === 0) {
            alert('We are closed on Sundays. Please select another day.');
            this.value = '';
            return;
        }
        
        if (day === 6) {
            const afternoonSlots = ['14:30', '15:00', '15:30', '16:00', '16:30'];
            const timeSelect = document.getElementById('appointmentTime');
            if (timeSelect) {
                Array.from(timeSelect.options).forEach(option => {
                    if (afternoonSlots.includes(option.value)) {
                        option.disabled = true;
                    } else {
                        option.disabled = false;
                    }
                });
            }
        }
    });
}

// Validate form
function validateForm() {
    const form = document.getElementById('appointmentForm');
    const requiredFields = form.querySelectorAll('[required]');
    let isValid = true;

    requiredFields.forEach(field => {
        if (!field.value.trim()) {
            field.style.borderColor = '#dc3545';
            isValid = false;
        } else {
            field.style.borderColor = '#dee2e6';
        }
    });

    const email = document.getElementById('email');
    if (email && email.value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email.value)) {
            alert('Please enter a valid email address');
            email.style.borderColor = '#dc3545';
            isValid = false;
        }
    }

    const phone = document.getElementById('phone');
    if (phone && phone.value) {
        const phoneRegex = /^[\d\s\-\+\(\)]{10,}$/;
        if (!phoneRegex.test(phone.value)) {
            alert('Please enter a valid phone number');
            phone.style.borderColor = '#dc3545';
            isValid = false;
        }
    }

    return isValid;
}

// Submit appointment to API
async function submitAppointment() {
    const form = document.getElementById('appointmentForm');
    const formData = new FormData(form);
    
    const doctorSelect = document.getElementById('doctor');
    const doctorName = doctorSelect.options[doctorSelect.selectedIndex]?.text || 'To be assigned';
    
    const appointmentData = {
        patientName: `${formData.get('firstName')} ${formData.get('lastName')}`,
        email: formData.get('email'),
        phone: formData.get('phone'),
        dob: formData.get('dob'),
        gender: formData.get('gender'),
        department: formData.get('department'),
        doctorId: formData.get('doctor'),
        doctorName: doctorName,
        date: formData.get('appointmentDate'),
        time: formData.get('appointmentTime'),
        reason: formData.get('reason'),
        type: formData.get('appointmentType'),
        status: 'pending'
    };

    // Submit to API
    const result = await MediCare.API.post('/appointments', appointmentData);
    
    if (result.success) {
        // Save to localStorage as backup
        const appointments = JSON.parse(localStorage.getItem('appointments') || '[]');
        appointments.push(result.data);
        localStorage.setItem('appointments', JSON.stringify(appointments));
        
        showSuccessModal(result.data);
    } else {
        alert('Failed to book appointment. Please try again.');
    }
}

// Show success modal
function showSuccessModal(appointmentData) {
    const modal = document.getElementById('successModal');
    const summary = document.getElementById('appointmentSummary');
    
    const date = new Date(appointmentData.date);
    const formattedDate = date.toLocaleDateString('en-US', {
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
    });
    
    const [hours, minutes] = appointmentData.time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    const formattedTime = `${displayHour}:${minutes} ${ampm}`;

    summary.innerHTML = `
        <div class="summary-item">
            <span><i class="fas fa-user"></i> Patient:</span>
            <strong>${appointmentData.patientName}</strong>
        </div>
        <div class="summary-item">
            <span><i class="fas fa-user-md"></i> Doctor:</span>
            <strong>${appointmentData.doctorName}</strong>
        </div>
        <div class="summary-item">
            <span><i class="fas fa-calendar"></i> Date:</span>
            <strong>${formattedDate}</strong>
        </div>
        <div class="summary-item">
            <span><i class="fas fa-clock"></i> Time:</span>
            <strong>${formattedTime}</strong>
        </div>
        <div class="summary-item">
            <span><i class="fas fa-hashtag"></i> Appointment ID:</span>
            <strong>${appointmentData.id}</strong>
        </div>
    `;

    modal.classList.add('active');
    
    const modalContent = modal.querySelector('.modal-content');
    modalContent.style.animation = 'modalSlideIn 0.3s ease';
}

// Close modal
function closeModal() {
    const modal = document.getElementById('successModal');
    modal.classList.remove('active');
    document.getElementById('appointmentForm').reset();
}

// Print appointment
function printAppointment() {
    window.print();
}

// Check URL parameters for pre-selected doctor
function checkURLParams() {
    const urlParams = new URLSearchParams(window.location.search);
    const doctorId = urlParams.get('doctor');

    if (doctorId) {
        // Try to find the doctor in API
        loadDoctorToForm(doctorId);
    }
}

async function loadDoctorToForm(doctorId) {
    const result = await MediCare.API.get(`/doctors/${doctorId}`);
    
    if (result.success) {
        const doctor = result.data;
        // Find department by specialty
        const deptSelect = document.getElementById('department');
        if (deptSelect) {
            // Map specialty to department
            const deptMap = {
                'Cardiology': 'cardiology',
                'Neurology': 'neurology',
                'Orthopedics': 'orthopedics',
                'Pediatrics': 'pediatrics',
                'General Medicine': 'general-medicine',
                'Ophthalmology': 'ophthalmology',
                'Pulmonology': 'pulmonology',
                'Gastroenterology': 'gastroenterology'
            };
            
            const dept = deptMap[doctor.specialty] || doctor.specialty.toLowerCase().replace(' ', '-');
            deptSelect.value = dept;
            deptSelect.dispatchEvent(new Event('change'));
            
            setTimeout(() => {
                const docSelect = document.getElementById('doctor');
                if (docSelect) {
                    docSelect.value = doctorId;
                }
            }, 100);
        }
    }
}

window.AppointmentModule = {
    closeModal,
    printAppointment
};

