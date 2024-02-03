
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
        if (data.type === 'admin' ) {
            // Manually redirect to admin dashboard
            if (data.success){

              window.location.href = '/admin_dashboard.html';
              
            }
           
        } else if (data.type === 'password') {
            // Handle password error
            const passwordErrorContainer = document.getElementById('password-error');
            passwordErrorContainer.textContent = data.error || '';
        } else if (data.type === 'user') {


          if (data.success) {
              // Manually redirect to menu
              window.location.href = '/menu.html';
          }
         
          else {

            const usernameErrorContainer = document.getElementById('username-error');
            usernameErrorContainer.textContent = data.error || '';

          
        }
        }
       
    })
    
        
      .catch(error => {
          console.error('Error during login:', error);
          // Handle other errors if needed
      });
  }
  