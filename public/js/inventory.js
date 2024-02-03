let user_pic;

function fetchAndDisplayInventory() {
  fetch(`/get-inventory-items`)
    .then(response => response.json())
    .then(data => {
      // Check if data is not empty
      if (data.length > 0) {
        // Assuming the first row has a property called 'user_pic'
        user_pic = data[0].user_pic;

        // Now you can use the user_pic variable as needed
        console.log('User Pic:', user_pic);

        // Call the displayInventoryItems function with the data
        displayInventoryItems(data);
      } else {
        console.error('Error: Empty data received.');
      }
    })
    .catch(error => console.error('Error retrieving inventory items:', error));
}

function displayInventoryItems(items) {
  var container = document.getElementById('inventory-container');
  container.innerHTML = ''; // Clear the container before adding updated cards

  items.forEach(function(item) {
    var card = document.createElement('div');
    card.className = 'inventory-card';

    // Check if items.user_pic == items.item_id
    if (item.item_id == user_pic) {
      card.classList.add('greyed-out'); // Add a class to grey out the card
    }

    // Display image
    var img = document.createElement('img');
    img.src = item.link;
    img.alt = item.name; 
    card.appendChild(img);

    // Add "Use" button
    var useButton = document.createElement('button');
    useButton.classList.add('useBtn');
    useButton.textContent = 'Use';

    // Check if the card is not greyed out before attaching the click event
    if (!card.classList.contains('greyed-out')) {
      useButton.addEventListener('click', function() {
        

        // Simulate the change-profile-picture endpoint
        // Replace this fetch with your actual endpoint
        fetch('/change-profile-picture', {
          method: 'POST',
          headers: {
            'Content-type': 'application/json',
          },
          body: JSON.stringify({ item_id: item.item_id }),
        })
        .catch(error => console.error('Error updating inventory:', error));

        fetchAndDisplayInventory();
      });
    }

    card.appendChild(useButton);
    container.appendChild(card);
  });
}

// Initial fetch and display
fetchAndDisplayInventory();
