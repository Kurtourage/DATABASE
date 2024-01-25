fetch('/get-leaderboards', {
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

        const leaderboardsDiv = document.getElementById('leaderboards');

        // Create an ordered list
        const olElement = document.createElement('ol');

        // Iterate through the data and create list items for each result
        data.forEach((result, index) => {
          
            const liElement = document.createElement('li');
            const score = result.classic_high_score !== null ? result.classic_high_score : 0;
            liElement.textContent = `${result.username} - Score: ${score}`;
            olElement.appendChild(liElement);
        });

        // Append the ordered list to the leaderboardsDiv
        leaderboardsDiv.appendChild(olElement);
    })
    .catch(error => {
        console.error('Error: ', error);
    });
