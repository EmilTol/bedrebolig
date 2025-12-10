const listingHolder = document.getElementById('listing-holder');
const messageBox = document.getElementById('postMessage');
const applyFiltersBtn = document.getElementById('applyFilters');

//til gemme vores listings i, filtering :D
let allListings = [];

function getNestedValue(obj, path) {
    return path.split('.').reduce((acc, key) => acc?.[key], obj);
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
        div.classList.add("listing-item")

        div.style.cursor = "pointer";
        div.onclick = (e) => {
            if (!e.target.classList.contains("favorite-btn")) {
                window.location.href = `/boligere/${listing._id}`;
            }
        };
        div.innerHTML = `
            ${listing.images && listing.images.length > 0 ? `<img src="${listing.images[0]}" alt="listing name" class="listing-item-image" />` : ''}
            <p class="listing-item-content">${listing.title}</p>
            <p class="listing-item-content">${new Date(listing.createdAt).toLocaleString()}</p>
            
            <button class="favorite-btn" data-id="${listing._id}">💖</button>
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
    if(e.target.classList.contains('favorite-btn')) {

        const listingId = e.target.dataset.id;
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

//lav kommentarer en anden dag OKAY
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

// Navigation - tjek om bruger er logget ind
const token = sessionStorage.getItem('token');
const user = JSON.parse(sessionStorage.getItem('user') || '{}');
const userMenu = document.getElementById('userMenuListings');

if (token && user) {
    // Bruger er logget ind - vis profil og log ud
    // Kun admin og realtor kan oprette boliger
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
    // Bruger er IKKE logget ind - vis login knap
    userMenu.innerHTML = '<a href="/html/login.html" style="background: #3498db; color: white; padding: 0.6rem 1rem; border-radius: 6px; text-decoration: none;">Log ind</a>';
}