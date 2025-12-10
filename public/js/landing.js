// Check login status on page load
document.addEventListener('DOMContentLoaded', () => {
    checkLoginStatus();
});

function checkLoginStatus() {
    const token = sessionStorage.getItem('token');
    const user = JSON.parse(sessionStorage.getItem('user') || '{}');

    const loginBtn = document.getElementById('loginBtn');
    const userMenu = document.getElementById('userMenu');
    const userName = document.getElementById('userName');

    if (token && user.name) {
        // User is logged in
        loginBtn.style.display = 'none';
        userMenu.style.display = 'flex';
        userName.textContent = user.name.split(' ')[0]; // First name only
    } else {
        // User is not logged in
        loginBtn.style.display = 'block';
        userMenu.style.display = 'none';
    }
}

// Logout functionality
const logoutBtn = document.getElementById('logoutBtn');
if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
        // Clear session storage
        sessionStorage.removeItem('token');
        sessionStorage.removeItem('user');

        // Reload page to update UI
        window.location.reload();
    });
}

// Search functionality
const searchBox = document.querySelector('.search-box');
const searchInput = searchBox?.querySelector('input');
const searchButton = searchBox?.querySelector('button');

if (searchButton) {
    searchButton.addEventListener('click', (e) => {
        e.preventDefault();
        handleSearch();
    });
}

if (searchInput) {
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleSearch();
        }
    });
}

async function handleSearch() {
    const searchQuery = searchInput?.value.trim();

    if (!searchQuery) {
        alert('Indtast en by, adresse eller postnummer for at søge');
        return;
    }

    try {
        // Call search API
        const response = await fetch(`/api/search/listings?query=${encodeURIComponent(searchQuery)}`);

        if (!response.ok) {
            throw new Error('Søgningen fejlede');
        }

        const data = await response.json();

        // Store search results and redirect to listings page
        sessionStorage.setItem('searchResults', JSON.stringify(data.listings));
        sessionStorage.setItem('searchQuery', searchQuery);
        window.location.href = '/boligere';

    } catch (error) {
        console.error('Search error:', error);
        alert('Der opstod en fejl ved søgning. Prøv igen.');
    }
}

// Hent og vis de nyeste 6 boliger
async function loadNewestListings() {
    const container = document.getElementById('newest-listings-container');
    const loading = document.getElementById('newest-loading');

    if (!container || !loading) return; // Hvis elementerne ikke findes

    loading.style.display = 'block';

    try {
        // Hent alle boliger fra admin ( skal vi huske at ændre xD )
        const response = await fetch('/api/admin/listings');

        if (!response.ok) {
            throw new Error('Kunne ikke hente boliger');
        }

        const listings = await response.json();

        // Filtrer kun aktive boliger og tag de 6 nyeste
        const activeListings = listings.filter(listing => listing.status === 'active');
        const newest = activeListings.slice(0, 6);

        if (newest.length === 0) {
            container.innerHTML = '<p style="text-align: center;">Ingen boliger tilgængelige endnu</p>';
            return;
        }

        // Render kortene
        container.innerHTML = newest.map(listing => `
            <div class="listing-card" onclick="window.location.href='/boligere/${listing._id}'" style="cursor: pointer;">
                <div class="listing-image" style="background-image: url('${listing.images && listing.images[0] ? listing.images[0] : '/images/Dog.jpg'}'); background-size: cover; background-position: center; height: 200px; border-radius: 8px 8px 0 0;"></div>
                <div class="listing-content">
                    <div class="listing-title">${listing.title}</div>
                    <div class="listing-location">${listing.location.city}, ${listing.location.postalCode}</div>
                    <div class="listing-price">${listing.price.purchasePrice.toLocaleString('da-DK')} kr.</div>
                </div>
            </div>
        `).join('');

    } catch (error) {
        console.error('Fejl ved indlæsning af nyeste boliger:', error);
        container.innerHTML = '<p style="text-align: center; color: #e74c3c;">Kunne ikke indlæse boliger. Prøv igen senere.</p>';
    } finally {
        loading.style.display = 'none';
    }
}

// Kald funktionen når siden loader
loadNewestListings();

// City card click handlers
const cityCards = document.querySelectorAll('.city-card');
cityCards.forEach(card => {
    card.addEventListener('click', () => {
        const cityName = card.querySelector('.city-name')?.textContent;
        console.log('Valgt by:', cityName);

        // Use search functionality for cities
        handleCitySearch(cityName);
    });
});

async function handleCitySearch(cityName) {
    try {
        const response = await fetch(`/api/search/listings?query=${encodeURIComponent(cityName)}`);

        if (!response.ok) {
            throw new Error('Søgningen fejlede');
        }

        const data = await response.json();

        sessionStorage.setItem('searchResults', JSON.stringify(data.listings));
        sessionStorage.setItem('searchQuery', cityName);
        window.location.href = '/boligere';

    } catch (error) {
        console.error('City search error:', error);
        alert('Der opstod en fejl ved søgning. Prøv igen.');
    }
}

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

console.log('Landing page JavaScript loaded successfully');