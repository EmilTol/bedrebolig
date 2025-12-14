
    const listingId = window.location.pathname.split('/').pop();

    fetch(`/api/admin/listings/${listingId}`)
    .then(res => res.json())
    .then(listing => {
    document.getElementById('listing-title').textContent = listing.title;
    document.getElementById('listing-date').textContent = new Date(listing.createdAt).toLocaleString();
    document.getElementById('listing-buildingType').textContent = listing.buildingType
    document.getElementById('listing-purchasePrice').textContent = listing.price.purchasePrice
    document.getElementById('listing-monthlyOwnershipCost').textContent = listing.price.monthlyOwnershipCost
    document.getElementById('listing-downPayment').textContent = listing.price.downPayment
    document.getElementById('listing-brutto').textContent = listing.price.brutto
    document.getElementById('listing-netto').textContent = listing.price.netto
    document.getElementById('listing-city').textContent = listing.location.city
    document.getElementById('listing-postalCode').textContent = listing.location.postalCode
    document.getElementById('listing-address').textContent = listing.location.address
    document.getElementById('listing-rooms').textContent = listing.rooms
    document.getElementById('listing-squareMeters').textContent = listing.squareMeters
    document.getElementById('listing-lotSize').textContent = listing.lotSize
    document.getElementById('listing-basementSize').textContent = listing.basementSize
    document.getElementById('listing-buildYear').textContent = listing.buildYear
    document.getElementById('listing-renovationYear').textContent = listing.renovationYear
    document.getElementById('listing-floors').textContent = listing.floors
    document.getElementById('listing-apartmentFloor').textContent = listing.apartmentFloor
    document.getElementById('listing-energyRating').textContent = listing.energyRating
    if(listing.images && listing.images.length > 0) {
        const imageDiv = document.getElementById('listing-image');
        imageDiv.style.backgroundImage = `url('${listing.images[0]}')`;
    }
 showListingMap(listing);

});

    async function showListingMap() {
        const address = document.getElementById("listing-address").textContent;
        const city = document.getElementById("listing-city").textContent;
        const postalCode = document.getElementById("listing-postalCode").textContent;

        // Kombiner til fuld adresse
        const fullAddress = `${address}, ${postalCode} ${city}, Denmark`;

        console.log(fullAddress);

        try {
            // Nominatim API too geocoding
            const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(fullAddress)}`);
            const data = await response.json();

            if (data && data.length > 0) {
                const lat = data[0].lat;
                const lon = data[0].lon;

                // Create leaflet map
                const map = L.map('listing-map').setView([lat, lon], 15);

                L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                }).addTo(map);

                // adds marker
                L.marker([lat, lon]).addTo(map)
                    .bindPopup(fullAddress)
                    .openPopup();
            } else {
                document.getElementById("listing-map").textContent = "Adresse kunne ikke findes på kortet.";
            }
        } catch (error) {
            console.error("Fejl ved geocoding:", error);
            document.getElementById("listing-map").textContent = "Kortet kunne ikke indlæses.";
        }
    }

// Navigation check if user is logged in
const token = sessionStorage.getItem('token');
const user = JSON.parse(sessionStorage.getItem('user') || '{}');
const userMenu = document.getElementById('userMenuDetails');

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
    // user logged in
    userMenu.innerHTML = '<a href="/html/login.html" class="btn btn-login">Log ind</a>';
}
