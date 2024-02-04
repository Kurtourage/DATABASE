const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const session = require('express-session');
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcrypt');
const { connect } = require('http2');
const app = express();
const port = 5173;



let gameDbInitialized = false;
let classicDbInitialized = false;


  // SQLite database for the game
const gameDb = new sqlite3.Database(':memory:');
const classicDb = new sqlite3.Database(':memory:');
let completedMissionsIndices = [];
let userInputs = [];
let username;
let userId; 
let dbcoins;
let userDbCoins;
let currentLevel = null;

let user_pic;

let sqlQuery;
let problemStatement;
let counter = 0;



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
       res.json({type: 'user', error:'user not found.'});
      return;
    }

  
    
    
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

        if (req.session.user.user_type == 'admin') {
          res.json({type: 'admin', success: true});
        }

        if (req.session.user.user_type != 'admin') {
          res.json({type: 'user', success: true});
        } 
       
      } else {
        // Passwords do not match
        res.json({type: 'password', error:'Incorrect Password'});
      }
    });
  });
});



// Define a route for handling signup requests
app.post('/signup', (req, res) => {
  const { username, email, password } = req.body;
  console.log(username, email, password);


  // Get the current date and time in JavaScript
  const currentDate = new Date();

  // Format the date as 'YYYY-MM-DD'
  const formattedDate = currentDate.toISOString().split('T')[0];

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
      
        res.json({success: false, reason: "username or email already in use."})
        return;
      }

      // Hash the password using bcrypt
      bcrypt.hash(password, 10, (hashErr, hashedPassword) => {
        if (hashErr) {
          console.error('Error hashing password:', hashErr);
          res.status(500).send('Internal Server Error');
          return;
        }

        // Inserting data to the database
        connection.query(
          "INSERT INTO users (username, email, password, user_pic, user_saved_level, dbcoins, creation_date, user_type) VALUES (?, ?, ?, 17, 1, 0, ?, 'user')",
          [username, email, hashedPassword, formattedDate],
          (insertErr, results) => {
            if (insertErr) {
              console.error('Error executing MySQL query:', insertErr);
              res.status(500).send('Internal Server Error');
              res.json({success: false});
              return;
            }

            // Selecting data from the database for session information
            connection.query(
              'SELECT * FROM users WHERE username = ? AND password = ?',
              [username, hashedPassword],
              (selectErr, results) => {
                if (selectErr) {
                  console.error('Error executing MySQL query:', selectErr);
                  res.status(500).send('Internal Server Error');
                  return;
                }

                // User successfully registered, store user information in session
                req.session.user = results[0];
                res.json({success: true}); 
                console.log("User account created successfully.")
              }
            );
          }
        );
      });
    });
});






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
      gender INTEGER,
      address TEXT,
      work TEXT,
      status INTEGER,
      marital_status INTEGER
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
      ('Emily Thompson', 75, 0, 'Midway Grove, Calabasas City', 'Head Maid', '1', '1' ),
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
       ('Broken Necklace', 'Evelyn Whitewood''s necklace, a family heirloom, is discovered shattered. The raven hints at the necklace''s importance, signaling a struggle or a significant altercation before the tragic events.'),
       ('Shattered Vial', 'Discovered near the greenhouse, hidden amidst a bed of vibrant flowers near the Whitewood family statue.'),
       ('Torn Fabric', 'Caught on the ornate gates at the estate''s entrance, hinting at a hurried departure into the night.'),
       ('Cryptic Note', 'Concealed within the ancient grandfather clock in the study, nestled behind its pendulum.'),
       ('Midnight Blossom', 'a vibrant poisonous flower seen at the Sanctum, looks red when withered.'),
       ('Stardust Lily', 'a poisonous flower seen in the Greenhouse'),
       ('Bright Bloom', 'a vibrant red flower, di alam saan nakalagay hahaha'),  
       ('Fragmented Jewelry', 'Scattered amidst the opulent tapestries in the banquet hall, glinting under the soft glow of chandeliers.'),
       ('Unfamiliar Key', 'Hidden within an intricate mosaic on the mosaic near the garden''s fountain, its presence overlooked.'),
       ('Broken Ornament', 'Found tangled within the overgrown thicket near the conservatory, shards peeking through the tangled vines.'),
       ('Mysterious Book', ' Discovered beneath a pile of forgotten scripts on a bookstand in the music room.'),
       ('Tainted Cloth', 'Hidden amidst the curtains in the master bedroom, a piece of fabric stained with an unidentifiable substance.'),
       ('Dented Cane', 'Abandoned near the gardener''s shed, nestled among the tools and pots, unnoticed in the bustling garden.'),
       ('Hidden Passageway', 'A previously unknown hidden passageway within the estate, revealed by the spectral raven''s subtle gestures, suggests an escape route or clandestine movements possibly utilized by the perpetrator.')
      
      ;` 
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
       (2, 'I oversaw the arrangements and chatted with Lady Beatrice Cavendish most of the evening and went to the garden.'),
       (3, 'I spent time with the Foxworths discussing the latest textile trends in the ballroom and went to the garden.' ),
       (4, 'I was in the library, engrossed in a conversation about art with Baroness Matilda Everhart, and went to the garden.'),
       (5, 'I mostly circulated, but later, I was in the conservatory, admiring the floral arrangements, and went to the garden.'),
       (6, 'I was with Lady Penelope Grant, discussing music and politics in the garden.'),
       (7, 'I danced and mingled, but I found solace in the garden admiring the moon''s beauty.'),
       (8, 'I assisted Lady Emily de Montague in the study, discussing diplomatic affairs, and went to the garden.'),
       (9, 'I spent most of the evening in the garden, enjoying conversations about literature.'),
       (11, 'I was overseeing the food preparations in the kitchen for a part of the evening, but Mr. Edmund called me to the garden.' ),
       (12, 'I mainly assisted guests in the foyer and checked on the garden decorations.'),
       (13, 'I coordinated the maids'' duties and helped Mr. Edmund with various tasks around the mansion, and later went to the garden.'),
       (14, 'I was assisting guests in the garden and tending to specific requests.'),
       (15, 'I was assisting guests in the dining area and tending to specific requests.'),
       (16, 'I focused on maintaining the family''s quarters and attending to guests'' needs there, I also went to the garden.'),
       (17, 'I primarily worked in the ballroom, ensuring cleanliness and guest comfort, but Mr. Edmund called me to the garden.'),
       (18, 'I was responsible for the ballroom''s upkeep and floral arrangements throughout the evening. I also went to the garden.'),
       (19, 'I was occupied with garden maintenance and floral arrangements in the estate.'),
       (20, 'I was overseeing the garden''s décor and ensuring the ambiance was perfect.'),
       (21, 'I primarily organized the garden''s interiors and ensured everything was tidy.'),
       (22, 'I focused on the garden''s cleanliness and assisted with meal preparations.'),
       (23, 'I was meticulous with guest room cleanliness and amenities throughout the evening, also went to the garden.'),
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

  const { sql, mode } = req.body;



  if (mode === 'story') {
    
// Check if gameDB has been initialized; if not, return an error
  if (!gameDbInitialized) {
  return res.status(500).json({ error: 'Game database not initialized' });
}

// Use parameterized queries or prepared statements to prevent SQL injection
gameDb.all(sql, (err, results) => {
  if (err) {
    console.error('Error executing Game SQL query:', err);
    return res.status(500).json({ success: false, error: 'Internal Server Error', errorMessage: err.message });
  

  }

  // Generate the HTML table on the server side
  const tableHtml = generateTableHtml(results);

  // Send the HTML table in the response
  res.json({ success: true, tableHtml });
});
  }

  if (mode === 'classic') {
    if (!classicDbInitialized) {
      return res.status(500).json({ error: 'Game database not initialized' });
    }
  


  classicDb.all(sql, (err, results) => {
    if (err) {
      console.error('Error executing Game SQL query:', err);
      return res.status(500).json({ success: false, error: 'Internal Server Error', errorMessage: err.message });
    
  
    }

    // Generate the HTML table on the server side
    const tableHtml = generateTableHtml(results);

    // Send the HTML table in the response
    res.json({ success: true, tableHtml });
  });
  }
  


  // Log the received SQL query for debugging
  console.log('Received Game SQL query:', sql);

  // Check if the SQL query is missing or empty
  if (!sql || sql.trim() === '') {
    res.status(400).json({ error: 'SQL query is missing or empty' });
    return;
  }

  
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
    mission: [ 'SELECT * from profiles', "Insert into profiles (name) Values('{{name}}')",'Delete from profiles where id = 46' ],
    objective:['SELECT all persons involved from the profile table', 'INSERT your username in the profiles table', 'DELETE your information in the profiles table using id ']
     },

  {
    id: 2,    
    mission: ['SELECT * from evidence', "INSERT INTO evidence(name, location_found) VALUES ('Red Mask', 'Gardens')", "INSERT INTO evidence(name, location_found) VALUES ('Regal Ephemera', 'Library')"],
    objective:['SELECT all from the evidence table.' , 'INSERT the two missing objects in evidence table, the clues are in the newspaper tab.' , 'INSERT the two missing objects in evidence table, the clues are in the newspaper tab.' ]
  },
  {
    id: 3,
    mission: ['SELECT profiles.name as Name, gender.name as Gender from profiles INNER JOIN gender ON profiles.gender = gender.id WHERE gender.id = 1', 'SELECT profiles.name as Name, gender.name as Gender from profiles INNER JOIN gender ON profiles.gender = gender.id WHERE gender.id = 0', 'SELECT name, testimony FROM profiles INNER JOIN testimony ON profiles.id = testimony.profile_id'],
    objective: ['Using Inner Join, select the Name and Gender of all females from profiles.' , 'Using Inner Join, select the Name and Gender of all males from profiles' , 'Using inner join, select the name and testimony of everyone in the profiles table.']

  },

  {
    id: 4,
    mission: ["INSERT INTO mansion_locations(name), VALUES('Manor Sanctum')", 'SELECT * FROM mansion_locations', 'create table weapon_location(name TEXT)', "INSERT INTO weapon_location(name) VALUES('manor sanctum')", 'CREATE TABLE murder_weapon(name TEXT)' , "INSERT INTO murder_weapon(name) VALUES ('Midnight Blossom')", "SELECT * FROM profiles WHERE address = 'Midway Grove, Calabasas City'", "DELETE FROM profiles where address != 'Midway Grove, Calabasas City' "],
    objective: ['INSERT a new location in the mansion_locations table.', 'SELECT all locations in the mansion.', 'CREATE a table named weapon_location.', 'UPDATE your guess location where the weapon is.' ,'CREATE a table named `murder_weapon` with a `name` field.', 'INSERT the weapon used in the “murder_weapon” table.', 'SELECT all persons that lives in the Whitewood residence.' , 'DELETE all guests.' ]
 
  },

  {
    id: 5,
    mission: ["SELECT profiles.name FROM testimony INNER JOIN profiles ON testimony.id = profiles.id  INNER JOIN favorite_objects ON profiles.id = favorite_objects.id WHERE testimony LIKE '%garden%' AND object_type LIKE '%flower%'", 'CREATE TABLE suspect (name text)', "INSERT into suspect (name) Values ('Edmund Thatcher')" ],
    objective: ['SELECT all people and their favorite objects.', 'SELECT all the names where the alibis have “garden” and the type of object they like is “flowers.”',  'CREATE  a table named `suspect` with a `name` column.', 'INSERT the killer in the suspect table, SELECT the *answer* in the suspect table.']

  }


];






// Endpoint to start a level
app.post('/start-level', (req, res) => {
  // Get the level ID and username from the request
  const { levelId } = req.body;
  username = req.session.user.username;
  // Find the corresponding level
  const level = levels.find((l) => l.id === levelId);

  if (!level) {
    return res.status(400).json({ error: 'Invalid level ID' });
  }

  // Replace the {{name}} placeholder with the username in the mission array
  const replacedMission = level.mission.map((mission) => mission.replace(/{{name}}/g, username));

  // Set the current level
  currentLevel = { ...level, mission: replacedMission };

  userInputs = [];
  completedMissionsIndices = [];

  // Send the modified level mission to the client
  res.json({ success: true, mission: replacedMission, objective: level.objective });
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
   userInputs = [];
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

  res.setHeader('Cache-Control', 'no-store');


  console.log(req.session.user)
  username = req.session.user.username;
  console.log('Received check-user-level request');
   user_level = req.session.user.user_saved_level;
  console.log('User Level: ', user_level);
  res.json({level: user_level})
  

});

app.get('/get-user-info', (req, res) => {
  if (req.session.user) {


    userId = req.session.user.user_id;

    connection.query("SELECT * from users WHERE user_id =?", [userId], (err, results) => {
        if (err) {
          console.log("Error getting updated user details: ", err);
          res.status(500).json({ error: 'Internal Server Error' });
          return;
        }

        req.session.user = results[0];

    })

    connection.query("SELECT link as profile_link FROM users INNER JOIN cosmetic_linktbl ON cosmetic_linktbl.id = users.user_pic WHERE users.user_id = ?",[userId], (err, results)=> {

      if (err) {
      console.log("Error getting source for profile picture:", err ); 
      return;

      }
      const link = results[0].profile_link;

      console.log(link);
      res.json({ ...req.session.user, timestamp: new Date().getTime(), link: link });
    })
      // Append a random query parameter to prevent caching
      
  } else {
      res.status(401).json({ error: 'User not logged in' });
  }
});




// Function to clean and normalize a string
function cleanAndNormalize(str) {
  // Convert to lowercase and remove spaces
  return str.toLowerCase().replace(/\s/g, '');
}


// Function to check if the user's input array satisfies the level mission requirements
function checkMissionCompletion(userInputs, mission, username) {
  // Replace {{name}} placeholders with the specified username
  const replacedMission = mission.map(requirement => requirement.replace(/\{\{name\}\}/g, username));

  // Clean and normalize replaced mission requirements
  const normalizedMission = replacedMission.map(cleanAndNormalize);

  // Check each mission requirement
  for (let i = 0; i < normalizedMission.length; i++) {
    const requirement = normalizedMission[i];

    // Check if the requirement exactly matches any user input (case-insensitive and spaces removed)
    if (userInputs.some((input) => cleanAndNormalize(input) === requirement)) {
      // Mission requirement is satisfied
      // Check if the index is not already present in completedMissionsIndices
      if (!completedMissionsIndices.includes(i)) {
        completedMissionsIndices.push(i);
      }
    }
  }

  // Check if any mission requirements are satisfied
  if (completedMissionsIndices.length === normalizedMission.length) {
    // All level missions are completed
    return true;
  } else {
    return false;
  }
}




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
    username
    
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



app.post('/level-5-checker', (req, res) => {

const ans = req.body.sqlInput;

const ansLowered = ans.toLowerCase();

const isChiefButlerEnterred = ansLowered.includes('edmund thatcher');

const isMastermindEnterred = ansLowered.includes('evelyn whitewood');

const deleteSuspectEntriesSql = `DELETE from suspect`;

if (completedMissionsIndices.some(index => [0, 1, 2].includes(index))) {

  if (isChiefButlerEnterred && !isMastermindEnterred) {

    res.json("You are close, he's not the mastermind but he is an accomplice.");


    gameDb.exec(`${deleteSuspectEntriesSql}`, (err) => {
      if (err) {
        console.error('Error executing SQL queries:', err);
        res.status(500).json({ error: 'Internal Server Error' });
        return;
      }
      });
    }
    
  
  
  if (!isChiefButlerEnterred && isMastermindEnterred) {
  
  res.json("You got the mastermind!");

  gameDb.exec(`${deleteSuspectEntriesSql}`, (err) => {
    if (err) {
      console.error('Error executing SQL queries:', err);
      res.status(500).json({ error: 'Internal Server Error' });
      return;
    }
    });
  
  }
  
  else {
  
    gameDb.exec(`${deleteSuspectEntriesSql}`, (err) => {
      if (err) {
        console.error('Error executing SQL queries:', err);
        res.status(500).json({ error: 'Internal Server Error' });
        return;
      }
      });

  }
  
}




})








//Classic mode randomization 


function generateRandomSQLProblem(counter) {


  
      const easy_template = [
          {
            template: "SELECT * FROM employees INNER JOIN departments ON employees.department_id = deparments.department_id WHERE department_name = '{{department}}'",
            problemStatement: "Retrieve all employees in the '{{department}}' department.",
          },
          {
            template: "SELECT employee_name, AVG(salary) FROM employees GROUP BY department_id HAVING AVG(salary) > {{averageSalary}}",
            problemStatement: "Find the names of employees whose average salary in their department id is greater than {{averageSalary}}.",
          },
          {
            template: "SELECT employee_name, job_title FROM employees WHERE job_title = '{{jobTitle}}'",
            problemStatement: "Retrieve all employees with the job title '{{jobTitle}}'.",
          },
         
          {
            template: "SELECT * FROM employees ORDER BY hire_date DESC",
            problemStatement: "Retrieve all employees and order them by hire date in descending order.",
          },
          {
            template: "SELECT COUNT(*) FROM employees WHERE salary > {{salaryThreshold}}",
            problemStatement: "Count the number of employees with a salary greater than {{salaryThreshold}}.",
          },
          {
              template: "DELETE FROM employees WHERE hire_date < '{{date}}'",
              problemStatement: "Remove employees hired before '{{date}}' from the database.",
            },
          {
              template: "SELECT * FROM projects WHERE status = '{{status}}'",
              problemStatement: "Retrieve all {{status}} projects."
          }
  
          
          
        ];
  
  
          
  const medium_Template = [
      {
        template: "SELECT employee_name, job_title FROM employees INNER JOIN departments ON employees.department_id = departments.department_id WHERE departments.department_name = '{{department}}' AND salary > {{salary}}",
        problemStatement: "Retrieve  the names and job titles of employees  in the '{{department}}' department with a salary greater than {{salary}}.",
      },
      {
        template: "SELECT department_name, COUNT(employees.id) FROM employees INNER JOIN departments ON employees.department_id = departments.department_id GROUP BY departments.department_id HAVING COUNT(*) > {{employeeCount}}",
        problemStatement: "Find the name and the number of employees of departments with more than {{employeeCount}} employees.",
      },
      {
        template: "UPDATE employees SET salary = salary + (salary * {{percentageIncrease}}) WHERE job_title = '{{jobTitle}}'",
        problemStatement: "Increase the salary by {{percentageIncrease}}% for all '{{jobTitle}}' employees.",
      },
      
      {
          template: "INSERT INTO departments (department_name, location) VALUES ('{{newDepartmentName}}', '{{newDepartmentLocation}}')",
          problemStatement: "Add a new department with the name '{{newDepartmentName}}' and location '{{newDepartmentLocation}}' to the departments table.",
      },
  
      {
          template: "SELECT employees.employee_name, departments.department_name FROM employees INNER JOIN departments ON employees.department_id = departments.department_id WHERE employees.department_id = '{{departmentId}}' AND employees.salary > {{salary}}",
          problemStatement: "Retrieve the names of employees and their respective department names for those in the department with ID '{{departmentId}}' and a salary greater than {{salary}}.",
        },
        
        {
          template: "UPDATE employees SET manager_id = '{{newManagerId}}' WHERE department_id = '{{departmentId}}' AND salary < {{managerSalary}}",
          problemStatement: "Assign a new manager with ID '{{newManagerId}}' to all employees in the department with ID '{{departmentId}}' whose salary is less than '{{managerSalary}}'.",
        },
  
        {
          template: "SELECT * FROM employees INNER JOIN departments ON employees.department_id = departments.department_id WHERE department_name = '{{department}}' AND employees.salary BETWEEN {{minSalary}} AND {{maxSalary}}",
          problemStatement: "Retrieve all employees in the '{{department}}' department with salaries between {{minSalary}} and {{maxSalary}}.",
      },
      
   
    ];
   
    const hard_Template = [
      { 
        template: "SELECT employee_name, project_name FROM employees INNER JOIN employee_projects ON employees.employee_id = employee_projects.employee_id INNER JOIN projects ON employee_projects.project_id = projects.project_id WHERE employees.department_id = '{{departmentId}}' AND projects.start_date >= '{{startDate}}' AND projects.end_date <= '{{endDate}}'",
        problemStatement: "Retrieve the names of employees and the names of projects they are working on in the department with ID number '{{departmentId}}'. Include only those projects that started after '{{startDate}}' and ended before '{{endDate}}'.",
       },
  
      {
          template: "SELECT employees.employee_name, projects.project_name FROM employees INNER JOIN employee_projects ON employees.employee_id = employee_projects.employee_id INNER JOIN projects ON employee_projects.project_id = projects.project_id WHERE employees.job_title = '{{jobTitle}}' AND projects.status = 'Active'",
          problemStatement: "Find the names of employees and the names of projects they are working on for those with the job title '{{jobTitle}}' and working on active projects.",
        },
  
        {
          template: "SELECT department_name, AVG(salary) AS avg_salary FROM employees INNER JOIN departments ON employees.department_id = departments.department_id WHERE departments.department_name = '{{department}}' GROUP BY departments.department_id HAVING AVG(salary) > {{averageSalary}}",
          problemStatement: "Find the department names and average salaries for departments where the average salary is greater than {{averageSalary}}. Display the results for the '{{department}}' department.",
        },
  
        {
          template: "SELECT employee_name, project_name, COUNT(employee_projects.project_id) AS project_count FROM employees INNER JOIN employee_projects ON employees.employee_id = employee_projects.employee_id INNER JOIN projects ON employee_projects.project_id = projects.project_id WHERE employees.department = '{{department}}' AND projects.start_date >= '{{startDate}}' AND projects.end_date <= '{{endDate}}' GROUP BY employees.employee_id, employee_name HAVING project_count > 2 ORDER BY project_count DESC",
          problemStatement: "Retrieve the names of employees, project names, and project counts for those in the '{{department}}' department. Include only those employees who are assigned to more than two projects between '{{startDate}}' and '{{endDate}}'. Display the results in descending order of project count.",
        },
      
        {
          template: "SELECT department_name, MAX(salary) AS max_salary FROM employees INNER JOIN departments ON employees.department_id = departments.department_id GROUP BY departments.department_id, department_name HAVING MAX(salary) > {{maxSalary}} ORDER BY max_salary DESC",
          problemStatement: "Find the department names and maximum salaries for departments where the maximum salary is greater than {{maxSalary}}. Display the results in descending order of maximum salary.",
        },
      
        {
          template: "SELECT employee_name, job_title FROM employees WHERE employees.department_id IN (SELECT department_id FROM departments WHERE location = '{{location}}')",
          problemStatement: "Retrieve the names and job titles of employees in departments located in '{{location}}'.",
        },
      
        {
          template: "UPDATE projects SET status = 'Completed' WHERE project_id IN (SELECT project_id FROM employee_projects WHERE employee_id IN (SELECT employee_id FROM employees WHERE department = '{{department}}')) AND projects.end_date < '{{endDate}}'",
          problemStatement: "Mark all projects in the '{{department}}' department with an end date before '{{endDate}}' as 'Completed'.",
        },
      
        {
          template: "SELECT employee_name, job_title, COUNT(employee_projects.project_id) AS project_count FROM employees INNER JOIN employee_projects ON employees.employee_id = employee_projects.employee_id INNER JOIN projects ON employee_projects.project_id = projects.project_id WHERE employees.job_title = '{{jobTitle}}' AND projects.status = 'Active' GROUP BY employees.employee_id, employee_name, job_title HAVING project_count > 0 ORDER BY project_count DESC",
          problemStatement: "Find the names, job titles, and project counts for employees with the job title '{{jobTitle}}' working on active projects. Display the results in descending order of project count.",
        },
  
  
  
    ]
  
  
    
        // Generate random data
        const departments = ["HR", "IT", "Finance", "Marketing", "Legal", "Customer Service" , "Sales" , "R&D" , "Admin" , "Security" , "Production"];
        const locations = ["San Francisco" , "Quezon City" , "Manila", "Shanghai" , "Quebec" , "Baghdad", "Tokyo" , "Kuala Lumpur" , "Jerusalem" , "San Antonio" , "Athens" , "Guadalajara"];
        const jobTitle = ["Accountant" , "Senior Developer" , "Marketing Assistant" , "Graphic Designer", "Project Manager" , "Financial Analyst"];
        const projectStatus = ["Active" , "Completed" , "Aborted", "Inactive"];
  
        
        const randomDepartment = departments[Math.floor(Math.random() * departments.length)];
        const randomAverageSalary = Math.floor(Math.random() * 50000) + 50000; 
        const randomJobTitle = jobTitle[Math.floor(Math.random() * jobTitle.length)];
        const randomSalaryThreshold = Math.floor(Math.random() *70000) + 50000;
        const randomSalary = Math.floor(Math.random() * 50000) + 30000;
        const randomEmployeeCount = Math.floor(Math.random() * 2000); 
        const randomPercentage = (Math.floor(Math.random () * 200) / 100) + 1;
        const randomDepartmentId = Math.floor(Math.random() * 5);
        const start_date = new Date('2008-05-01');
        const end_date = new Date('2022-05-02');
        const randomDate = getRandomDate(start_date, end_date); 
        const randomDate2 = getRandomDate(start_date, end_date); 
        const randomManagerId = Math.floor(Math.random() * 1000);
        const randomProjectStatus = projectStatus[Math.floor(Math.random() * projectStatus.length)];
        const randomSalaryLow = Math.floor(Math.random() * 50000) + 10000;
        const randomLocation = locations[Math.floor(Math.random() * locations.length)];
  
  
  
  
  
  
  
    function getRandomDate (startDate, endDate) {
  
      const startMillis = startDate.getTime();
      const endMillis = endDate.getTime();
      const RandomMillis = startMillis + Math.random() * (endMillis - startMillis);
      const randomDate = new Date(RandomMillis);
      const formattedDate = randomDate.toISOString().split('T')[0];
  
  
      return formattedDate;
      
    }
    
      
      let sqlProblems;
    
  
      if (counter < 3) {
        sqlProblems = easy_template;
      }
      else if (counter <= 10 && counter >= 3) {
        sqlProblems = medium_Template;
      }

      else {
        sqlProblems = hard_Template;
      }
  
  
  
      const randomSqlProblem = sqlProblems[Math.floor(Math.random() * sqlProblems.length)];
      
   
      const randomTemplate = randomSqlProblem.template;
     
     
      const isRecentlyUsed = checkTemplateHistory(randomTemplate);
  
  
  
      if (isRecentlyUsed) {
        
        return generateRandomSQLProblem(counter);
      }
  
  
      console.log(templateHistory);
      updateTemplateHistory(randomTemplate);
  
  
      const problemStatementTemplate = randomSqlProblem.problemStatement;
  
  
  
       sqlQuery = randomTemplate
        .replace('{{department}}', randomDepartment)
        .replace('{{averageSalary}}', randomAverageSalary)
        .replace('{{jobTitle}}', randomJobTitle)
        .replace('{{salaryThreshold}}', randomSalaryThreshold)
        .replace('{{salary}}', randomSalary)
        .replace('{{employeeCount}}', randomEmployeeCount)
        .replace('{{percentageIncrease}}', randomPercentage)
        .replace('{{date}}', randomDate)
        .replace('{{departmentId}}', randomDepartmentId)
        .replace('{{minSalary}}' , randomSalaryLow)
        .replace('{{maxSalary}}' , randomSalary)
        .replace('{{newManagerId}}', randomManagerId)
        .replace('{{managerSalary}}', randomSalary)
        .replace('{{status}}', randomProjectStatus)
        .replace('{{newDepartmentName}}', randomDepartment)
        .replace('{{newDepartmentLocation}}', randomLocation)
        .replace('{{startDate}}' , randomDate)
        .replace('{{endDate}}', randomDate2)
        .replace('{{location}}', randomLocation);
      
  
  
  
  
       problemStatement = problemStatementTemplate 
        .replace('{{department}}', randomDepartment)
        .replace('{{averageSalary}}', randomAverageSalary)
        .replace('{{jobTitle}}', randomJobTitle)
        .replace('{{salaryThreshold}}', randomSalaryThreshold)
        .replace('{{salary}}', randomSalary)
        .replace('{{employeeCount}}', randomEmployeeCount)
        .replace('{{percentageIncrease}}', randomPercentage)
        .replace('{{date}}', randomDate)
        .replace('{{departmentId}}', randomDepartmentId)
        .replace('{{minSalary}}' , randomSalaryLow)
        .replace('{{maxSalary}}' , randomSalary)
        .replace('{{newManagerId}}', randomManagerId)
        .replace('{{managerSalary}}', randomSalary)
        .replace('{{status}}', randomProjectStatus)
        .replace('{{newDepartmentName}}', randomDepartment)
        .replace('{{newDepartmentLocation}}', randomLocation)
        .replace('{{startDate}}' , randomDate)
        .replace('{{endDate}}', randomDate2)
        .replace('{{location}}', randomLocation);
      

      
     
    }
  
  
    const templateHistory = [];
  
  
    function checkTemplateHistory(template) {
      
      return templateHistory.includes(template);
    }
    
    function updateTemplateHistory(template) {
    
      templateHistory.push(template);
    
      
      if (templateHistory.length > 5) {
        templateHistory.shift(); 
      }
    }

   






 




app.post('/initialize-db' , (req, res) => {
counter = 0;


  if (classicDbInitialized) {
    return res.json({ message: 'Game database already initialized' });
  }


  // Set the flag to true to prevent further initialization
  classicDbInitialized = true;


  const createEmployeeTblSql = `CREATE TABLE IF NOT EXISTS employees (
    employee_id INTEGER PRIMARY KEY,
    employee_name TEXT NOT NULL,
    job_title TEXT NOT NULL,
    department_id INTEGER,
    salary INTEGER,
    hire_date DATE,
    manager_id INTEGER,
    FOREIGN KEY (department_id) REFERENCES departments(id),
    FOREIGN KEY (manager_id) REFERENCES employees(employee_id)
  );
  `;
  
  const createDepartmentsTblSql = `CREATE TABLE IF NOT EXISTS departments (
    department_id INTEGER PRIMARY KEY,
    department_name TEXT NOT NULL,
    location TEXT
  );
  `;
  
  const createProjectsTblSql = `CREATE TABLE IF NOT EXISTS projects (
    project_id INTEGER PRIMARY KEY,
    project_name TEXT NOT NULL,
    start_date DATE,
    end_date DATE,
    status TEXT
  );
  `;
  
  const createEmployeeProjectsTblSql = `CREATE TABLE IF NOT EXISTS employee_projects (
    employee_id INTEGER,
    project_id INTEGER,
    PRIMARY KEY (employee_id, project_id),
    FOREIGN KEY (employee_id) REFERENCES employees(employee_id),
    FOREIGN KEY (project_id) REFERENCES projects(project_id)
  );
  `;
  
  const insertEmployeeSql = `INSERT INTO employees (employee_name, job_title, department_id, salary, hire_date, manager_id)
  VALUES
    ('John Doe', 'Senior Developer', 1, 60000, '2022-01-18', 3073),
    ('Jane Smith', 'Marketing Assistant', 2, 45000, '2022-01-18', 212),
    ('Alice Johnson', 'Financial Analyst', 3, 55000, '2022-01-18' , 652),
    ('Bob Brown', 'Project Manager', 1, 70000, '2022-01-18', 9414);
  `;
  
  const insertEmployeeProjectsSql = `INSERT INTO employee_projects (employee_id, project_id)
  VALUES
    (1, 1),
    (2, 2),
    (3, 3),
    (4, 4);
  `;
  
  const insertDepartmentsSql = `INSERT INTO departments ( department_name, location)
  VALUES
    ('HR', 'San Francisco'),
    ('IT', 'Quezon City'),
    ('Marketing', 'Manila'),
    ('Finance', 'Shanghai');
  `;
  
  const insertProjectsSql = `INSERT INTO projects (project_name, status, start_date, end_date)
  VALUES
    ('Project A', 'Active', '2022-01-18', '2022-02-18'),
    ('Project B', 'Completed', '2022-03-01', '2022-04-15'),
    ('Project C', 'Active', '2022-02-01', '2022-03-15'),
    ('Project D', 'Inactive', '2022-04-01', '2022-05-15');
  `;
  


    classicDb.serialize(() => {
      classicDb.exec(`
        ${createEmployeeTblSql}
        ${createEmployeeProjectsTblSql}
        ${createDepartmentsTblSql}
        ${createProjectsTblSql}
        ${insertEmployeeSql}
        ${insertEmployeeProjectsSql}
        ${insertDepartmentsSql}
        ${insertProjectsSql}
      `, (err) => {
        if (err) {
          console.error('Error executing SQL queries:', err);
          res.status(500).json({ error: 'Internal Server Error' });
          return;
        }
    
        res.json({ message: 'Game database initialized' });
      });
    });

})







app.get('/random-sql-template', (req, res) => {
  
  generateRandomSQLProblem(counter);

  res.json({ success: true, message: 'Random SQL template generated', problemStatement, sqlQuery, counter });
  console.log("SQL QUERY: ", sqlQuery);
  console.log("PROBLEM: ", problemStatement);
  console.log("Correct Answer Counter: ", counter);
});




app.post('/check-answer', (req, res) => {


  const userAnswer = cleanAndNormalize(req.body.userInput);
  const correctAnswer = cleanAndNormalize(sqlQuery);


if (userAnswer === correctAnswer) {
  counter++;
  res.json({ success: true, message: "Answer correct.", counter });
} else {
  res.json({ success: false, message: "Answer incorrect.", counter });
}


});


app.post('/reset-counter', (req, res) => {
 counter = 0;

  res.json({ success: true, message: 'Counter reset on the server side' });
});


app.get('/classic-add-coins', (req, res) => {
       username = req.session.user.username;
      userDbCoins = req.session.user.dbcoins;
       console.log(username);

 


dbcoins = userDbCoins + (counter * 50);

connection.query("UPDATE users SET dbcoins = ? WHERE username = ?", [dbcoins, username] ,(err, results) => {
if (err) {
  console.error('Error executing MySQL query:', err);
  res.status(500).send('Internal Server Error');
  return;
}

res.json({ coins: counter * 50, correctAnswers: counter});



connection.query('SELECT * FROM users WHERE username = ?', [username], (err, results) => {
  if (err) {
    console.error('Error executing MySQL query:', err);
    res.status(500).send('Internal Server Error');
    return;
  }
  

  if (results.length > 0) {
    console.log(results[0]);
    
  } 

  

  else {
    console.error('User not found.');
    res.status(404).send('User not found.');
    return;
  }
  
});
});
});


app.get('/update-high-score',(req, res) => {
let username = req.session.user.username;
let highscore = req.session.user.classic_high_score;
let score = counter * 50;

if (score > highscore) {
  connection.query('UPDATE users SET classic_high_score = ? WHERE username = ?', [score, username], (err, results) => {
    if (err) {
      console.error('Error executing MySQL query:', err);
      res.status(500).send('Internal Server Error');
      return;
    }
    
    console.log("Successful updating high score for ", username);
  
  });

}

});


app.get('/get-leaderboards', (req, res) => {

  connection.query("SELECT user_id, username, classic_high_score from users ORDER BY classic_high_score DESC LIMIT 10", (err, results) => {
    if (err) {
      console.error('Error executing MySQL query:', err);
      res.status(500).send('Internal Server Error');
      return;
    }

    res.json({rows: results, user_id: userId});
  });


});


app.get('/get-shop-items', (req, res) => {

  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0');
  connection.query('SELECT * FROM shoptbl INNER JOIN cosmetic_linktbl on shoptbl.id = cosmetic_linktbl.item_id', (err, shopResults) => {
      if (err) {
          console.error('Error executing MySQL query:', err);
          res.status(500).send('Internal Server Error');
          return;
      }

      const shopItems = shopResults;

      

      connection.query('SELECT * from user_purchasestbl WHERE user_id = ?', [userId], (err, userResults) => {
          if (err) {
              console.error('Error executing MySQL query:', err);
              res.status(500).send('Internal Server Error');
              return;
          }

          const userPurchases = userResults;
          res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0');
          res.json({ shopItems, userPurchases });
      });
  });
});


app.post('/buy-item', (req, res) => {
const item_id = req.body.item_id;
const item_price = req.body.price;
const item_type = req.body.item_type;
let username = req.session.user.username;


connection.query("SELECT * from users where username = ? ", [username], (err, results) => {
  if (err) {
    console.error("Error executing MySQL query for selecting dbcoins: ", err);
    res.status(500).send('Internal Server Error');
    return;
  };

  if (results[0].dbcoins > item_price) {
    userDbCoins = results[0].dbcoins - item_price;

  
    connection.query("UPDATE users SET dbcoins =  ? WHERE username = ? " ,[userDbCoins, username], (err, results)=> {
      if (err) {
        console.error("Error executing MySQL query for updating dbcoins: ", err);
        res.status(500).send('Internal Server Error');
        return;
  
      }
  
      connection.query ("INSERT INTO user_purchasestbl (item_id, user_id, type) VALUES (?, ?, ?)", [item_id, userId, item_type ], (err, results) => {
  
        if (err) {
          console.error("Error executing MySQL query for inserting into user_purchasestbl: ", err);
          res.status(500).send('Internal Server Error');
          return;
    
        }
  
        console.log("Purchase successful.")
        res.json("Purchase successful.")
      })
    })

    
  }
 
  else {
    res.json({message: "Insufficient dbcoins. "})
  }

})

});

app.get('/get-inventory-items', (req, res) => {

  connection.query("SELECT user_pic from users where user_id =?", [userId], (err, results)=> {

    if (err) {
      console.log("Error getting user_pic: ", err);
      
    }
     user_pic = results[0].user_pic;
     console.log('User picture for: ', userId, ": ", results);


  })

 

  connection.query("SELECT DISTINCT cosmetic_linktbl.item_id, cosmetic_linktbl.link, user_purchasestbl.user_id, user_pic, shoptbl.name FROM cosmetic_linktbl LEFT JOIN user_purchasestbl ON cosmetic_linktbl.item_id = user_purchasestbl.item_id LEFT JOIN shoptbl ON user_purchasestbl.item_id = shoptbl.id LEFT JOIN users ON user_purchasestbl.user_id = users.user_id WHERE cosmetic_linktbl.link LIKE '%default%' OR user_purchasestbl.user_id = ?; ", [userId], (err, results) => {
  if (err) {
    console.error("Error executing MySQL query for getting inventory items: ", err);
    res.status(500).send('Internal Server Error');
    return;

    
  }
  console.log("Inventory item retrieval successful.")
  res.json({items: results, picture_used: user_pic});
 

 

  });

});

app.post('/change-profile-picture', (req, res) => {

  pic_id = req.body.item_id;

  connection.query("UPDATE users SET user_pic = ? WHERE user_id =?", [pic_id, userId], (err, results) => {

    if (err) {
      console.log("Error executing MySQL query for updating user's current picture: ", err);
      res.status(500).send("Internal Server Error");
      return;
    }

    console.log("User picture updated successfully.");
    
  })

})


app.get('/get-users', (req, res) => {

connection.query("SELECT * from users where user_type != 'admin'", (err, results) => {

  if (err) {
    console.error("Error executing MySQL query for getting users (admin): ", err);
    res.status(500).send('Internal Server Error');
    return;

  }

  res.json(results);
  });
}) 




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
