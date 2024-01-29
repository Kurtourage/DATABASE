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
  
      // Create header row
      const headerRow = table.insertRow(0);
      const headers = ['Username', 'Email', 'Actions'];
      headers.forEach(headerText => {
        const th = document.createElement('th');
        th.textContent = headerText;
        headerRow.appendChild(th);
      });
  
      // Create data rows
      data.forEach(user => {
        const row = table.insertRow(-1);
  
        // Iterate through user properties and create cells
        for (const property in user) {
          if (user.hasOwnProperty(property)) {
            const cell = row.insertCell();
            cell.textContent = user[property];
          }
        }
  
        // Add delete button
        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.addEventListener('click', () => deleteUser(user.user_id)); // Assuming there's an 'id' property
  
        // Add edit button
        const editButton = document.createElement('button');
        editButton.textContent = 'Edit';
        editButton.addEventListener('click', () => editUser(user.user_id)); // Assuming there's an 'id' property
  
        // Create a cell for buttons
        const actionsCell = row.insertCell();
        actionsCell.appendChild(deleteButton);
        actionsCell.appendChild(editButton);
      });
  
      // Append the table to the document body or another container
      document.body.appendChild(table);
    })
    .catch(error => console.error('Error fetching users:', error));
  
  function deleteUser(userId) {
    // Implement logic to delete the user with the given userId
    console.log(`Deleting user with ID: ${userId}`);
  }
  
  function editUser(userId) {
    // Implement logic to edit the user with the given userId
    console.log(`Editing user with ID: ${userId}`);
  }
  