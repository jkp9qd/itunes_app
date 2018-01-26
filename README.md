# itunes_app

ITunes Application
Goal
Develop a command line tool which stores users information and let's them buy and view their music using Node, Postgres & Inquirer.

Assignment
 Create a database called itunes.

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
 

Tips
Set an environment variable by opening either ~/.bash_profile for OSX or ~/.bashrc for Linux and adding the line:
export POSTGRES_USER=jon
export POSTGRES_PASSWORD=mypassword
After that, restart your terminal to propagate these changes to your shell.

This will allow your instructor to grade your assignments without having to go into your code and change your connection string to his configuration.

Grading Criteria
The database is named itunes_app.
The postgres username must be read from an environment variable named POSTGRES_USER.
The postgres password (if present) must be read from an environment variable named POSTGRES_PASSWORD
The instructions are followed above
Effort is shown
A Working application with no console errors
Good indentation, proper variable naming convention, proper file naming convention, good directory architecture
Submit the assignment via a github repo url.

Complete = Meets all grading criteria above.

Incomplete = Does not meet all grading criteria above. Needs improvement or missing submission.
