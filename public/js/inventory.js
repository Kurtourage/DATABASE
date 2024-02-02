
  document.addEventListener('DOMContentLoaded', function () {
   

    fetch(`/get-inventory-items`)
      .then(response => response.json())
      .then(data => displayInventoryItems(data))
      .catch(error => console.error('Error retrieving inventory items:', error));

    function displayInventoryItems(items) {
      var container = document.getElementById('inventory-container');

      items.forEach(function(item) {
        var card = document.createElement('div');
        card.className = 'card'; 
             // Display image
             var img = document.createElement('img');
             img.src = item.link;
             img.alt = item.name; 
             card.appendChild(img);
        container.appendChild(card);
      });
    }
  });
