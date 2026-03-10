// MediCare Hospital - Doctors Page JavaScript with API

document.addEventListener('DOMContentLoaded', function() {
    initDoctorFilter();
    checkURLParams();
    loadDoctorsFromAPI();
});

let allDoctors = [];

// Initialize doctor filtering
function initDoctorFilter() {
    const searchInput = document.getElementById('doctorSearch');
    const specialtyFilter = document.getElementById('specialtyFilter');
    const doctorsGrid = document.getElementById('doctorsGrid');
    const noResults = document.getElementById('noResults');

    if (!searchInput || !specialtyFilter || !doctorsGrid) return;

    const doctorCards = doctorsGrid.querySelectorAll('.doctor-card');

    function filterDoctors() {
        const searchTerm = searchInput.value.toLowerCase().trim();
        const specialty = specialtyFilter.value.toLowerCase();
        let visibleCount = 0;

        doctorCards.forEach(card => {
            const name = card.querySelector('h3').textContent.toLowerCase();
            const cardSpecialty = card.getAttribute('data-specialty');

            const matchesSearch = name.includes(searchTerm);
            const matchesSpecialty = !specialty || cardSpecialty === specialty;

            if (matchesSearch && matchesSpecialty) {
                card.style.display = 'block';
                visibleCount++;
            } else {
                card.style.display = 'none';
            }
        });

        if (noResults) {
            noResults.style.display = visibleCount === 0 ? 'block' : 'none';
        }
    }

    searchInput.addEventListener('input', filterDoctors);
    specialtyFilter.addEventListener('change', filterDoctors);
}

// Load doctors from API
async function loadDoctorsFromAPI() {
    const result = await MediCare.API.get('/doctors');
    
    if (result.success) {
        allDoctors = result.data;
        renderDoctors(allDoctors);
        populateSpecialtyFilter(allDoctors);
    } else {
        console.error('Failed to load doctors:', result.error);
    }
}

// Render doctors to the grid
function renderDoctors(doctors) {
    const doctorsGrid = document.getElementById('doctorsGrid');
    if (!doctorsGrid) return;

    if (doctors.length === 0) {
        doctorsGrid.innerHTML = `
            <div class="no-results" style="grid-column: 1 / -1;">
                <i class="fas fa-search"></i>
                <h3>No Doctors Found</h3>
                <p>Try adjusting your search criteria</p>
            </div>
        `;
        return;
    }

    doctorsGrid.innerHTML = doctors.map(doctor => `
        <div class="doctor-card" data-specialty="${doctor.specialty.toLowerCase().replace(' ', '-')}">
            <div class="doctor-image">
                <img src="${doctor.image}" alt="${doctor.name}" onerror="this.src='https://via.placeholder.com/400x280?text=Doctor'">
                <div class="doctor-overlay">
                    <a href="appointment.html?doctor=${doctor.id}" class="btn btn-sm">Book Now</a>
                </div>
            </div>
            <div class="doctor-info">
                <h3>${doctor.name}</h3>
                <span class="specialty">${doctor.specialty}</span>
                <div class="doctor-rating">
                    <i class="fas fa-star"></i>
                    <i class="fas fa-star"></i>
                    <i class="fas fa-star"></i>
                    <i class="fas fa-star"></i>
                    <i class="fas fa-star"></i>
                    <span>(4.9)</span>
                </div>
                <p>${doctor.experience} experience</p>
                <div class="doctor-contact">
                    <a href="tel:${doctor.phone}"><i class="fas fa-phone-alt"></i></a>
                    <a href="mailto:${doctor.email}"><i class="fas fa-envelope"></i></a>
                </div>
            </div>
        </div>
    `).join('');
}

// Populate specialty filter from API data
function populateSpecialtyFilter(doctors) {
    const specialtyFilter = document.getElementById('specialtyFilter');
    if (!specialtyFilter) return;

    // Get unique specialties
    const specialties = [...new Set(doctors.map(d => d.specialty))];
    
    // Keep the first option
    const firstOption = specialtyFilter.querySelector('option');
    specialtyFilter.innerHTML = '';
    specialtyFilter.appendChild(firstOption);

    // Add specialty options
    specialties.forEach(specialty => {
        const option = document.createElement('option');
        option.value = specialty.toLowerCase().replace(' ', '-');
        option.textContent = specialty;
        specialtyFilter.appendChild(option);
    });
}

// Check URL parameters for pre-selected doctor
function checkURLParams() {
    const urlParams = new URLSearchParams(window.location.search);
    const doctorId = urlParams.get('doctor');

    if (doctorId && typeof loadAppointmentForm === 'function') {
        loadAppointmentForm(doctorId);
    }
}

window.DoctorsModule = {
    filterDoctors: () => {
        const searchInput = document.getElementById('doctorSearch');
        const specialtyFilter = document.getElementById('specialtyFilter');
        if (searchInput && specialtyFilter) {
            searchInput.dispatchEvent(new Event('input'));
        }
    },
    refreshDoctors: loadDoctorsFromAPI
};

