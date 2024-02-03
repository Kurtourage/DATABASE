fetch('/level-5-checker', {
    method: 'POST',
    headers: {
        'Content-type': 'application/json',
    },
    body: JSON.stringify({sqlInput}),
})

.then(response=>{

    if (!response.ok) {
        throw new Error('Network response not OK');
      }
      return response.json();
})

.then(data => {

    hintDiv.innerHTML = data;


})

.catch(error => {

    console.error('Error fetching data:', error);
    // Handle error, e.g., display an error message in the hint div
    hintDiv.innerHTML = 'An error occurred while fetching data.';
});