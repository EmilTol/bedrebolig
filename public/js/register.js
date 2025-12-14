document.getElementById("year").textContent = new Date().getFullYear();

// Password strength checker
const passwordInput = document.getElementById('password');
const strengthBar = document.getElementById('passwordStrengthBar');

passwordInput.addEventListener('input', (e) => {
    const password = e.target.value;
    let strength = 0;

    if (password.length >= 5) strength++;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;

    strengthBar.className = 'password-strength-bar';
    if (strength <= 2) {
        strengthBar.classList.add('weak');
    } else if (strength <= 3) {
        strengthBar.classList.add('medium');
    } else {
        strengthBar.classList.add('strong');
    }
});

// Form submission
document.getElementById('registerForm').addEventListener('submit', async (e) => {
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

    // Validate passwords match
    if (password !== confirmPassword) {
        errorMessage.textContent = 'Adgangskoderne matcher ikke';
        errorMessage.style.display = 'block';
        return;
    }

    // Validate phone number
    if (!/^[0-9]{8}$/.test(phoneNumber)) {
        errorMessage.textContent = 'Telefonnummeret skal være 8 cifre';
        errorMessage.style.display = 'block';
        return;
    }

    // API kald til backend
    try {
        const response = await fetch('/api/user', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name,
                email,
                phoneNumber,
                password
            })
        });

        const data = await response.json();

        if (response.ok) {
            successMessage.textContent = 'Konto oprettet! Omdirigerer til login...';
            successMessage.style.display = 'block';

            // Redirect efter 2 sekunder
            setTimeout(() => {
                window.location.href = 'login.html';
            }, 2000);
        } else {
            errorMessage.textContent = data.errors ? data.errors.join(', ') : 'Der opstod en fejl ved oprettelse af konto';
            errorMessage.style.display = 'block';
        }
    } catch (error) {
        errorMessage.textContent = 'Der opstod en fejl. Prøv igen senere.';
        errorMessage.style.display = 'block';
        console.error('Registration error:', error);
    }
});