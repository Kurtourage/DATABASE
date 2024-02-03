fetch('/get-user-info')
.then(response => response.json())
.then(data => {
  // Process the user data received from the server

  // Update the content of the profile-codename and profile-date-issued divs
  const codenameElements = document.querySelectorAll('.profile-codename1');
  const dateIssuedElements = document.querySelectorAll('.profile-date-issued1');
  const profileElements = document.querySelectorAll('.profile-picture')

  codenameElements.forEach(element => {
    element.textContent = `${data.username || 'N/A'}`;
  });

profileElements.forEach(element => {
  element.style.backgroundImage = `url('${data.link || 'N/A'}')`;
});
  
  dateIssuedElements.forEach(element => {

    const formattedDate = new Date(data.creation_date).toLocaleDateString('en-CA');
    element.textContent = `${formattedDate || 'N/A'}`;
    
  });
})
.catch(error => console.error('Error fetching user data:', error));
