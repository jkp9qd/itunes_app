/*Create a database called itunes.

Have 3 tables:
A pre-populated songs table
Columns: id, song_title, song_artist
A users table
Columns: id, name, username, password
A pivot table which stores what songs people have bought
Columns: id, song_id, user_id
Pre-populate a songs table.
Start off with Inquirer: This is where you will create your username if it does not exist in the database
Inquirer should prompt: Sign Up/Sign in
The sign in should check username and password.
If the username is not in the database, then you can tell the client to sign up and close the connection.
If the username is in the database, then prompt them to enter their password.
If the password matches the user's account, then prompt them either:
If they would like to add a song
Have it prompt what songs are available
Ask them what song they would like to add
Check the songs that they have
Get their songs from the database
Bonus

Create a bank table:
id, balance, user_id
Every time a user account is created, a bank record is created for that user
Add a column to your songs table called 'amount' which will be an INT and give each song a price
When the user add's a song, have it deduce the amount that the song is priced at from the user's balance in the bank table.
*/





var pg = require('pg');
var inquirer = require('inquirer');

var dbUrl = {
	user: process.env.POSTGRES_USER,
	password: process.env.POSTGRES_PASSWORD,
	database: 'itunes',
	host: 'localhost',
	port: 5432
};

var pgClient = new pg.Client(dbUrl);
pgClient.connect();

console.log ("Welcome to iTunes!");

var login = () => {
	inquirer.prompt([
	  {
	  	type: "list",
	  	message: "Sign Up/Sign In",
	    choices:["Sign Up", "Sign In"],
	  	name: "sign_choice"
	  }
	]).then((res) => {
		if (res.sign_choice === "Sign Up") {
			inquirer.prompt ([
			{
			type: "input",
			message: "What is your name?",
			name: "name"
			},
	    {
	    	type: "input",
	    	message: "Enter your username",
	    	name: "username"
	    },
	    {
	    	type: "password",
	    	message: "Enter a password?",
	    	name: "password"
	    },
			{
			 type: "list",
			 message: "Add money to your account",
			 choices: ['1','5','10','15','20','25'],
			 name: "balance"
		 }
		]).then((results) => {
			pgClient.query('INSERT INTO users (name, username, password, balance) VALUES ($1, $2, $3, $4)',[results.name, results.username, results.password, results.balance], function (err, results) {
					if(err) throw err
						console.log("Your account has been created! Please Sign In");
						login();
					});
			});
		};
		if (res.sign_choice === "Sign In") {
			inquirer.prompt([
				{
		    	type: "input",
		    	message: "Enter a username",
		    	name: "username"
		    },
		    {
		    	type: "password",
		    	message: "Enter a password?",
		    	name: "password"
		    }
			]).then((signInRes) => {
				pgClient.query(`SELECT * FROM users WHERE username='${signInRes.username}'`, function(errTwo, result){
					if(result.rows.length > 0) {
						if(result.rows[0].password === signInRes.password){
							var songOptions = () => {
								inquirer.prompt([
									{
								  	type: "list",
								  	message: "Select from the following options:",
								    choices:["View available songs", "View Songs in your account"],
								  	name: "songs"
									}
							]).then((songsRes) => {
								if(songsRes.songs === "View available songs") {
									pgClient.query('SELECT * FROM songs',((errThree, resultsThree) => {
										var songs = [];
										resultsThree.rows.forEach((songList) => {
											songs.push(songList.song_title);
										})
										inquirer.prompt([
											{
												type: "list",
												message: "Choose a song to add to your account",
												choices: songs,
												name: "song"
											}
										]).then(function(songAdd){
											var song_id;
											resultsThree.rows.forEach((songList) => {
												if(songList.song_title === songAdd.song) {
													song_id = songList.id
												}
											})
											pgClient.query("INSERT INTO bought_songs(user_id, song_id) VALUES ($1, $2)",
											[result.rows[0].id, song_id], (errFour, resFour)=> {
												if (errFour) throw errFour;
												console.log("Song has been added to your account");
												songOptions();
											});
										})
									}))
								} if (songsRes.songs === "View Songs in your account") {
										console.log ("Here are the Songs You Have Added to your account");
										pgClient.query('SELECT songs.song_title FROM songs INNER JOIN bought_songs ON bought_songs.song_id=songs.id WHERE bought_songs.user_id=' + result.rows[0].id, (errFive, result)=> {
										if (result.rows.length > 0) {
											for(var i =0; i < result.rows.length; i++){
												console.log((i + 1) + ". " +
												result.rows[i].song_title)
											}
										} else {
											console.log ("You do not have any songs in your account")
											songOptions();
										}
									})
								}
							});
							};
							songOptions();
						} else {
							console.log("Please enter the correct password");
							login();
						}
						};
					});
				})
			};
	});
	};
login();