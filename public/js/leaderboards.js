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

// Create a table element
const tableElement = document.createElement('table');

// Create a header row
const headerRow = document.createElement('tr');

// Create the first header column for "Rank"
const rankHeader = document.createElement('th');
rankHeader.textContent = 'Rank';

// Create the second header column for "Username"
const usernameHeader = document.createElement('th');
usernameHeader.textContent = 'Username';

// Create the third header column for "Score"
const scoreHeader = document.createElement('th');
scoreHeader.textContent = 'Score';

// Append header cells to the header row
headerRow.appendChild(rankHeader);
headerRow.appendChild(usernameHeader);
headerRow.appendChild(scoreHeader);

// Append the header row to the table
tableElement.appendChild(headerRow);

// Iterate through the data and create rows for each result
data.forEach((result, index) => {
    // Create a table row (tr)
    const trElement = document.createElement('tr');

    // Create the first column (Rank)
    const rankCell = document.createElement('td');
    rankCell.textContent = index + 1; // Rank starts at 1
    trElement.appendChild(rankCell);

    // Create the second column (username)
    const usernameCell = document.createElement('td');
    usernameCell.textContent = result.username;

    // Create the third column (score)
    const scoreCell = document.createElement('td');
    const score = result.classic_high_score !== null ? result.classic_high_score : 0;
    scoreCell.textContent = score;

    // Append cells to the row
    trElement.appendChild(usernameCell);
    trElement.appendChild(scoreCell);

    // Append the row to the table
    tableElement.appendChild(trElement);
});

// Append the table to the leaderboardsDiv
leaderboardsDiv.appendChild(tableElement);

        
    })
    .catch(error => {
        console.error('Error: ', error);
    });
