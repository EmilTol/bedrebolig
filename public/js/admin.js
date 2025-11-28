// Check if user is admin
document.addEventListener('DOMContentLoaded', () => {
    const token = sessionStorage.getItem('token');
    const user = JSON.parse(sessionStorage.getItem('user') || '{}');

    if (!token || user.role !== 'admin') {
        //alert('Du har ikke adgang til dette panel');
        window.location.href = '/';
        return;
    }

    initAdmin();
});

let currentListing = null;
let currentDeleteTarget = null;

function initAdmin() {
    // Load initial data
    loadUsers();
    loadListings();

    // Tab switching
    document.querySelectorAll('.sidebar-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const tab = btn.dataset.tab;
            switchTab(tab);
        });
    });

    // Refresh buttons
    document.getElementById('refreshUsersBtn').addEventListener('click', loadUsers);
    document.getElementById('refreshListingsBtn').addEventListener('click', loadListings);

    // Search functionality
    document.getElementById('userSearch').addEventListener('input', filterUsers);
    document.getElementById('statusFilter').addEventListener('change', loadListings);

    // Modal controls
    document.getElementById('closeModal').addEventListener('click', closeDeleteModal);
    document.getElementById('cancelDelete').addEventListener('click', closeDeleteModal);
    document.getElementById('confirmDelete').addEventListener('click', confirmDelete);

    document.getElementById('closeListingModal').addEventListener('click', closeListingModal);
    document.getElementById('cancelListing').addEventListener('click', closeListingModal);
    document.getElementById('approveListing').addEventListener('click', () => updateListingStatus('active'));
    document.getElementById('rejectListing').addEventListener('click', () => updateListingStatus('unlisted'));

    // Logout
    document.getElementById('logoutBtn').addEventListener('click', () => {
        sessionStorage.removeItem('token');
        sessionStorage.removeItem('user');
        window.location.href = '/';
    });
}

function switchTab(tabName) {
    // Update sidebar buttons
    document.querySelectorAll('.sidebar-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.tab === tabName) {
            btn.classList.add('active');
        }
    });

    // Update tab content
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
    });
    document.getElementById(`${tabName}Tab`).classList.add('active');
}

// User Management
async function loadUsers() {
    const tbody = document.getElementById('usersTableBody');
    tbody.innerHTML = '<tr class="loading-row"><td colspan="6"><div class="loading-spinner"></div>Henter brugere...</td></tr>';

    try {
        const token = sessionStorage.getItem('token');
        const response = await fetch('/api/users', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) throw new Error('Kunne ikke hente brugere');

        const users = await response.json();
        displayUsers(users);
        updateUserCount(users.length);
    } catch (error) {
        console.error('Error loading users:', error);
        showAlert('usersAlert', 'Der opstod en fejl ved hentning af brugere', 'danger');
        tbody.innerHTML = '<tr><td colspan="6" style="text-align: center; padding: 2rem; color: var(--danger);">Kunne ikke hente brugere</td></tr>';
    }
}

function displayUsers(users) {
    const tbody = document.getElementById('usersTableBody');

    if (users.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" style="text-align: center; padding: 2rem;">Ingen brugere fundet</td></tr>';
        return;
    }

    tbody.innerHTML = users.map(user => `
        <tr data-user-id="${user._id}">
            <td>${user.name}</td>
            <td>${user.email}</td>
            <td>${user.phoneNumber}</td>
            <td><span class="role-badge ${user.role}">${user.role}</span></td>
            <td>${formatDate(user.createdAt)}</td>
            <td>
                <div class="action-buttons">
                    <button class="btn-icon danger" onclick="deleteUser('${user._id}', '${user.name}')" title="Slet bruger">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <polyline points="3 6 5 6 21 6"></polyline>
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                        </svg>
                    </button>
                </div>
            </td>
        </tr>
    `).join('');
}

function filterUsers() {
    const searchTerm = document.getElementById('userSearch').value.toLowerCase();
    const rows = document.querySelectorAll('#usersTableBody tr');

    rows.forEach(row => {
        const text = row.textContent.toLowerCase();
        row.style.display = text.includes(searchTerm) ? '' : 'none';
    });
}

function deleteUser(userId, userName) {
    currentDeleteTarget = { id: userId, type: 'user' };
    document.getElementById('deleteMessage').textContent = `Er du sikker på, at du vil slette brugeren "${userName}"?`;
    document.getElementById('deleteModal').classList.add('active');
}

function updateUserCount(count) {
    document.getElementById('usersCount').textContent = count;
}

// Listing Management
async function loadListings() {
    const grid = document.getElementById('listingsGrid');
    const statusFilter = document.getElementById('statusFilter').value;

    grid.innerHTML = '<div class="loading-card"><div class="loading-spinner"></div><p>Henter boligopslag...</p></div>';

    try {
        const token = sessionStorage.getItem('token');
        const response = await fetch('/api/admin/listings', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) throw new Error('Kunne ikke hente boligopslag');

        let listings = await response.json();

        // Filter by status
        if (statusFilter !== 'all') {
            listings = listings.filter(listing => listing.status === statusFilter);
        }

        displayListings(listings);
        updateListingStats(listings);
    } catch (error) {
        console.error('Error loading listings:', error);
        showAlert('listingsAlert', 'Der opstod en fejl ved hentning af boligopslag', 'danger');
        grid.innerHTML = '<div style="text-align: center; padding: 2rem; color: var(--danger);">Kunne ikke hente boligopslag</div>';
    }
}

function displayListings(listings) {
    const grid = document.getElementById('listingsGrid');

    if (listings.length === 0) {
        grid.innerHTML = '<div style="text-align: center; padding: 2rem; color: var(--text-secondary);">Ingen boligopslag fundet</div>';
        return;
    }

    grid.innerHTML = listings.map(listing => `
        <div class="listing-card" onclick="viewListing('${listing._id}')">
            <div class="listing-image">
                🏠
            </div>
            <div class="listing-content">
                <div class="listing-header">
                    <div>
                        <div class="listing-title">${listing.title}</div>
                        <div class="listing-location">
                            📍 ${listing.location.city}, ${listing.location.postalCode}
                        </div>
                    </div>
                    <span class="status-badge ${listing.status}">${getStatusText(listing.status)}</span>
                </div>
                <div class="listing-price">${formatPrice(listing.price.purchasePrice)}</div>
                <div class="listing-details">
                    <div class="listing-detail">🛏️ ${listing.rooms} rum</div>
                    <div class="listing-detail">📐 ${listing.squareMeters} m²</div>
                    <div class="listing-detail">⚡ ${listing.energyRating}</div>
                </div>
                <div style="font-size: 0.85rem; color: var(--text-secondary); margin-top: 0.5rem;">
                    ${listing.buildingType} • ${listing.buildYear}
                </div>
            </div>
        </div>
    `).join('');
}

async function viewListing(listingId) {
    try {
        const token = sessionStorage.getItem('token');
        const response = await fetch(`/api/admin/listings/${listingId}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) throw new Error('Kunne ikke hente boligdetaljer');

        const listing = await response.json();
        currentListing = listing;
        displayListingDetails(listing);
        document.getElementById('listingModal').classList.add('active');
    } catch (error) {
        console.error('Error loading listing details:', error);
        alert('Kunne ikke hente boligdetaljer');
    }
}

function displayListingDetails(listing) {
    const detailsContainer = document.getElementById('listingDetails');
    detailsContainer.innerHTML = `
        <div style="margin-bottom: 1.5rem;">
            <h3 style="font-size: 1.5rem; margin-bottom: 0.5rem;">${listing.title}</h3>
            <p style="color: var(--text-secondary);">${listing.description}</p>
        </div>

        <div class="detail-grid">
            <div class="detail-item">
                <div class="detail-label">Type</div>
                <div class="detail-value">${listing.buildingType}</div>
            </div>
            <div class="detail-item">
                <div class="detail-label">Status</div>
                <div class="detail-value"><span class="status-badge ${listing.status}">${getStatusText(listing.status)}</span></div>
            </div>
            <div class="detail-item">
                <div class="detail-label">Pris</div>
                <div class="detail-value">${formatPrice(listing.price.purchasePrice)}</div>
            </div>
            <div class="detail-item">
                <div class="detail-label">Mdl. udgift</div>
                <div class="detail-value">${formatPrice(listing.price.monthlyOwnershipCost)}</div>
            </div>
            <div class="detail-item">
                <div class="detail-label">Lokation</div>
                <div class="detail-value">${listing.location.city}, ${listing.location.postalCode}</div>
            </div>
            <div class="detail-item">
                <div class="detail-label">Adresse</div>
                <div class="detail-value">${listing.location.address}</div>
            </div>
            <div class="detail-item">
                <div class="detail-label">Rum</div>
                <div class="detail-value">${listing.rooms}</div>
            </div>
            <div class="detail-item">
                <div class="detail-label">Areal</div>
                <div class="detail-value">${listing.squareMeters} m²</div>
            </div>
            <div class="detail-item">
                <div class="detail-label">Byggeår</div>
                <div class="detail-value">${listing.buildYear}</div>
            </div>
            <div class="detail-item">
                <div class="detail-label">Etager</div>
                <div class="detail-value">${listing.floors}</div>
            </div>
            <div class="detail-item">
                <div class="detail-label">Energimærke</div>
                <div class="detail-value">${listing.energyRating}</div>
            </div>
            <div class="detail-item">
                <div class="detail-label">Oprettet</div>
                <div class="detail-value">${formatDate(listing.createdAt)}</div>
            </div>
        </div>
    `;
}

async function updateListingStatus(newStatus) {
    if (!currentListing) return;

    try {
        const token = sessionStorage.getItem('token');
        const response = await fetch(`/api/admin/listings/${currentListing._id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ status: newStatus })
        });

        if (!response.ok) throw new Error('Kunne ikke opdatere status');

        const statusText = newStatus === 'active' ? 'godkendt' : 'afvist';
        showAlert('listingsAlert', `Boligopslag ${statusText} succesfuldt`, 'success');
        closeListingModal();
        loadListings();
    } catch (error) {
        console.error('Error updating listing status:', error);
        alert('Kunne ikke opdatere boligopslag');
    }
}

function updateListingStats(listings) {
    const pending = listings.filter(l => l.status === 'underReview').length;
    const active = listings.filter(l => l.status === 'active').length;

    document.getElementById('pendingCount').textContent = pending;
    document.getElementById('activeCount').textContent = active;
    document.getElementById('listingsCount').textContent = listings.length;
}

// Modal Controls
function closeDeleteModal() {
    document.getElementById('deleteModal').classList.remove('active');
    currentDeleteTarget = null;
}

function closeListingModal() {
    document.getElementById('listingModal').classList.remove('active');
    currentListing = null;
}

async function confirmDelete() {
    if (!currentDeleteTarget) return;

    try {
        const token = sessionStorage.getItem('token');
        const { id, type } = currentDeleteTarget;

        const endpoint = type === 'user' ? `/api/user/${id}` : `/api/listing/${id}`;
        const response = await fetch(endpoint, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            const data = await response.json();
            throw new Error(data.error || 'Kunne ikke slette');
        }

        showAlert('usersAlert', 'Slettet succesfuldt', 'success');
        closeDeleteModal();
        loadUsers();
    } catch (error) {
        console.error('Error deleting:', error);
        alert(error.message || 'Der opstod en fejl ved sletning');
    }
}

// Utility Functions
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('da-DK', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

function formatPrice(price) {
    return new Intl.NumberFormat('da-DK', {
        style: 'currency',
        currency: 'DKK',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(price);
}

function getStatusText(status) {
    const statusMap = {
        'underReview': 'Afventer',
        'active': 'Aktiv',
        'sold': 'Solgt',
        'unlisted': 'Afvist'
    };
    return statusMap[status] || status;
}

function showAlert(elementId, message, type) {
    const alert = document.getElementById(elementId);
    alert.className = `alert alert-${type}`;
    alert.textContent = message;
    alert.style.display = 'flex';

    setTimeout(() => {
        alert.style.display = 'none';
    }, 5000);
}

console.log('Admin panel JavaScript loaded successfully');