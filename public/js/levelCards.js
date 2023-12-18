document.addEventListener('DOMContentLoaded', function () {
    // Get all card elements
    var cards = document.querySelectorAll('.card');

    // Add a click event listener to each card
    cards.forEach(function (card) {
        card.addEventListener('click', function () {
            // Get the chapter number from the card's ID
            var chapterNumber = card.id.replace('level', '');

            // Redirect to the corresponding chapter page
            window.location.href = '/CH' + chapterNumber + '.html';
        });
    });
});