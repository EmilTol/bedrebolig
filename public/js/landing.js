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

// Category card click handlers
const categoryCards = document.querySelectorAll('.category-card');
categoryCards.forEach(card => {
    card.addEventListener('click', () => {
        const categoryName = card.querySelector('h3')?.textContent;
        console.log('Valgt kategori:', categoryName);

        // Her kan du tilføje navigation til kategori side
        // window.location.href = `/category/${categoryName.toLowerCase()}`;

        alert(`Du valgte: ${categoryName}\n\nDenne funktionalitet vil blive implementeret senere.`);
    });
});

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

// Listing card click handlers
const listingCards = document.querySelectorAll('.listing-card');
listingCards.forEach(card => {
    card.addEventListener('click', () => {
        const listingTitle = card.querySelector('.listing-title')?.textContent;
        console.log('Valgt bolig:', listingTitle);

        // Her kan du tilføje navigation til bolig detaljer side
        // const listingId = card.dataset.listingId;
        // window.location.href = `/listing/${listingId}`;

        alert(`Du valgte: ${listingTitle}\n\nDenne funktionalitet vil blive implementeret senere.`);
    });
});

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