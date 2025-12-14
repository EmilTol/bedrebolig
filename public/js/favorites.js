document.getElementById("year").textContent = new Date().getFullYear();

const favoritesContainer = document.getElementById('favorites-container');
const emptyState = document.getElementById('empty-state');
const errorMessage = document.getElementById('error-message');

// Tjek om bruger er logget ind hvis ikke send til login
const token = sessionStorage.getItem('token');
const user = JSON.parse(sessionStorage.getItem('user') || '{}');

if (!token) {
    window.location.href = '/html/login.html';
}

// Navigation menu viser links baseret på rolle
const userMenu = document.getElementById('userMenuFavorites');
// Kun admin og realtor kan oprette boliger
const createListingLink = (user.role === 'admin' || user.role === 'realtor')
    ? '<a href="/opret/bolig">Opret bolig</a>'
    : '';

userMenu.innerHTML = `
    <a href="/html/profile.html">Min profil</a>
    ${createListingLink}
    <button id="logoutBtn" class="btn-logout">Log ud</button>
`;

// Logout funktionalitet
document.getElementById('logoutBtn').addEventListener('click', () => {
    sessionStorage.clear();
    window.location.href = '/';
});

// Hent brugerens favorit boliger fra backend
async function loadFavorites() {
    try {
        const response = await fetch('/api/listing/favourites', {
            headers: {
                'Authorization': 'Bearer ' + token
            }
        });


        if (!response.ok) {
            throw new Error('Kunne ikke hente favoritter');
        }

        const data = await response.json();

        // Hvis ingen favoritter, vis tom besked
        if (!data.favorites || data.favorites.length === 0) {
            showEmptyState();
        } else {
            // Ellers vis favoritterne
            renderFavorites(data.favorites);
        }

    } catch (error) {
        console.error('Favorites error:', error);
        showError('Fejl ved hentning af favoritter. Prøv igen senere.');
    }
}


function renderFavorites(favorites) {
    // Skjul tom besked og fejl
    emptyState.style.display = 'none';
    errorMessage.style.display = 'none';

    // Ryd containeren først
    favoritesContainer.innerHTML = '';

    // For hver favorit, lav et kort
    favorites.forEach(listing => {
        const card = document.createElement('div');
        card.classList.add('listing-card');

        // Gør kortet klikbart - går til detalje siden
        card.onclick = (e) => {
            // Men IKKE hvis man klikker på fjern-knappen
            if (!e.target.classList.contains('remove-btn')) {
                window.location.href = `/boligere/${listing._id}`;
            }
        };

        // Byg HTML for kortet
        card.innerHTML = `
            ${listing.images && listing.images.length > 0
                ? `<div class="listing-image" style="background-image: url('${listing.images[0]}');"></div>`
                : '<div class="no-image">Intet billede</div>'}
            <div class="listing-content">
                <div class="listing-title">${listing.title}</div>
                <div class="listing-location">${listing.location.city}, ${listing.location.postalCode}</div>
                <div class="listing-price">${listing.price.purchasePrice.toLocaleString('da-DK')} kr.</div>
                <button class="remove-btn" data-id="${listing._id}">Fjern favorit</button>
            </div>
        `;

        favoritesContainer.appendChild(card);
    });

    // Tilføj event listener til alle fjern-knapper
    document.querySelectorAll('.remove-btn').forEach(btn => {
        btn.addEventListener('click', async (e) => {
            e.stopPropagation(); // Stop så vi ikke åbner detaljesiden
            const listingId = e.currentTarget.dataset.id;
            await removeFavorite(listingId);
        });
    });
}

// Fjern en bolig fra favoritter (kalder samme endpoint som toggle)
async function removeFavorite(listingId) {
    try {
        const response = await fetch(`/api/listing/${listingId}/favourite`, {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + token
            }
        });

        if (!response.ok) {
            throw new Error('Kunne ikke fjerne favorit');
        }

        // Genindlæs listen efter fjernelse
        loadFavorites();

    } catch (error) {
        showError('Kunne ikke fjerne favorit. Prøv igen.');
    }
}

// Vis tom besked når ingen favoritter
function showEmptyState() {
    favoritesContainer.innerHTML = '';
    emptyState.style.display = 'block';
    errorMessage.style.display = 'none';
}

// Vis fejlbesked
function showError(message) {
    errorMessage.textContent = message;
    errorMessage.style.display = 'block';
    errorMessage.style.color = 'red';
    errorMessage.style.textAlign = 'center';
    errorMessage.style.marginTop = '20px';
}

// Start - hent favoritter når siden loader
loadFavorites();
