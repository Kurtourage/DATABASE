    // Function to send the user's input to the server for checking
    async function checkUserAnswer() {
      const userInput = document.getElementById('sqlInput').value;
     

      try {
        const response = await fetch('/check-level-answer', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ userInput }),
        });

        if (!response.ok) {
          throw new Error('Failed to check the level answer');
        }

        const result = await response.json();
        handleCheckResult(result);
      } catch (error) {
        console.error(error);
      }
    }

    // Function to handle the result of checking the user's answer
    function handleCheckResult(result) {
      const resultMessage = document.getElementById('result-message');
      if (result.success) {
        resultMessage.textContent = 'Level completed!'; // You can update the UI accordingly
        // Implement logic to move to the next level or perform other actions
      } else {
        resultMessage.textContent = 'Level not completed. Try again.'; // You can update the UI accordingly
      }
    }

    // Event listener for the submit button
    document.getElementById('executeBtn1').addEventListener('click', checkUserAnswer);

   