document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const errorMessage = document.getElementById('errorMessage');

    // Reset error message
    errorMessage.style.display = 'none';

    // Her kan du tilføje API kald til din backend
    // Eksempel:
    /*
    try {
        const response = await fetch('/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password })
        });

        if (response.ok) {
            const data = await response.json();
            // Gem token og redirect
            localStorage.setItem('token', data.token);
            window.location.href = '/dashboard.html';
        } else {
            errorMessage.textContent = 'Forkert email eller adgangskode';
            errorMessage.style.display = 'block';
        }
    } catch (error) {
        errorMessage.textContent = 'Der opstod en fejl. Prøv igen senere.';
        errorMessage.style.display = 'block';
    }
    */

    // Midlertidig test
    console.log('Login forsøg:', { email, password });
    alert('Login funktionalitet skal forbindes til backend API');
});