
    const signupForm = document.querySelector('.signup form');
    const usernameInput = signupForm.querySelector('#username');
    const usernameError = signupForm.querySelector('#username-error');

    signupForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const username = usernameInput.value.trim();

        // Use fetch API to send a POST request to the server
        const response = await fetch('/signup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username })
        });

        const result = await response.json();

        // Clear the error message before checking for new errors
        usernameError.textContent = '';

        if (response.status === 200) {
            // Continue with your existing success logic (redirect, etc.)
            window.location.href = '/menu.html';
        } else if (response.status === 400) {
            // Display the error message on the client side with red color
            usernameError.textContent = result.error || 'An error occurred.';
        } else {
            // Handle other status codes as needed
            console.error('Unexpected status code:', response.status);
        }
    });

