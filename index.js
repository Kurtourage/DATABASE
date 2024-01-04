const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const session = require('express-session');
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcrypt');
const app = express();
const port = 5173;




// Create a MySQL connection
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '00000',
  database: 'database_detective',
});

// Connect to the database
connection.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
    return;
  }
  console.log('Connected to MySQL database');
});

// Middleware for session management
app.use(
  session({
    secret: 'your_secret_key',
    resave: true,
    saveUninitialized: true,
  })
);

// Middleware for parsing POST request bodies
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve HTML files from the 'public' directory
app.use(express.static('public'));





// Define a route for checking login status
app.get('/check-login', (req, res) => {
  const loggedIn = !!req.session.user;
  userId = req.session.user.user_id;
  res.json({ loggedIn });
});

// Inside your login route handler
app.post('/login', (req, res) => {
  const { username, password } = req.body;

  // Fetch the hashed password from the database based on the provided username
  connection.query('SELECT * FROM users WHERE username = ?', [username], (err, results) => {
    if (err) {
      console.error('Error executing MySQL query:', err);
      res.status(500).send('Internal Server Error');
      return;
    }

    if (results.length === 0) {
      // User not found
      res.send('Invalid username or password');
      return;
    }

    const user_id = results.user_id;
    const user_saved_level = results.user_saved_level;
    const email = results.email;
    const dbcoins = results.dbcoins;
    const user_pic = results.user_pic;
    
    
    const hashedPasswordFromDB = results[0].password;

    // Compare the provided password with the hashed password from the database
    bcrypt.compare(password, hashedPasswordFromDB, (compareErr, passwordMatch) => {
      if (compareErr) {
        console.error('Error comparing passwords:', compareErr);
        res.status(500).send('Internal Server Error');
        return;
      }

      if (passwordMatch) {
        // Passwords match, login successful
        req.session.user = results[0]; // Store user information in the session
        res.redirect('/menu.html');
      } else {
        // Passwords do not match
        res.send('Invalid username or password');
      }
    });
  });
});




// Define a route for handling signup requests
app.post('/signup', (req, res) => {
  const { username, email, password } = req.body;

  connection.query(
    'SELECT * FROM users WHERE username = ? OR email = ?',
    [username, email],
    (err, results) => {
      if (err) {
        console.error('Error executing MySQL query:', err);
        res.status(500).send('Internal Server Error: ' + err.message);
        return;
      }

      if (results.length > 0) {
        // username or email is already used.
        res.send('Username or email is already in use.');
        return;
      }

      // Hash the password using bcrypt
      bcrypt.hash(password, 10, (hashErr, hashedPassword) => {
        if (hashErr) {
          console.error('Error hashing password:', hashErr);
          res.status(500).send('Internal Server Error');
          return;
        }

        
        
        //inserting data to database
        connection.query(
          'INSERT INTO users (username, email, password, user_pic, user_saved_level, dbcoins) VALUES (?, ?, ?, 0, 1, 0)',
          [username, email, hashedPassword],
          (insertErr, results) => {
            if (insertErr) {
              console.error('Error executing MySQL query:', insertErr);
              res.status(500).send('Internal Server Error');
              return;
            }

            // User successfully registered, store user information in session
            req.session.user = { username, email, password, user_pic, user_saved_level, dbcoins };
            res.redirect('/CH1.html');
          }
        );


          //selecting data from the database for session information
        connection.query(
          'SELECT * from users WHERE username = ? AND password = ?', [username, hashedPassword],
          (insertErr, results) => {
            if (insertErr) {
              console.error('Error executing MySQL query:', insertErr);
              res.status(500).send('Internal Server Error');
              return;
            }

            // User successfully registered, store user information in session
            req.session.user = { username, email, password, user_pic, user_saved_level, dbcoins };
            res.redirect('/CH1.html');
          }
        );
        
      });
    });
});




let gameDbInitialized = false;


  // SQLite database for the game
  const gameDb = new sqlite3.Database(':memory:');



app.post('/initialize-game-db', (req, res) => {
  // Create your game database tables and initial data

  if (gameDbInitialized) {
    return res.json({ message: 'Game database already initialized' });
  }


  // Set the flag to true to prevent further initialization
  gameDbInitialized = true;


  

  const createProfilesTableSQL = `
    CREATE TABLE IF NOT EXISTS profiles (
      id INTEGER PRIMARY KEY,
      name TEXT,
      age INTEGER,
      gender TEXT,
      address TEXT,
      work TEXT,
      status INT,
      marital_status INT
    );
  `;

  const insertProfilesDataSQL = `
    INSERT INTO profiles (name, age, gender, address, work, status, marital_status) 
    VALUES 
      ('Marcus Whitewood', 65, 1, 'Midway Grove, Calabasas City', 'Oil Tycoon', '0', '1' ),
      ('Evelyn Whitewood', 57, 0,'Midway Grove, Calabasas City', 'Accountant (retired)', '1', '0' ),
      ('Adrian Whitewood', 33, 1,'Midway Grove, Calabasas City', 'Accountant', '1', '0' ),
      ('Gregory Whitewood', 29, 1, 'Midway Grove, Calabasas City', 'Secretary', '1', '0' ),
      ('Alexander Whitewood', 25, 1, 'Midway Grove, Calabasas City', 'Oil Tycoon', '1', '0' ),
      ('Lucas Whitewood', 21, 1,'Midway Grove, Calabasas City', 'n/a', '1', '0' ),
      ('Sophia Whitewood', 31, 0, 'Midway Grove, Calabasas City', 'Captain (US ARMY)', '1', '0' ),
      ('Isabella Whitewood', 17, 0, 'Midway Grove, Calabasas City', 'n/a', '1', '0' ),
      ('Charlotte Whitewood', 15, 0, 'Midway Grove, Calabasas City', 'n/a', '1', '0' ),
      ('Edmund Thatcher', 87, 1, 'Midway Grove, Calabasas City', 'Head Butler', '0', '0' ),
      ('James Sullivan', 45, 1, 'Midway Grove, Calabasas City', 'Senior Butler', '1', '0' ),
      ('Thomas Bennett', 37, 1, 'Midway Grove, Calabasas City', 'Butler', '1', '0' ),
      ('Robert Foster', 25, 1, 'Midway Grove, Calabasas City', 'Butler', '1', '0' ),
      ('Emily Thompson', 75, 0, 'Midway Grove, Calabasas City', 'Head Maid', '0', '1' ),
      ('Sarah Johnson', 50, 0, 'Midway Grove, Calabasas City', 'Senior Maid', '1', '0' ),
      ('Amelia Carter', 31, 0, 'Midway Grove, Calabasas City', 'Maid', '1', '0' ),
      ('Olivia Parker', 25, 0, 'Midway Grove, Calabasas City', 'Maid', '1', '0' ),
      ('Grace Harrison', 32, 10, 'Midway Grove, Calabasas City', 'Maid', '1', '0' ),
      ('Lily Evans', 32, 0, 'Midway Grove, Calabasas City', 'Maid', '1', '0' ),
      ('Abigail Turner', 25, 0, 'Midway Grove, Calabasas City', 'Maid', '1', '0' ),
      ('Chloe Williams', 25, 0, 'Midway Grove, Calabasas City', 'Maid', '1', '0' ),
      ('Sophia Brown', 32, 0, 'Midway Grove, Calabasas City', 'Maid', '1', '0' ),
      ('Isabelle Clark', 25, 0, 'Midway Grove, Calabasas City', 'Maid', '1', '0' ),
      ('Lawrence Banks', 68, 1, 'Elite District High Society City', 'Businessman', '1', '1' ),
      ('Eleanor Banks', 65, 0, ' Elite District High Society City', 'Businesswoman', '1', '1' ),
      ('Emily de Montague', 52, 0, 'Political Capital', 'Diplomat', '1', '0' ),
      ('Nicholas Hawthorne', 52, 1, 'Plaza Success City', 'Count / Entrepreneur', '1', '0' ),
      ('Beatrice Cavendish', 62, 0, 'Respected Ville', 'Baronness / Philantropist', '1', '0' ),
      ('Theodore Foxworth', 56, 1, 'Refined Town', 'Real Estate Developer', '1', '1' ),
      ('Arabella Foxworth', 50, 0, 'Refined Town', 'Real Estate Developer', '1', '1' ),
      ('Penelope Grant', 29, 0, 'Musical Haven', 'Musician', '1', '0' ),
      ('Sebastian Everhart', 58, 1, 'Eccentric Estates, Artistic Haven', 'Construction', '1', '1' ),
      ('Matilda Everhart', 52, 0, ' Eccentric Estates, Artistic Haven', 'Construction', '1', '1' ),
      ('Edward Somerset', 58, 1, 'Noble Square, Admirable City', 'Air Force Brigadier General', '1', '1' ),
      ('Elizabeth Somerset', 52, 0, 'Noble Square, Admirable City', 'Navy Rear Admiral', '1', '1' ),
      ('Winston Davenport', 57, 1, ' Political Plaza, Discourse City', 'Diplomat', '1', '0' ),
      ('Oliver Sinclair', 60, 1, ' Fabric Heights, Suave City,', 'Textile', '1', '0' ),
      ('Penelope Montague', 52, 0, ' Cultural Corner, Diverse District', 'N/A', '1', '0' ),
      ('Celeste Montogomery', 32, 0, ' Insightful Enclave, Intellectual City', 'Literary Writer', '1', '0' ),
      ('Cordelia Lancaster', 29, 0, ' Bold Borough, Creative City', 'Artist', '1', '0' ),
      ('Felicity Grant', 22, 0, 'Harmony Haven, Diverse District', 'Musician', '1', '0' ),
      ('Julius Fairfax', 57, 1, 'Noble Cause Court, Inspiring City', 'Philantropist', '1', '0' ),
      ('Genevieve Preston', 16, 0,  'Youthful Yard, Excitement Ville', 'N/A', '1', '0' ),
      ('Evangeline Cartwright', 32, 0, 'Ancient Avenue, Curiosity City', 'Archeologist', '1', '0' ),
      ('Octavia Beaumont', 46, 0, 'Mysterious Manor, Captivating Corner', 'N/A', '1', '2' );`;


      const createEvidenceTableSQL = `
      CREATE TABLE IF NOT exists evidence (
        id INTEGER PRIMARY KEY,
        name TEXT,
        location_found TEXT);
        `
        ;

       const insertEvidenceTableSQL  = `INSERT INTO evidence (name, location_found)
       VALUES
       ('Poisoned Chalice', 'Analysis of the drink served to Marcus Whitewood reveals traces of a rare and potent poison. The spectral raven subtly directs attention to the chalice, indicating foul play in his demise'),
       ('Merlot', 'The wine that was poisoned'),
       ('Missing Object', ''),
       ('Broken Necklace', 'Evelyn Whitewood''s necklace, a family heirloom, is discovered shattered. The raven hints at the necklace''s importance, signaling a struggle or a significant altercation before the tragic events.'),
       ('Shattered Vial', 'Discovered near the greenhouse, hidden amidst a bed of vibrant flowers near the Whitewood family statue.'),
       ('Torn Fabric', 'Caught on the ornate gates at the estate''s entrance, hinting at a hurried departure into the night.'),
       ('Cryptic Note', 'Concealed within the ancient grandfather clock in the study, nestled behind its pendulum.'),
       ('Missing Object', 'Absent from the trophy room, where an intricate crystal sculpture once stood as the centerpiece. '),
       ('Midnight Blossom', 'a vibrant poisonous flower seen at the Sanctum, looks red when withered.'),
       ('Stardust Lily', 'a poisonous flower seen in the Greenhouse'),
       ('Bright Bloom', ' A vibrant red flower, di alam saan nakalagay hahaha'),  
       ('Fragmented Jewelry', 'Scattered amidst the opulent tapestries in the banquet hall, glinting under the soft glow of chandeliers.'),
       ('Unfamiliar Key', 'Hidden within an intricate mosaic on the mosaic near the garden''s fountain, its presence overlooked.'),
       ('Broken Ornament', 'Found tangled within the overgrown thicket near the conservatory, shards peeking through the tangled vines.'),
       ('Mysterious Book', ' Discovered beneath a pile of forgotten scripts on a bookstand in the music room.'),
       ('Tainted Cloth', 'Hidden amidst the curtains in the master bedroom, a piece of fabric stained with an unidentifiable substance.'),
       ('Dented Cane', 'Abandoned near the gardener''s shed, nestled among the tools and pots, unnoticed in the bustling garden.'),
       ('Hidden Passageway', 'A previously unknown hidden passageway within the estate, revealed by the spectral raven''s subtle gestures, suggests an escape route or clandestine movements possibly utilized by the perpetrator.')
      
      ;` //no location on line 233
       ; 


       const createMansionLocationSQL = `
       CREATE TABLE IF NOT EXISTS mansion_locations (
        id INTEGER PRIMARY KEY,
        name TEXT,
        description TEXT);`;

       const insertMansionLocationSQL = `
       INSERT INTO mansion_locations(name, description)
       VALUES
       ('Grand Hall', 'The main entrance and reception area'),
       ('Ballroom', 'Where the masquerade ball was held'),
       ('Dining Room', 'Area for formal dining and meals'),
       ('Drawing Room', 'A formal living room for guests'),
       ('Library', 'A collection of books and study area'),
       ('Study', 'A private room for reading and work'),
       ('Guest Rooms', 'Bedrooms for visiting guests'),
       ('Family Quarters', 'Bedrooms and private spaces for the Whitewood family'),
       ('Kitchen', 'Area for meal preparation and cooking'),
       ('Servant Quarters', 'Living areas for staff'),
       ('Cellar', 'Storage area for wines and supplies'),
       ('Greenhouse', 'Housing rare plants and botanical treasures'),
       ('The Mansion Sanctum', 'Tucked away in a discreet wing of the mansion'),
       ('Conservatory', 'A space for relaxation with indoor plants'),
       ('Art Gallery', 'Displaying prized artworks'),
       ('Gardens', 'Expansive manicured gardens and lawns'),
       ('Gazebo', 'A small structure for relaxation or small gatherings'),
       ('Orchard', 'Fruit trees and cultivated plants'),
       ('Stables', 'For housing horses or carriages'),
       ('Fountains', 'Decorative water features'),
       ('Maze', 'Landscaped designs for aesthetic purposes'),
       ('Woods', 'A natural area with trees and foliage'),
       ('Statues', 'Art pieces placed in the garden'),
       ('Walking Paths', 'Paved pathways throughout the gardens'),
       ('Courtyard', 'Open space enclosed by the mansion walls');
       `;

       const createTestimonyTableSQL = `
       CREATE TABLE IF NOT EXISTS testimony (
        id INTEGER PRIMARY KEY,
        profile_ID INTEGER,
        testimony TEXT);
       `;

       const insertTestimonyDataSQL = `
       INSERT INTO testimony(profile_id, testimony)
       VALUES
       (2, 'I oversaw the arrangements and chatted with Lady Beatrice Cavendish most of the evening.'),
       (3, 'I spent time with the Foxworths discussing the latest textile trends in the ballroom.' ),
       (4, 'I was in the library, engrossed in a conversation about art with Baroness Matilda Everhart.'),
       (5, 'I mostly circulated, but later, I was in the conservatory, admiring the floral arrangements.'),
       (6, 'I was with Lady Penelope Grant, discussing music and politics in the drawing-room.'),
       (7, 'I danced and mingled, but I found solace in the garden admiring the beauty of the moon.'),
       (8, 'I assisted Lady Emily de Montague in the study, discussing diplomatic affairs.'),
       (9, 'I spent most of the evening in the ballroom, enjoying conversations about literature.'),
       (11,'I was overseeing the food preparations in the kitchen for a part of the evening.' ),
       (12, 'I mainly assisted guests in the foyer and checked on the garden decorations.'),
       (13, 'I helped organize the ballroom and later attended to the guests in the main hall.'),
       (14, 'I coordinated the duties of the maids and helped Mr. Edmund with various tasks around the mansion.'),
       (15, 'I was assisting guests in the dining area and tending to specific requests.'),
       (16, 'I focused on maintaining the family quarters and attending to needs of the guests there.'),
       (17, 'I primarily worked in the ballroom, ensuring cleanliness and guest comfort.'),
       (18, 'I was responsible for the upkeep of the ballroom and floral arrangements throughout the evening.'),
       (19, 'I was occupied with garden maintenance and floral arrangements in the estate.'),
       (20, 'I was overseeing mansion décor and ensuring the ambiance was perfect.'),
       (21, 'I primarily organized the interiors of the estate  and ensured everything was tidy.'),
       (22, 'I focused on the cleanliness of the kitchen and assisted with meal preparations.'),
       (23, 'I was meticulous with guest room cleanliness and amenities throughout the evening.'),
       (24, 'I was engaged in discussions with Marcus Whitewood about our business partnership.'),
       (25, 'I spent the evening mingling with other guests and discussing charitable ventures.'),
       (26, 'I was discussing diplomatic affairs with Lady Penelope Grant near the conservatory.'),
       (27, 'I conversed with Marcus Whitewood about potential investments before abruptly leaving.'),
       (28, 'I engaged in conversations about philanthropy and art with various guests.'),
       (29, 'I was in discussions with Marcus Whitewood about textile ventures before I went inside.'),
       (30, 'I enjoyed conversations with other guests and observed the event proceedings.'),
       (31, 'I entertained guests with music and discussed politics and music in various rooms.'),
       (32, 'We were admiring the avant-garde artworks in the gallery of the mansion, discussing their artistic significance.'),
       (33, 'We were admiring the avant-garde artworks in the gallery of the mansion, discussing their artistic significance.'),
       (34, 'We were discussing military charities and philanthropic initiatives in the attic.'),
       (35, 'We were discussing military charities and philanthropic initiatives in the attic.'),
       (36, 'We were in a heated discussion about political developments and their implications in the drawing-room.' ),
       (37, 'We were networking and discussing textile industry trends with other guests in the dining area.'),
       (38, 'I was regaling guests with tales from my travels, captivating those around me in the salon.'),
       (39, 'I engaged in discussions about literature and shared insights into my latest works with fellow guests.'),
       (40, 'I was explaining the inspiration behind my art in the gallery, prompting debates and admiration.'),
       (41, 'I entertained guests with musical performances and interacted with various attendees in the ballroom.'),
       (42, 'We were advocating for philanthropy and discussing community initiatives in the foyer.'),
       (43, 'I was enthusiastic, engaging with attendees, and enjoying the novelty of my first social event.'),
       (44, 'I indulged in scholarly conversations about ancient history and its relevance with interested guests.'),
       (45, 'I was sharing tales from my travels, weaving a web of mystery and intrigue in the drawing-room.')
       
       ;`
       ;


        const createGenderTableSQL = `
        CREATE TABLE IF NOT EXISTS gender 
        (id INTEGER PRIMARY KEY,
        name TEXT);
        `
        ;

        const insertGenderDataSQL = `
        INSERT INTO gender (id, name)
        VALUES 
        (0, 'female'),
        (1, 'male');`;

        const createStatusTableSQL = `
        CREATE TABLE IF NOT EXISTS status
        (id INTEGER PRIMARY KEY,
        name TEXT);`
        ;

        const insertStatusDataSQL = `
        INSERT INTO status (id, name)
        VALUES
        (0, 'Deceased'),
        (1, 'Alive');`
        ;

        const createMaritalStatusTableSQL = `
        CREATE TABLE IF NOT EXISTS marital_status
        (id INTEGER PRIMARY KEY,
        name TEXT);`
        ;

        const insertMaritalStatusDataSQL = `
        INSERT INTO marital_status (id, name)
        VALUES
      
        (0, 'Single'),
        (1, 'Married'),
        (2, 'Widowed');`
        ;
          
        const createFavoriteObjectsTableSQL = `
        CREATE TABLE IF NOT EXISTS favorite_objects
        (id INTEGER PRIMARY KEY,
        name TEXT, object_type TEXT);`
        ;

        const insertFavoriteObjectsTableSQ = `
        INSERT INTO favorite_objects(name, object_type)
        VALUES
        ('Merlot', 'Wine'),
        ('Cherry Blossom', 'flower'),
        ('Monogrammed pocket watch', 'timepiece'),
        ('Classic fountain pen', 'writing instrument'),
        ('DSLR camera', 'photography equipment'),
        ('Vinyl records', 'music collection'),
        ('Handwoven silk scarf', 'accessory'),
        ('Heirloom earrings', 'jewelry'),
        ('Antique book collection', 'literature'),
        ('Silver snuff box', 'accessory'),
        ('Engraved cufflinks', 'accessory'),
        ('Polished silver serving tray', 'dining ware'),
        ('Leather-bound notebook', 'stationery'),
        ('Hand-painted porcelain teapot', 'kitchenware'),
        ('Family recipe book', 'literature'),
        ('Antique hairpin', 'accessory'),
        ('Crystal vase', 'home decor'),
        ('Gold brooch', 'accessory'),
        ('Botanical prints', 'art collection'),
        ('Intricately designed tapestry', 'decor'),
        ('Embroidered handkerchief', 'accessory'),
        ('Hand-carved wooden spoon', 'kitchenware'),
        ('Antique music box', 'music accessory'),
        ('Vintage pocket watch', 'timepiece'),
        ('Collection of antique fans', 'collectibles'),
        ('Faberge egg', 'decorative art'),
        ('Limited edition fountain pen', 'writing instrument'),
        ('Porcelain figurine', 'decorative art'),
        ('Antique compass', 'navigational tool'),
        ('Silk scarf from a foreign land', 'accessory'),
        ('Grand piano', 'musical instrument'),
        ('Sculpture from a renowned artist', 'art'),
        ('Rare paintings', ' art collection'),
        ('Antique saber', 'weapon'),
        ('Antique lace handkerchief', 'accessory'),
        ('Vintage typewriter', 'writing instrument'),
        ('Ornate tapestry', 'decor'),
        ('Antique globe', 'decor'),
        ('Leather-bound journal filled with poetry', 'stationery'),
        ('Paint Brush set', 'art supplies'),
        ('Vintage sheet music collection', 'music'),
        ('Silver-plated charity award', 'recognition'),
        ('Antique locket', 'jewelry'),
        ('Ancient artifact replicas', 'collectibles'),
        ('Antique travel trunk', 'luggage');
        `;


 // Run SQL queries
gameDb.serialize(() => {
  gameDb.exec(`
    ${createProfilesTableSQL}
    ${insertProfilesDataSQL}
    ${createEvidenceTableSQL}
    ${insertEvidenceTableSQL}
    ${createMansionLocationSQL}
    ${insertMansionLocationSQL}
    ${createTestimonyTableSQL}
    ${insertTestimonyDataSQL}
    ${createGenderTableSQL}
    ${insertGenderDataSQL}
    ${createStatusTableSQL}
    ${insertStatusDataSQL}
    ${createMaritalStatusTableSQL}
    ${insertMaritalStatusDataSQL}
    ${createFavoriteObjectsTableSQL}
    ${insertFavoriteObjectsTableSQ}
  `, (err) => {
    if (err) {
      console.error('Error executing SQL queries:', err);
      res.status(500).json({ error: 'Internal Server Error' });
      return;
    }

    res.json({ message: 'Game database initialized' });
  });
});


});

// Execute Game SQL Endpoint
app.post('/execute-game-sql', (req, res) => {

 
   // Check if gameDB has been initialized; if not, return an error
   if (!gameDbInitialized) {
    return res.status(500).json({ error: 'Game database not initialized' });
  }

  
  const { sql } = req.body;

  // Log the received SQL query for debugging
  console.log('Received Game SQL query:', sql);

  // Check if the SQL query is missing or empty
  if (!sql || sql.trim() === '') {
    res.status(400).json({ error: 'SQL query is missing or empty' });
    return;
  }

  // Use parameterized queries or prepared statements to prevent SQL injection
  gameDb.all(sql, (err, results) => {
    if (err) {
      console.error('Error executing Game SQL query:', err);
      res.status(500).json({ error: 'Internal Server Error' });
      return;
    }

    // Generate the HTML table on the server side
    const tableHtml = generateTableHtml(results);

    // Send the HTML table in the response
    res.json({ success: true, tableHtml });
  });
});

// Function to generate HTML table from query results
function generateTableHtml(results) {
  if (results.length === 0) {
    return '<p>No results to display.</p>';
  }

  // Create a table element
  let tableHtml = '<table border="1">';

  // Create header row
  tableHtml += '<tr>';
  for (const key in results[0]) {
    tableHtml += `<th>${key}</th>`;
  }
  tableHtml += '</tr>';

  // Create data rows
  results.forEach((row) => {
    tableHtml += '<tr>';
    for (const key in row) {
      tableHtml += `<td>${row[key]}</td>`;
    }
    tableHtml += '</tr>';
  });

  // Close the table element
  tableHtml += '</table>';

  return tableHtml;
}




// Level data
const levels = [
  {
    id: 1,
    mission: [ 'SELECT * from profiles', 'Insert into profiles(name) Values(','Delete from profiles where id = 46' ],
    objective:['SELECT all persons involved from the profile table', 'INSERT your name in the profiles table', 'DELETE your information in the table using id ']
     },

  {
    id: 2,    
    mission: ['SELECT * from evidence', 'update evidence set name = '],
    objective:['SELECT all objects from clues table' , 'UPDATE  the two missing objects in clues table, the clues are in the newspaper tab']
  },
  {


  }

];


let currentLevel = null;

let userId; 

// Endpoint to start a level
app.post('/start-level', (req, res) => {
  // Get the level ID from the request
  const levelId = req.body.levelId;

  // Find the corresponding level
  const level = levels.find((l) => l.id === levelId);

  if (!level) {
    return res.status(400).json({ error: 'Invalid level ID' });
  }

  // Set the current level
  currentLevel = level;
  console.log(level);

 


  // Send the level mission to the client
  res.json({ success: true, mission: level.mission, objective: level.objective });
  


});





// Endpoint to start the next level
app.post('/start-next-level', (req, res) => {
  // Check if there is a current level
  if (!currentLevel) {
    return res.status(400).json({ error: 'No active level' });
  }

  // Find the index of the current level in the levels array
  const currentIndex = levels.findIndex((l) => l.id === currentLevel.id);

  // Check if the current level is the last level
  if (currentIndex === levels.length - 1) {
    return res.json({ success: false, message: 'No more levels available' });
  }

  // Get the next level
  const nextLevel = levels[currentIndex + 1];

   // Get the user ID from the session
   const userId = req.session.user.user_id;

   // Update the user_saved_level in the database
   connection.query(
     'UPDATE users SET user_saved_level = ? WHERE user_id = ?',
     [nextLevel.id, userId],
     (err, results) => {
       if (err) {
         console.error('Error updating user_saved_level:', err);
         res.status(500).json({ error: 'Internal Server Error' });
         return;
       }
      }
   )
  
  // Set the current level to the next level
  currentLevel = nextLevel;
  console.log('Next Level:', nextLevel);
  

  if (nextLevel && nextLevel.id !== undefined) {
    // Send the next level mission and URL to the client
    res.json({ success: true, mission: nextLevel.mission, redirectUrl: `/CH${nextLevel.id}.html`, nextlevelNumber: nextLevel.id });
  } else {
    res.status(500).json({ error: 'Invalid level data' });
  }
});



app.get('/get-user-level', (req, res) => {
  console.log(req.session.user)
  console.log('Received check-user-level request');
   user_level = req.session.user.user_saved_level;
  console.log('User Level: ', user_level);
  res.json({level: user_level})
  

});


const completedMissionsIndices = [];
// Function to check if the user's input array satisfies the level mission requirements
function checkMissionCompletion(userInputs, mission) {
  

   // Check each mission requirement
   for (let i = 0; i < mission.length; i++) {
    const requirement = mission[i];

    // Convert both the input and requirement to lowercase for a case-insensitive comparison
    const lowerRequirement = requirement.toLowerCase();

    // Check if the requirement is present in any user input (case-insensitive)
    if (userInputs.some((input) => input.toLowerCase().includes(lowerRequirement))) {
      // Mission requirement is satisfied
      // Check if the index is not already present in completedMissionsIndices
      if (!completedMissionsIndices.includes(i)) {
        completedMissionsIndices.push(i);
      }
    }
  }

  // Check if any mission requirements are satisfied
  if (completedMissionsIndices.length === mission.length) {
    // all level missions are completed
    return true;
  }
  
  else {
    
    return false;
  }
}


const userInputs = [];

// Endpoint to check the user's answer for the current level
app.post('/check-level-answer', (req, res) => {
  // Check if there is a current level
  if (!currentLevel) {
    return res.status(400).json({ error: 'No active level' });
  }

  // Get the user's answer from the request
  const userAnswer = req.body.userInput;
    // Store the user input in the array
    userInputs.push(userAnswer);

  // Check if the user's answer satisfies the level mission criteria
  const isMissionCompleted = checkMissionCompletion(
    userInputs,
    currentLevel.mission,
    
  );
  console.log("User Inputs: ", userInputs);
  console.log("Level Completed: ",isMissionCompleted);
  console.log("Missions Completed: ", completedMissionsIndices);

  // If the mission is completed, start the next level
  if (isMissionCompleted) {
    
    res.json({ success: true, nextLevelStarted: true });
  } else {
    // If the mission is not completed, respond with the result
    res.json({ success: false });
  }
});

app.get('/update-hud', (req, res) => {
  // Check if there is a current level
  if (!currentLevel) {
    return res.status(400).json({ error: 'No active level' });
  }

  res.json(completedMissionsIndices);
});





// Define a route for logging out
app.get('/logout', (req, res) => {
  // Destroy the session
  req.session.destroy((err) => {
    if (err) {
      console.error('Error destroying session:', err);
      res.status(500).send('Internal Server Error');
      return;
    }

    // Redirect to the login page after logout
    res.redirect('/login.html');
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
