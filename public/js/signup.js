
const signupForm = document.querySelector('.signup form');
const usernameInput = signupForm.querySelector('#username');
const usernameError = signupForm.querySelector('#username-error');
const passwordError = signupForm.querySelector('#password-error');
const passwordInput = signupForm.querySelector('#password');
const confirmPasswordInput = signupForm.querySelector('#confirm_password');
const emailInput = signupForm.querySelector('#email');



signupForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const username = usernameInput.value.trim();
    const password = passwordInput.value.trim();
    const email = emailInput.value.trim();
    const confirm_password = confirmPasswordInput.value.trim();
    
    if (username.length > 15) {
        usernameError.textContent = "Username longer than 15 characters"  || "An error occured";
    }

    if (password === confirm_password) {

        // Use fetch API to send a POST request to the server
        const response = await fetch('/signup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password, email })
        });

     

        // Clear the error message before checking for new errors
        usernameError.textContent = '';
        passwordError.textContent = '';

        if (response.status === 200) {
            // Continue with your existing success logic (redirect, etc.)
            window.location.href = '/menu.html';
        
        } else {
            // Handle other status codes as needed
            console.error('Unexpected status code:', response.status);
        }


    }

    else {
        console.log("Passwords do not match.")
        passwordError.textContent = "Passwords do not match." || 'An error occurred.';
    }
   
});

