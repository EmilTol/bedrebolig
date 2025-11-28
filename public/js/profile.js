// Check if user is logged in
document.addEventListener('DOMContentLoaded', () => {
    const token = sessionStorage.getItem('token');
    const user = JSON.parse(sessionStorage.getItem('user') || '{}');

    console.log('Loaded user from localStorage:', user); // Debug
    console.log('User ID:', user._id); // Debug

    if (!token || !user._id) {
        // Not logged in, redirect to login
        console.log('Not logged in, redirecting...');
        window.location.href = '/html/login.html';
        return;
    }

    // Load user data
    loadUserData(user);
});

function loadUserData(user) {
    // Update profile header
    document.getElementById('profileName').textContent = user.name;
    document.getElementById('profileRole').textContent = user.role || 'bruger';

    // Update view mode
    document.getElementById('viewName').textContent = user.name;
    document.getElementById('viewEmail').textContent = user.email;
    document.getElementById('viewPhone').textContent = user.phoneNumber;
    document.getElementById('viewRoleInfo').textContent = user.role || 'bruger';

    // Update edit form
    document.getElementById('name').value = user.name;
    document.getElementById('email').value = user.email;
    document.getElementById('phoneNumber').value = user.phoneNumber;
}

// Edit button
document.getElementById('editBtn').addEventListener('click', () => {
    document.getElementById('viewMode').style.display = 'none';
    document.getElementById('editMode').style.display = 'block';
});

// Cancel button
document.getElementById('cancelBtn').addEventListener('click', () => {
    document.getElementById('editMode').style.display = 'none';
    document.getElementById('viewMode').style.display = 'block';

    // Reset form
    const user = JSON.parse(sessionStorage.getItem('user') || '{}');
    loadUserData(user);
    document.getElementById('password').value = '';
    document.getElementById('confirmPassword').value = '';

    // Clear messages
    document.getElementById('successMessage').style.display = 'none';
    document.getElementById('errorMessage').style.display = 'none';
});

// Form submission
document.getElementById('profileForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const phoneNumber = document.getElementById('phoneNumber').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    const errorMessage = document.getElementById('errorMessage');
    const successMessage = document.getElementById('successMessage');

    // Reset messages
    errorMessage.style.display = 'none';
    successMessage.style.display = 'none';

    // Validate phone number
    if (!/^[0-9]{8}$/.test(phoneNumber)) {
        errorMessage.textContent = 'Telefonnummeret skal være 8 cifre';
        errorMessage.style.display = 'block';
        return;
    }

    // Validate passwords if provided
    if (password && password !== confirmPassword) {
        errorMessage.textContent = 'Adgangskoderne matcher ikke';
        errorMessage.style.display = 'block';
        return;
    }

    try {
        const token = sessionStorage.getItem('token');
        const user = JSON.parse(sessionStorage.getItem('user') || '{}');


        if (!user._id) {
            errorMessage.textContent = 'Bruger ID mangler - prøv at logge ind igen';
            errorMessage.style.display = 'block';
            return;
        }

        // Build update data
        const updateData = {
            name,
            email,
            phoneNumber
        };

        // Only include password if it was changed
        if (password) {
            updateData.password = password;
        }

        const response = await fetch(`/api/user/${user._id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(updateData)
        });

        const data = await response.json();

        if (response.ok) {
            // Update local storage
            const updatedUser = { ...user, ...data };
            sessionStorage.setItem('user', JSON.stringify(updatedUser));

            // Show success message
            successMessage.textContent = 'Profil opdateret succesfuldt!';
            successMessage.style.display = 'block';

            // Update view
            loadUserData(updatedUser);

            // Clear password fields
            document.getElementById('password').value = '';
            document.getElementById('confirmPassword').value = '';

            // Switch back to view mode after 2 seconds
            setTimeout(() => {
                document.getElementById('editMode').style.display = 'none';
                document.getElementById('viewMode').style.display = 'block';
                successMessage.style.display = 'none';
            }, 2000);
        } else {
            errorMessage.textContent = data.error || 'Der opstod en fejl ved opdatering af profil';
            errorMessage.style.display = 'block';
        }
    } catch (error) {
        errorMessage.textContent = 'Der opstod en fejl. Prøv igen senere.';
        errorMessage.style.display = 'block';
        console.error('Profile update error:', error);
    }
});

// Delete account button
document.getElementById('deleteAccountBtn').addEventListener('click', async () => {
    const confirmed = confirm(
        'Er du sikker på, at du vil slette din konto?\n\n' +
        'Denne handling kan ikke fortrydes. Alle dine data vil blive permanent slettet.'
    );

    if (!confirmed) {
        return;
    }

    // Ask for confirmation again
    const doubleConfirmed = confirm(
        'Dette er din sidste chance!\n\n' +
        'Klik OK for at slette din konto permanent.'
    );

    if (!doubleConfirmed) {
        return;
    }

    try {
        const token = sessionStorage.getItem('token');
        const user = JSON.parse(sessionStorage.getItem('user') || '{}');

        if (!user._id) {
            alert('Bruger ID mangler - prøv at logge ind igen');
            return;
        }

        const response = await fetch(`/api/user/${user._id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });


        if (response.ok) {
            // Clear local storage
            sessionStorage.removeItem('token');
            sessionStorage.removeItem('user');

            // Redirect to landing page
            alert('Din konto er blevet slettet.');
            window.location.href = '/';
        } else {
            const data = await response.json();
            alert('Der opstod en fejl ved sletning af konto: ' + (data.error || 'Ukendt fejl'));
        }
    } catch (error) {
        alert('Der opstod en fejl. Prøv igen senere.');
        console.error('Delete account error:', error);
    }
});