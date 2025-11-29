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
        const response = await fetch('/api/admin/listings');
        if (!response.ok) throw new Error(`HTTP error: ${response.status}`);

        allListings = await response.json();
        renderListings(allListings);

    } catch (error) {
    console.log(error);
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
    const postalCode = document.getElementById('postalCodeFilter').value;
    const minPrice = document.getElementById('minPrice').value;
    const maxPrice = document.getElementById('maxPrice').value;
    const minRooms = document.getElementById('minRooms').value;
    const maxRooms = document.getElementById('maxRooms').value;
    const city = document.getElementById('cityFilter').value.toLowerCase();

    const filtered = allListings.filter(listing => {
        const price = getNestedValue(listing, 'price.purchasePrice');
        const rooms = listing.rooms;
        const postal = getNestedValue(listing, 'location.postalCode');
        const listingCity = getNestedValue(listing, 'location.city')?.toLowerCase();

        if (postalCode && postal != postalCode) return false;
        if (minPrice && price < minPrice) return false;
        if (maxPrice && price > maxPrice) return false;
        if (minRooms && rooms < minRooms) return false;
        if (maxRooms && rooms > maxRooms) return false;
        if (city && listingCity !== city) return false;

        return true;
    });

    renderListings(filtered);
});