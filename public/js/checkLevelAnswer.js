          // Function to check the user's answer for the current level on the server
          async function checkLevelAnswer(userInput) {
            try {
              const response = await fetch('/check-level-answer', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({ userInput}),
              });
        
              if (!response.ok) {
                throw new Error('Failed to check the level answer');
              }
        
              const result = await response.json();
              if (result.success) {
                console.log('Level completed!'); // You can handle level completion on the client side
              } else {
                console.log('Level not completed.'); // You can handle the result accordingly
              }
        
            } catch (error) {
              console.error(error);
            }
          }



