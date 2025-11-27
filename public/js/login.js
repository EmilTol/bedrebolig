document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const errorMessage = document.getElementById('errorMessage');
    const submitButton = e.target.querySelector("button[type=submit]");

    // Reset error message
    errorMessage.style.display = 'none';
    errorMessage.textContent = "";

    submitButton.disabled = true;
    submitButton.textContent = "Logger ind";

    try {
        const response = await fetch('/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (response.ok) {
            // Gem token og redirect
            localStorage.setItem('token', data.token);
            localStorage.setItem("user", JSON.stringify(data.user));
            window.location.href = '/';
        } else {
            errorMessage.textContent = 'Forkert email eller adgangskode';
            errorMessage.style.display = 'block';
            submitButton.disabled = false;
            submitButton.textContent = 'Login';
        }
    } catch (error) {
        errorMessage.textContent = 'Der opstod en fejl. Prøv igen senere.';
        errorMessage.style.display = 'block';
        submitButton.disabled = false;
        submitButton.textContent = 'Login';
    }
});