# Employee Tracker Database

##Table of Contents
- [Description](#description)
- [Installation](#installation)
- [Usage](#usage)
- [Contribution](#contribution)
- [Test](#test)
- [License](#license)
- [Questions](#questions)
## Description
A CLI Inquirer application tied to an SQL Database allowing users to store, read, and update employee, role, and department information.
## Installation
Install Node.JS and postgresSQL prior to running. Clone GitHub repository to local machine.
## Usage
In the cloned GitHub repository folder, create a .env file in the root folder with the following environment variables: DB_HOST=localhost , DB_DATABASE=employees_db , DB_USER=(insert your postgres username here) , and DB_PASSWORD=(your postgres password here). In the command line, navigate to the repository root folder and initialize the postgres database by entering the command "psql -U postgres" and entering your postgres password when prompted. Next you will initiate the tables in the database by running the command "\i ./db/schema.sql", and then you will populate the tables with seed data by running the command "\i ./d/seeds.sql". Then enter the command \q to exit the postgres database. Next run the command "npm run launch" to compile the typescript files and run the resulting javascript files. You will be presented with a prompt asking to perform various actions, viewing the various tables, adding new departments, roles, and employees, and updating employee roles. Press ENTER after any action to return to the main menu. Exit the application by selecting the EXIT option of by pressing CTRL-C on windows to terminate the batch job. A video demonstration can be found [HERE](https://drive.google.com/file/d/15kQWRJRcgKPW70y0Ps0tI9IlkKEZjdQV/view?usp=sharing)
## Contribution
Eric Neff
## Test
N/A

## Questions
If you have any questions, you can reach me through my GitHub [github/eric7string](https://www.github.com/eric7string) or via email at emn531@gmail.com.
