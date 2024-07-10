document.addEventListener('DOMContentLoaded', () => {
    const registerBtnPage = document.getElementById('registerBtnPage');

    registerBtnPage.addEventListener('click', async () => {
        const username = document.getElementById('usernameInput').value;
        const password = document.getElementById('passwordInput').value;

        if (!username || !password) {
            toastr.warning('Username and password are required');
            return;
        }

        try {
            const response = await fetch('http://localhost:5500/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, password })
            });

            const result = await response.json();

            if (response.ok) {
                toastr.success('Registration successful');
                console.log('User data:', result.data);

                localStorage.setItem('user_id', result.data.id);
                localStorage.setItem('username', result.data.username);

                window.location.href = 'index.html';
            } else {
                if (result.message === 'Username already exists') {  
                    toastr.error('A user with that username already exists. Please choose a different username.');
                } else {
                    toastr.error(`Registration failed: ${result.message}`);
                }
            }
        } catch (error) {
            console.error('Error:', error);
            toastr.error('An error occurred during registration. Please try again.');
        }
    });
});