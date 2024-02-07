// Fetch users and render the table
fetch('/get-users', {
  method: 'GET',
  headers: {
    'Content-type': 'application/json',
  },
})
  .then(response => {
    if (!response.ok) {
      throw new Error('Network response not OK');
    }
    return response.json();
  })
  .then(data => {
    console.log(data);

    // Assuming 'data' is an array of user objects
    const table = document.createElement('table');

   // ... (existing code)

// Create header row
const headerRow = table.insertRow(0);
const headers = ['Username', 'Email', 'Password' , 'DbCoins', 'Actions'];
headers.forEach(headerText => {
  const th = document.createElement('th');
  th.textContent = headerText;
  headerRow.appendChild(th);
});

// Create data rows
data.forEach(user => {
  const row = table.insertRow(-1);

  // Iterate through the desired user properties and create cells
  const propertiesToShow = ['username', 'email','password', 'dbcoins']; // Adjust as needed
  propertiesToShow.forEach(property => {
    const cell = row.insertCell();
    cell.textContent = user[property];
  });

  // Add delete button
  const deleteButton = document.createElement('button');
  deleteButton.textContent = 'Delete';
  deleteButton.addEventListener('click', () => deleteUser(user.user_id));

  // Add edit button
  const editUsernameButton = document.createElement('button');
  editUsernameButton.textContent = 'Edit username';
  editUsernameButton.addEventListener('click', () => editUsername(user.user_id));

  const editEmailButton = document.createElement('button');
  editEmailButton.textContent = 'Edit Email';
  editEmailButton.addEventListener('click', () => editEmail(user.user_id));

  const editPasswordButton = document.createElement('button');
  editPasswordButton.textContent = 'Edit Password';
  editPasswordButton.addEventListener('click', () => editPassword(user.user_id));

  // Add edit dbcoins button
  const editDbCoinsButton = document.createElement('button');
  editDbCoinsButton.textContent = 'Edit DbCoins';
  editDbCoinsButton.addEventListener('click', () => editDbCoins(user.user_id));

  // Create a cell for buttons
  const actionsCell = row.insertCell();

  actionsCell.appendChild(editUsernameButton);
  actionsCell.appendChild(editEmailButton);
  actionsCell.appendChild(editPasswordButton);
  actionsCell.appendChild(editDbCoinsButton);
  actionsCell.appendChild(deleteButton);

  // Add visible border to each row
  row.style.border = '1px solid #000';

  // Add visible border to each cell
  Array.from(row.cells).forEach(cell => {
    cell.style.border = '1px solid #000';
  });
});

// ... (remaining code)


    // Append the table to the document body or another container
    document.body.appendChild(table);
  })
  .catch(error => console.error('Error fetching users:', error));




// Function to delete a user
function deleteUser(userId) {
  // Confirm deletion with the user
  const confirmDelete = confirm(`Are you sure you want to delete user with ID: ${userId}?`);
  
  if (confirmDelete) {
    // Make a DELETE request to the server to delete the user
    fetch(`/delete-user/${userId}`, {
      method: 'DELETE',
      headers: {
        'Content-type': 'application/json',
      },
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response not OK');
        }
        return response.json();
      })
      .then(data => {
        console.log(data);
        
        location.reload(); // Refresh the page after deletion (you might want to update the UI dynamically)
      })
      .catch(error => console.error('Error deleting user:', error));
  }
}



// Function to edit the username
function editUsername(userId) {
  // Confirm editing with the user
  const confirmEdit = confirm(`Are you sure you want to edit username for user with ID: ${userId}?`);

  if (confirmEdit) {
    // Fetch new username from user input or modal
    const newUsername = prompt('Enter new username:');

    // Make a PUT request to the server to update username
    fetch(`/edit-username/${userId}`, {
      method: 'PUT',
      headers: {
        'Content-type': 'application/json',
      },
      body: JSON.stringify({ newUsername }),
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response not OK');
        }
        return response.json();
      })
      .then(data => {
        console.log(data);
        // Update the UI or handle success as needed
        location.reload(); // Refresh the page after updating username (you might want to update the UI dynamically)
      })
      .catch(error => console.error('Error editing username:', error));
  }
}


// Function to edit the email
function editEmail(userId) {
  // Confirm editing with the user
  const confirmEdit = confirm(`Are you sure you want to edit email for user with ID: ${userId}?`);

  if (confirmEdit) {
    // Fetch new email from user input or modal
    const newEmail = prompt('Enter new email:');

    // Make a PUT request to the server to update email
    fetch(`/edit-email/${userId}`, {
      method: 'PUT',
      headers: {
        'Content-type': 'application/json',
      },
      body: JSON.stringify({ newEmail }),
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response not OK');
        }
        return response.json();
      })
      .then(data => {
        console.log(data);
        // Update the UI or handle success as needed
        location.reload(); // Refresh the page after updating email (you might want to update the UI dynamically)
      })
      .catch(error => console.error('Error editing email:', error));
  }
}

//Function to edit the password
function editPassword(userId) {
  // Confirm editing with the user
  const confirmEdit = confirm(`Are you sure you want to edit password for user with ID: ${userId}?`);

  if (confirmEdit) {
    // Fetch new password from user input or modal
    const newPassword = prompt('Enter new password:');

    // Make a PUT request to the server to update password
    fetch(`/edit-password/${userId}`, {
      method: 'PUT',
      headers: {
        'Content-type': 'application/json',
      },
      body: JSON.stringify({ newPassword }),
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response not OK');
        }
        return response.json();
      })
      .then(data => {
        console.log(data);
        // Update the UI or handle success as needed
        location.reload(); // Refresh the page after updating password (you might want to update the UI dynamically)
      })
      .catch(error => console.error('Error editing password:', error));
  }
}


// Function to save the edited user
function saveUserEdit(userId) {
  // Get the row corresponding to the user ID
  const row = document.querySelector(`tr[data-user-id="${userId}"]`);
  if (!row) {
    console.error(`Row for user with ID ${userId} not found`);
    return;
  }

  // Create an object to store the updated user data
  const updatedUserData = { user_id: userId };

  // Iterate through cells and update the data object
  for (let i = 0; i < row.cells.length; i++) {
    const cell = row.cells[i];
    const propertyName = cell.dataset.propertyName;
    if (propertyName) {
      const inputValue = cell.querySelector('input').value;
      updatedUserData[propertyName] = inputValue;
    }
  }

  // Make a PUT request to update the user on the server
  const updateEndpoint = `/edit-user/${userId}`; // Update the endpoint based on your server API
  fetch(updateEndpoint, {
    method: 'PUT',
    headers: {
      'Content-type': 'application/json',
    },
    body: JSON.stringify(updatedUserData),
  })
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response not OK');
      }
      return response.json();
    })
    .then(data => {
      console.log(data);

      // Check if the 'password' property is present and non-empty
      const newPassword = updatedUserData.password;
      if (newPassword && newPassword.trim() !== '') {
        // Make a separate request to update the password
        const updatePasswordEndpoint = `/edit-password/${userId}`;
        fetch(updatePasswordEndpoint, {
          method: 'PUT',
          headers: {
            'Content-type': 'application/json',
          },
          body: JSON.stringify({ newPassword }),
        })
          .then(passwordResponse => {
            if (!passwordResponse.ok) {
              throw new Error('Network response not OK');
            }
            return passwordResponse.json();
          })
          .then(passwordData => {
            console.log(passwordData);
            // Handle password update success or update the UI accordingly
          })
          .catch(passwordError => console.error('Error updating password:', passwordError));
      }

      // Update the UI or handle success as needed
      location.reload(); // Refresh the page after updating user (you might want to update the UI dynamically)
    })
    .catch(error => console.error('Error saving user edit:', error));
}


function editDbCoins(userId) {
  // Confirm editing dbcoins with the user
  const confirmEdit = confirm(`Are you sure you want to edit dbcoins for user with ID: ${userId}?`);
  
  if (confirmEdit) {
    // Fetch new dbcoins from user input or modal
    const newDbCoins = prompt('Enter new dbcoins:');

    // Make a PUT request to the server to update dbcoins
    fetch(`/edit-dbcoins/${userId}`, {
      method: 'PUT',
      headers: {
        'Content-type': 'application/json',
      },
      body: JSON.stringify({ newDbCoins }),
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response not OK');
        }
        return response.json();
      })
      .then(data => {
        console.log(data);
        // Update the UI or handle success as needed
        location.reload(); // Refresh the page after updating dbcoins (you might want to update the UI dynamically)
      })
      .catch(error => console.error('Error editing dbcoins:', error));
  }
}



const logoutButton = document.createElement('button');
    logoutButton.textContent = 'Logout';
    logoutButton.id = 'logoutBtn';

    // Append the logout button to the document body or another container
document.body.appendChild(logoutButton);

document.getElementById("logoutBtn").addEventListener("click", () => {
  // Trigger the logout by fetching the /logout route
  fetch('/logout')
    .then(() => {
      // Redirect to the login page after logout
      window.location.href = '/index.html';
    })
    .catch(error => console.error('Error logging out:', error));
});


