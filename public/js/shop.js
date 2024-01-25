
fetch('/get-user-info?' + new Date().getTime(), {
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


 // Update the div with the user's dbcoins
 const dbcoinsDiv = document.getElementById('dbcoins');
 if (dbcoinsDiv) {
     dbcoinsDiv.textContent = `DBCoins: ${user_dbcoins}`;
 }
 console.log(data);

});



fetch('/get-shop-items', {
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
        console.log('Server response: ', data);

       let userPurchases = data.userPurchases;
        const shopItemsDiv = document.getElementById('shop-items');

        // Iterate through the data and create cards for each result
        data.shopItems.forEach(result => {
            const cardDiv = document.createElement('div');
            cardDiv.classList.add('card');

            // Create and append elements for name, item_id, and link
            const nameElement = document.createElement('p');
            nameElement.textContent = `Name: ${result.name}`;

            const priceElement = document.createElement('p');
            priceElement.textContent = `Price: ${result.price}`;

            const linkElement = document.createElement('img');
            linkElement.src = result.link; 
            linkElement.alt = result.name; 
            const item_id = result.item_id;  // Declare as local variable
            const item_type = result.type;  // Declare as local variable
            const price = result.price; 

            const buyButton = document.createElement('button');
            buyButton.textContent = 'Buy';


            const isPurchased = userPurchases.some(purchase => purchase.item_id === result.item_id);
          
            if (isPurchased) {
                cardDiv.classList.add('purchased'); // Add your CSS class for styling
                buyButton.disabled = true; // Optionally, disable the buy button

             } else {

                buyButton.addEventListener('click', () => {
                
                    
                    if (user_dbcoins > result.price) 
                    {
                         
    
                         fetch('/buy-item', {
                            method: 'POST', 
                            headers: {
                                'Content-type': 'application/json', 
                            },
                            body: JSON.stringify({ price, item_id, item_type})
                         })
                    };
                    
                });
             }
          

            // Append elements to the cardDiv
            cardDiv.appendChild(nameElement);
            cardDiv.appendChild(priceElement);
            cardDiv.appendChild(linkElement);
            cardDiv.appendChild(buyButton);

            // Append the cardDiv to the shopItemsDiv
            shopItemsDiv.appendChild(cardDiv);
        });
    })
    .catch(error => {
        console.error('Error: ', error);
    });
