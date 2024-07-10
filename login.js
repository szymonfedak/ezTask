document.addEventListener('DOMContentLoaded', () => {
    const loginBtnPage = document.getElementById('loginBtnPage');


    loginBtnPage.addEventListener('click', async () => {
        const username = document.getElementById('usernameInput').value;
        const password = document.getElementById('passwordInput').value;

        if (!username || !password) {
            toastr.warning('Username and password are required');
            return;
        }

        try {
            const response = await fetch('http://localhost:5500/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, password })
            });

            const result = await response.json();

            if (response.ok) {
                toastr.success('Login successful');
                console.log('User data:', result.data);

                // Store user_id and username in localStorage
                localStorage.setItem('user_id', result.data.id); // Ensure the correct field is used
                localStorage.setItem('username', result.data.username);

                window.location.href = 'index.html';
            } else {
                toastr.error(`Login failed: ${result.message}`);
            }
        } catch (error) {
            console.error('Error:', error);
            toastr.error('An error occurred during login. Please try again.');
        }
    });
});