const listingHolder = document.getElementById('listing-holder');
const messageBox = document.getElementById('postMessage');
const applyFiltersBtn = document.getElementById('applyFilters');

//til gemme vores listings i, filtering :D
let allListings = [];

function getNestedValue(obj, path) {
    return path.split('.').reduce((acc, key) => acc?.[key], obj);
}

// Helper function to check if a listing is favorited by current user
function isListingFavorited(listing) {
    const user = JSON.parse(sessionStorage.getItem('user') || '{}');
    if (!user._id || !listing.favoritedBy) return false;
    // MongoDB ObjectIds are strings when returned from API, so we can use includes
    return listing.favoritedBy.includes(user._id);
}

function renderListings(listings) {
    listingHolder.innerHTML = '';

    if (listings.length === 0) {
        messageBox.textContent = 'Ingen boligere til salg';
        return;
    }
    messageBox.textContent = "";

    listings.forEach((listing) => {
        const div = document.createElement('div');
        div.classList.add("listing-card")

        div.onclick = (e) => {
            if (!e.target.closest(".favorite-btn")) {
                window.location.href = `/boligere/${listing._id}`;
            }
        };

        const imageUrl = listing.images && listing.images.length > 0
            ? listing.images[0]
            : '';

        // Check if this listing is favorited by current user
        const isFavorited = isListingFavorited(listing);
        const heartFill = isFavorited ? '#ff5722' : 'none';
        const heartStroke = isFavorited ? '#ff5722' : 'currentColor';
        const favoritedClass = isFavorited ? 'favorited' : '';

        div.innerHTML = `
            ${imageUrl
                ? `<div class="listing-image" style="background-image: url('${imageUrl}');"></div>`
                : '<div class="listing-image"></div>'}
            <div class="listing-content">
                <div class="listing-title">${listing.title}</div>
                <div class="listing-location">${listing.location.city}, ${listing.location.postalCode}</div>
                <div class="listing-price">${listing.price.purchasePrice.toLocaleString('da-DK')} kr.</div>
            </div>
            <button class="favorite-btn ${favoritedClass}" data-id="${listing._id}">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="${heartFill}" stroke="${heartStroke}" stroke-width="2">
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                </svg>
            </button>
        `;

        listingHolder.appendChild(div);
    });

}

async function getAllListings() {
    try {
        // Check if we have search results
        const searchResults = sessionStorage.getItem('searchResults');

        if (searchResults) {
            // Display search results
            allListings = JSON.parse(searchResults);
            renderListings(allListings);
            return;
        }

        // Otherwise, fetch all listings
        const response = await fetch('/api/admin/listings');
        if (!response.ok) throw new Error(`HTTP error: ${response.status}`);

        allListings = await response.json();

        // Filter to only show active listings
        allListings = allListings.filter(listing => listing.status === 'active');

        renderListings(allListings);

    } catch (error) {
        console.log(error);
        messageBox.textContent = 'Fejl ved hentning af boliger';
        messageBox.style.color = 'red';
    }
}
// Fav logik
listingHolder.addEventListener("click", async (e) => {
    // Use closest to find the button even if clicking on SVG/path inside it
    const favoriteBtn = e.target.closest('.favorite-btn');

    if(favoriteBtn) {
        const listingId = favoriteBtn.dataset.id;
        const token = sessionStorage.getItem('token');

        if (!token) {
            alert("Du skal være logget ind, for at bruge denne feature");
            return;
        }

        try {
            const response = await fetch(`/api/listing/${listingId}/favourite`, {
                method: "POST",
                headers: {Authorization: "Bearer " + token},
            });

            const data = await response.json();

            getAllListings();
        } catch (error) {
            alert(error);
        }
    }
});
getAllListings();


applyFiltersBtn.addEventListener('click', () => {
    const postalCode = document.getElementById('postalCodeFilter').value.trim();
    const minPrice = document.getElementById('minPrice').value.trim();
    const maxPrice = document.getElementById('maxPrice').value.trim();
    const minRooms = document.getElementById('minRooms').value.trim();
    const maxRooms = document.getElementById('maxRooms').value.trim();
    const city = document.getElementById('cityFilter').value.trim().toLowerCase();
    const type = document.getElementById('typeFilter').value.trim().toLowerCase();

    console.log('Filters applied:', { postalCode, minPrice, maxPrice, minRooms, maxRooms, city, type });

    const filtered = allListings.filter(listing => {
        const price = getNestedValue(listing, 'price.purchasePrice');
        const rooms = listing.rooms;
        const postal = getNestedValue(listing, 'location.postalCode');
        const listingCity = getNestedValue(listing, 'location.city')?.toLowerCase();
        const listingType = listing.buildingType?.toLowerCase();

        // Postal code filter
        if (postalCode && postal != postalCode) {
            return false;
        }

        // Min price filter
        if (minPrice !== '' && price < parseFloat(minPrice)) {
            return false;
        }

        // Max price filter
        if (maxPrice !== '' && price > parseFloat(maxPrice)) {
            return false;
        }

        // Min rooms filter
        if (minRooms !== '' && rooms < parseInt(minRooms)) {
            return false;
        }

        // Max rooms filter
        if (maxRooms !== '' && rooms > parseInt(maxRooms)) {
            return false;
        }

        // City filter
        if (city && listingCity !== city) {
            return false;
        }

        // Type filter
        if (type && listingType !== type) {
            return false;
        }

        return true;
    });

    console.log(`Filtered: ${filtered.length} of ${allListings.length} listings`);
    renderListings(filtered);
});

// Navigation - check if user is logged in
const token = sessionStorage.getItem('token');
const user = JSON.parse(sessionStorage.getItem('user') || '{}');
const userMenu = document.getElementById('userMenuListings');

if (token && user) {
    // If user logged in, show profile and logout
    // Only admins and realtor see "opret bolig"
    const createListingLink = (user.role === 'admin' || user.role === 'realtor')
        ? '<a href="/opret/bolig">Opret bolig</a>'
        : '';

    userMenu.innerHTML = `
        <a href="/html/profile.html">Profil</a>
        ${createListingLink}
        <button id="logoutBtn">Log ud</button>
    `;

    document.getElementById('logoutBtn').addEventListener('click', () => {
        sessionStorage.clear();
        window.location.href = '/';
    });
} else {
    // if user not logged in show login button
    userMenu.innerHTML = '<a href="/html/login.html" class="btn btn-login">Log ind</a>';
}