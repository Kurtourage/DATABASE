function fetchUserInformation() {
    fetch(`/get-user-info?${new Date().getTime()}`, {
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
        user_dbcoins = data.dbcoins;
        const dbcoinsDiv = document.getElementById('dbcoins');
        if (dbcoinsDiv) {
          dbcoinsDiv.textContent = `${data.dbcoins}`;
        }
        
        // Update the UI for shop items after buying
        updateShopItemsUI(data.userPurchases);
  
        console.log(data);
      })
      .catch(error => {
        console.error('Error fetching user data:', error);
      });
  }
  
  function updateShopItemsUI(userPurchases) {
    const shopItemsDiv = document.getElementById('shop-items');
  
    // Iterate through the shop items and update the UI
    shopItemsDiv.querySelectorAll('.shop-card').forEach(cardDiv => {
      const item_id = cardDiv.dataset.itemId;
      const buyButton = cardDiv.querySelector('.buyBtn');
  
      const isPurchased = userPurchases.some(purchase => purchase.item_id === item_id);
  
      if (isPurchased) {
        cardDiv.classList.add('purchased');
        buyButton.disabled = true;
      } else {
        cardDiv.classList.remove('purchased');
        buyButton.disabled = false;
      }
    });
  }



  function fetchShopItems() {
    const cacheBuster = new Date().getTime(); // Generate a unique timestamp for cache-busting
  
    fetch(`/get-shop-items?cache=${cacheBuster}&${new Date().getTime()}`, {
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
        console.log('Server response:', data);
  
        let userPurchases = data.userPurchases;
        const shopItemsDiv = document.getElementById('shop-items');
        const notEnoughCoinsDiv = document.createElement('div'); // New div for not enough coins
        notEnoughCoinsDiv.classList.add('not-enough-coins');
        notEnoughCoinsDiv.textContent = 'Not enough dbcoins'; // Text content for not enough coins
  
        // Clear existing content
        shopItemsDiv.innerHTML = '';
  
          data.shopItems.forEach(result => {
            const cardDiv = document.createElement('div');
            cardDiv.classList.add('shop-card');
            cardDiv.dataset.itemId = result.item_id; // Store item_id as a data attribute
  
            const nameElement = document.createElement('p');
            nameElement.textContent = `Name: ${result.name}`;
  
            const priceElement = document.createElement('p');
            priceElement.textContent = `Price: ${result.price}`;
  
            const linkElement = document.createElement('img');
            linkElement.src = result.link;
            linkElement.alt = result.name;
  
            const item_id = result.item_id;
            const item_type = result.type;
            const price = result.price;
  
            const buyButton = document.createElement('button');
            buyButton.classList.add('buyBtn');

  
            const isPurchased = userPurchases.some(purchase => purchase.item_id === result.item_id);
  
            if (isPurchased) {
              cardDiv.classList.add('purchased');
              buyButton.disabled = true;
            } else {
              buyButton.addEventListener('click', () => {
                if (user_dbcoins > result.price) {
                  fetch('/buy-item', {
                    method: 'POST',
                    headers: {
                      'Content-type': 'application/json',
                    },
                    body: JSON.stringify({ price, item_id, item_type }),
                  });
                  fetchUserInformation();
                  fetchShopItems();
                } else {
                  // If not enough coins, display a message
                  cardDiv.appendChild(notEnoughCoinsDiv);
                }
              });
            }
  
            cardDiv.appendChild(nameElement);
            cardDiv.appendChild(priceElement);
            cardDiv.appendChild(linkElement);
            cardDiv.appendChild(buyButton);
  
            shopItemsDiv.appendChild(cardDiv);
          });
        
      })
      .catch(error => {
        console.error('Error fetching shop items:', error);
      });
  }
  
  // Initial fetch for user information
  fetchUserInformation();
  
  // Initial fetch for shop items
  fetchShopItems();
  