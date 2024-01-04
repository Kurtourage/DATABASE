const chapterColor = ['#fff', '#fff', '#222222', '#333333', '#444444']; // Add more colors as needed

let user_level_id;
let userData;

async function checkUserLevel() {
    try {
        // Fetch user_id from the server's session details
        const response = await fetch('/get-user-level');
        if (!response.ok) {
            throw new Error('Failed to fetch user level');
        }

        userData = await response.json();
        user_level_id = userData.level;

        // Add an image, text, and styling to cards based on user level
        var cards = document.querySelectorAll('.card');

        cards.forEach(function (card, index) {
            // Get the chapter number from the card's ID
            var chapterId = parseInt(card.id);

            // Check if the card's id is greater than the user_id
            if (chapterId > user_level_id) {
                // Add an image to the card
                const image = document.createElement('img');
                image.src = '/assets/locked.png'; // replace with the actual image path
                card.appendChild(image);

                // Remove the click event listener to make it not clickable
                const clickHandler = function () {
                    alert('Chapter locked!'); // You can customize this alert message
                };
                card.removeEventListener('click', clickHandler);
                card.style.cursor = 'not-allowed';
            } else {
                // Display the chapter number on unlocked cards
                card.textContent = 'CHAPTER ' + chapterId;

                // Set the background color based on the chapterColor array
                card.style.backgroundColor = chapterColor[index];

                // Add a click event listener to each unlocked card
                const clickHandler = function () {
                    // Redirect to the corresponding chapter page
                    window.location.href = '/CH' + chapterId + '.html';
                };
                card.addEventListener('click', clickHandler);
            }
        });

    } catch (error) {
        console.error('Error checking user level:', error);
    }
}

// Call checkUserLevel when the DOM is loaded
document.addEventListener('DOMContentLoaded', checkUserLevel);
