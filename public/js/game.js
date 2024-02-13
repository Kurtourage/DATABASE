document.addEventListener("DOMContentLoaded", function () {

const mode = 'story';
let currentLevelNumber;
let dbcoins;


const config = {
    locateFile: (filename) => `/dist/${filename}`,
  };
  initSqlJs(config).then(function (SQL) {
    
    let userInput;
    

     function executeGameSQL(sql) {
      fetch('/execute-game-sql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ sql, mode }),
      
          })
          .then(response => response.json())
          .then(data => {
            if (data.success) {
              console.log("Query results:", data.tableHtml);
              displayResults(data.tableHtml);
                 // Clear error message if successful
                 document.getElementById('errorMessage').textContent = '';
            } else {
              console.error('Error executing SQL statement:', data.errorMessage);
                  // Display error message
                  const tableContainer = document.getElementById("tableContainer");
                  while (tableContainer.firstChild) {
                    tableContainer.removeChild(tableContainer.firstChild);
                  }
                  document.getElementById('errorMessage').textContent = data.errorMessage;
    
            }
          })
          .catch(error => console.error('Error executing SQL statement:', error));


          if (currentLevelNumber == 5) {

            const hintDiv = document.getElementById("hint");

    
                fetch('/level-5-checker', {
                  method: 'POST',
                  headers: {
                      'Content-type': 'application/json',
                  },
                  body: JSON.stringify({sql}),
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
            

          }
      }


// Function to extract the level number from the file name
function getCurrentLevelNumber() {
  // Extract the number from the file name (e.g., "CH1.html" -> 1)
  const match = window.location.pathname.match(/\/CH(\d+)\.html/);

  return match ? parseInt(match[1], 6) : 1; // Default to level 1 if not found
}

// Function to start the current level on page load
function startCurrentLevel() {
   currentLevelNumber = getCurrentLevelNumber();
  startLevel(currentLevelNumber);
}

let missionObj = [];
let mission = [];


// Keep track of completed missions
 let completedMissions = [];

// Call startCurrentLevel() on page load
startCurrentLevel();
  

  

          // Function to start a level on the server
       async function startLevel(levelId) {
        try {
          const response = await fetch('/start-level', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ levelId }),
          });

          if (!response.ok) {
            throw new Error('Failed to start the level');
          } 

         
          const result = await response.json();
          missionObj = result.objective;
          mission = result.mission;
          completedMissions = [];

          updateHUD(missionObj);
          console.log(result);
          

        } catch (error) {
          console.error(error);
        }

         
      }


      document.getElementById("executeBtn1").addEventListener("click", function () {
        userInput = document.getElementById('sqlInput').value;
        executeGameSQL(userInput);
      });
      document.getElementById('sqlInput').addEventListener('keyup', function (event) {
        if (event.key === 'Enter') {
            // Trigger the click event for the button
            document.getElementById("executeBtn1").click();
        }
      });
  
  
      

    // Function to send the user's input to the server for checking
    async function checkUserAnswer() {
      
      try {
        const response = await fetch('/check-level-answer', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({userInput}),
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





// Function to update the HUD with the current level mission
function updateHUD(missionObj) {
  fetch('/update-hud')
    .then(response => {
      if (!response.ok) {
        throw new Error('Failed to fetch update-hud response');
      }
      return response.json();
    })
    .then(completedMissionsIndices => {
      // Process the completed missions indices from the server response
      console.log('Completed missions indices:', completedMissionsIndices);

      // Clear previous HUD content
      hudContainer.innerHTML = '';

      // Create a new element to display the level mission
      const levelMissionElement = document.createElement('h1');
      levelMissionElement.textContent = `Objectives:`;
      hudContainer.appendChild(levelMissionElement);

      // Check if missionObj exists and is an array
      if (missionObj && Array.isArray(missionObj)) {
        // Create a new element for the missionObj in bullet form
        const missionObjElement = document.createElement('ul');
        missionObj.forEach((objective, index) => {
          const listItem = document.createElement('li');
          // Check if the current mission index is in the completed missions array
          const isMissionCompleted = completedMissionsIndices.includes(index);

          // Apply strikethrough for completed missions
          if (isMissionCompleted) {
            const strikeThroughElement = document.createElement('s');
            strikeThroughElement.textContent = objective;
            strikeThroughElement.classList.add('completed-mission');
            listItem.appendChild(strikeThroughElement);
          } else {
            listItem.textContent = objective;
          }

          missionObjElement.appendChild(listItem);
        });

        // Append the missionObj element to the HUD container
        hudContainer.appendChild(missionObjElement);
      }
    })
    .catch(error => {
      console.error('Error fetching update-hud response:', error);
    });
}

// Assume you have defined hudContainer elsewhere in your code.
    const hudContainer = document.getElementById('hud-container');




    // Function to handle the result of checking the user's answer
    function handleCheckResult(result) {
      const resultMessage = document.getElementById('result-message');
      const buttonContainer = document.getElementById('button-container');

      updateHUD(missionObj);
      buttonContainer.innerHTML = '';
      if (result.success == true) {
          
        
        const currentLevelMission = result.mission;
        if (!completedMissions.includes(currentLevelMission)) {
          completedMissions.push(currentLevelMission);
        }

        //add fetching for adding coins to user on server endpoint here

        fetch('/add-coins', {
          method: 'POST',
          headers: {'Content-Type': 'application/json',
        },
        body: JSON.stringify({currentLevelNumber}),
        })
        .then(response => response.json())
        .then(data => {
          console.log(data.success);
          console.log(data.dbcoins);
          
       

          // Create a new div
          const coinsInfoDiv = document.createElement("div");
          coinsInfoDiv.id = "coins-infostory";
          coinsInfoDiv.classList.add('coin-story');
          const coinsInfoImg = document.createElement("div");
          coinsInfoImg.classList.add('coin-story-img');

          coinsInfoDiv.textContent = `${data.dbcoins} coins collected`;
        
          // Append the new div to the button container
          buttonContainer.appendChild(coinsInfoDiv);
         
         
          if (currentLevelNumber < 5) {

            // Create a button
            const nextLevelButton = document.createElement('button');
            nextLevelButton.id = 'nextLevelButton';
            nextLevelButton.classList.add('nextLevelButton');


                      // Append the button to the container
            buttonContainer.appendChild(nextLevelButton);
            document.getElementById('nextLevelButton').addEventListener('click', startNextLevel)
          }
         

         
          
          

          const overlay = document.querySelector('.overlay');
          const computer = document.querySelector('.computerBig');
          overlay.classList.add('active');
          buttonContainer.classList.add('active');
          computer.classList.remove('active');


          
          if (currentLevelNumber == 5) {


            const backtoStoryButton = document.createElement('button');
            backtoStoryButton.id = 'backtoStoryButton';
            backtoStoryButton.classList.add('backtoStoryButton');
  
  
                      // Append the button to the container
            buttonContainer.appendChild(backtoStoryButton);
            document.getElementById('backtoStoryButton').addEventListener('click',  function(){
  
               // Redirect to storyMode.html
            window.location.href = 'storyMode.html';
            })
            // code dito

            
          const overlay = document.querySelector('.overlay');
          const computer = document.querySelector('.computerBig');
          overlay.classList.add('active');
          buttonContainer.classList.add('active');
          computer.classList.remove('active');

            fetch('/add-badge', {
              method: 'GET',
              headers: {'Content-Type': 'application/json',
            },            
   
          })
          };

 
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
      } 
    }

    // Event listener for the submit button
    document.getElementById('executeBtn1').addEventListener('click', checkUserAnswer);




    async function startNextLevel() {
      try {
        const response = await fetch('/start-next-level', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({}),
        });
  
        if (!response.ok) {
          throw new Error('Failed to start the next level');
        }
  
        const result = await response.json();
       
        if (currentLevelNumber == 5) {

          console.log("Congratulations on finishing the story!")

        }

        handleStartNextLevelResult(result);
      } catch (error) {
        console.error(error);
      }
    }
  
    function handleStartNextLevelResult(result) {
      const resultMessage = document.getElementById('result-message');
      const buttonContainer = document.getElementById('button-container');
  
      buttonContainer.innerHTML = '';
      if (result.success) {
        resultMessage.textContent = 'Next level started!';

        
        const nextLevelNumber = result.nextLevelNumber; // Adjust this based on your server response
        window.location.href = result.redirectUrl;
        startLevel(nextLevelNumber);
        
        // You can also trigger any additional logic here if needed
      } else {
        resultMessage.textContent = 'Unable to start the next level. ' + result.message;
      }
    }
  


  
    // Initialize the database on the server
    fetch('/initialize-game-db', {
      method: 'POST',
    })
      .then(response => response.json())
      .then(data => console.log(data))
      .catch(error => console.error('Error initializing database:', error));

   
    function displayResults(tableHtml) {
      const tableContainer = document.getElementById("tableContainer");
      const clearContainer = document.getElementById("clearTable");
    
      // Clear previous results
      while (tableContainer.firstChild) {
        tableContainer.removeChild(tableContainer.firstChild);
      }
      tableContainer.innerHTML = tableHtml;
    }
    
    // Event listener for clearContainer outside of displayResults
    document.getElementById("clearTable").addEventListener("click", () => {
      console.log("clear table is clicked.");
    
      // Check if there's an error message and clear it
      const errorMessageElement = document.getElementById('errorMessage');
      if (errorMessageElement.textContent.trim() !== '') {
        errorMessageElement.textContent = '';
      }
    
      // Clear other elements or perform additional actions if needed
      // For example, clear the table results
      const tableContainer = document.getElementById("tableContainer");
      while (tableContainer.firstChild) {
        tableContainer.removeChild(tableContainer.firstChild);
      }
    });
  });



const cheatsheetContent = `
<div class="cheatsheet">
<br>
<h3>Basic Commands:</h3>
<br>
<p class="create-word"><strong>CREATE:</strong> Used to create a new table in a database.<br>
<em>CREATE TABLE table_name (column1 datatype, column2 datatype,<br>column3 datatype);</em></p>
<br>
<p class="select-word"><strong>SELECT:</strong> Retrieve data from a database.<br>
<em>SELECT column1, column2 FROM table_name WHERE condition;</em></p>
<br>
<p class="insert-word"><strong>INSERT:</strong> Add new records into a table.<br>
<em>INSERT INTO table_name (column1, column2) VALUES (value1, value2);</em></p>
<br>
<pclass="update-word"><strong>UPDATE:</strong> Modify existing records in a table.<br>
<em>UPDATE table_name SET column1 = value1 WHERE condition;</em></p>
<br>
<p class="delete-word"><strong>DELETE:</strong> Remove records from a table.<br>
<em>DELETE FROM table_name WHERE condition;</em></p>
<br>
<hr>
<br>
<h3>Data Types:</h3>
<br>
<p class="integer-word"><strong>INTEGER:</strong><br>
Examples:<br>
<em>INT<br>INTEGER<br> TINYINT<br> SMALLINT<br> MEDIUMINT<br> BIGINT<br> UNSIGNED BIG INT<br> INT2<br> INT3</em><br></p>
<p class="text-word"><br><strong>TEXT:</strong><br>
Examples:<br>
<em>CHARACTER(20)<br> VARCHAR(255)<br> VARYING CHARACTER(255)<br> NCHAR(55)<br> NATIVE CHARACTER(70)<br> NVARCHAR(100)<br> TEXT<br> CLOB</em><br>
</p>
<p class="blob-word"><strong>BLOB:</strong><br>
Examples:<br>
<em>BLOB</em></p>
<br>
<p class="real-word"><strong>REAL:</strong><br>
Examples:<br>
<em>DOUBLE<br> DOUBLE PRECISION<br> FLOAT</em>
</p>
<br>
<p class="numeric-word"><strong>NUMERIC:</strong><br>
Examples:<br>
<em>DECIMAL(10, 5)<br> BOOLEAN<br> DATE<br> DATETIME</em><br>
</p>
<br>
<hr>
<br>
      <h3>Filtering Data:</h3>
      <br>
      <p class="where-word"><strong>WHERE:</strong> Conditionally filter rows.<br>
      <em>SELECT * FROM table_name WHERE condition;</em></p>
      <br>
      <p class="and/or-word"><strong>AND/OR:</strong> Combine multiple conditions.<br>
      <em>SELECT * FROM table_name WHERE condition1 AND/OR condition2;</em></p>
      <br>
      <p class="like-word"><strong>LIKE:</strong> Pattern matching with wildcard characters.<br>
      <em>SELECT * FROM table_name WHERE column_name LIKE 'pattern';</em></p>
      <br>
      <hr>
      <br>
      <h3>Sorting Data:</h3>
      <br>
      <p class="order-by-word"><strong>ORDER BY:</strong> Sort query results.<br>
      <em>SELECT * FROM table_name ORDER BY column_name ASC/DESC;</em></p>
      <br>
      <hr>
      <br>
      <h3>Aggregation Functions:</h3>
      <br>
      <p class="count-word"><strong>COUNT:</strong> Count number of rows.<br>
      <em>SELECT COUNT(column_name) FROM table_name;</em></p>
      <br>
      <p class="sum-word"><strong>SUM:</strong> Calculate sum of values.<br>
      <em>SELECT SUM(column_name) FROM table_name;</em></p>
      <br>
      <p class="avg-word"><strong>AVG:</strong> Compute average value.</em><br>
      <em>SELECT AVG(column_name) FROM table_name;</em></p>
      <br>
      <strong>MAX/MIN:</strong> Retrieve maximum/minimum value.<br>
      <p class="max-word"><em>SELECT MAX(column_name) FROM table_name;</em><br></p>
      <p class="min-word">
      <em>SELECT MIN(column_name) FROM table_name;</em></p>
      <br>
      <hr>
      <br>
      <h3>Joining Tables:</h3>
      <br>
      <p class="inner-join-word"><strong>INNER JOIN:</strong> Combine rows from different tables.<br>
      <em>SELECT * FROM table1 INNER JOIN table2 ON table1.column_name = table2.column_name;</em></p>
      <br>
      <p class="left-join-word"><strong>LEFT JOIN:</strong> Retrieve all records from the left table and matching records from the right table.<br>
      <em>SELECT * FROM table1 LEFT JOIN table2 ON table1.column_name = table2.column_name;</em></p>
      <br>
      <p class="right-join-word"><strong>RIGHT JOIN:</strong> Retrieve all records from the right table and matching records from the left table.<br>
      <em>SELECT * FROM table1 RIGHT JOIN table2 ON table1.column_name = table2.column_name;</em></p>
      <br>
      <hr>
      <br>
      <h3>Grouping Data:</h3>
      <br>
      <p class="group-by-word"><strong>GROUP BY:</strong> Group rows that have the same values.<br>
      <em>SELECT column1, COUNT(column2) FROM table_name GROUP BY column1;</em></p>
      <br>
      <p class="having-word"><strong>HAVING:</strong> Filter groups based on conditions.<br>
      <em>SELECT column1, COUNT(column2) FROM table_name GROUP BY column1 HAVING COUNT(column2) > value;</em></p>
      <br>
      <br>
  </div>`;

const existingDiv = document.getElementById('cheatsheet');
existingDiv.innerHTML = cheatsheetContent;
});
const existingDiv = document.getElementById('cheatsheet');
existingDiv.innerHTML = cheatsheetContent;

const existingSearchDiv = document.getElementById('searchResults');
existingSearchDiv.innerHTML = cheatsheetContent;

function searchCheatsheet() {
  const searchInput = document.getElementById('search-input');
  const searchResults = document.getElementById('searchResults');

  const searchTerm = searchInput.value.toLowerCase();
  const contentLowerCase = cheatsheetContent.toLowerCase();
  const filteredContent = contentLowerCase.includes(searchTerm);

  if (filteredContent) {
    const highlightedContent = contentLowerCase.replace(
      new RegExp(searchTerm, 'gi'),
      match => `<span class="highlight">${match}</span>`
    );
    searchResults.innerHTML = highlightedContent;
  } else {
    searchResults.innerHTML = '<p>No matching results found.</p>';
  }
}

// Attach the function to the input field's "input" event
document.getElementById('search-input').addEventListener('input', searchCheatsheet);
