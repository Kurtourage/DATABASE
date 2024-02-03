
document.getElementById('loginForm').addEventListener('submit', submitLoginForm);

const container = document.querySelector(".container"),
    signup = document.querySelector(".signup-link"),
    login = document.querySelector(".login-link")

    signup.addEventListener("click", ()=>{
        container.classList.add("active");
    })
    login.addEventListener("click", ()=>{
        container.classList.remove("active");
    })
   
  
  function submitLoginForm(event) {
      event.preventDefault();  // Prevent default form submission behavior
  
      const username = document.getElementById('username').value;
      const password = document.getElementById('password').value;
  
      // Perform AJAX request for login
      fetch('/login', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify({ username, password }),
      })
      .then(response => response.json())
      .then(data => {
        if (data.type === 'admin') {
            // Manually redirect to admin dashboard
            window.location.href = '/admin_dashboard.html';
        } else if (data.type === 'password') {
            // Handle password error
            const passwordErrorContainer = document.getElementById('password-error');
            passwordErrorContainer.textContent = data.error || '';
        } else {
            // Manually redirect to menu
            window.location.href = '/menu.html';
        }
    })
    
        
      .catch(error => {
          console.error('Error during login:', error);
          // Handle other errors if needed
      });
  }
  