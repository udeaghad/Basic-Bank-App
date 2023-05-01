## RavenPayTest🏩
Introducing our fantastic payment app! With our user-friendly interface, you can easily accept fund transfers from other banks and send transfers to any bank you desire. Our cutting-edge technology is powered by RavenPay API terminal, enabling seamless interconnectivity.

This amazing product is specifically designed to handle all your basic payment needs, from the transfer of funds to receiving them and checking your transaction details and history. With our secure and reliable system, you can be assured of a hassle-free payment experience.
## Project Documentation 📄

 - [API Documentation](https://documenter.getpostman.com/view/22522406/2s93eSZF1B)

## Built With 🛠️
- Programming Langiages: TypeScript and JavaScript
- Frameworks: Node.js, Express.js
- Database: MySql and Knex
- Git and GitHub
- Code Editor: VS Code.

# Getting Started
To get a local copy up and running follow these simple steps.

### Prerequisites
- A code editor like Visual Studio Code with Git and nodejs installed.
- You can check if Git is installed by running the following command in the terminal.
- `$ git --version`
- You can check if node is installed by running the following command in the terminal.
- `$ node --version`
- Ensure you have Mysql database installed(You can click [here](https://dev.mysql.com/doc/mysql-installation-excerpt/5.7/en/) for the documentations and installation)
- Ensure you knex installed(You can click here [here](https://knexjs.org/) for the documentations and installation)


# Usage
## Run development environment
- Clone the repo from here.
- `$ git clone https://github.com/udeaghad/RavenPayTest.git`
- Make your way to the correct directory by running this command:
- `$ cd RavenPayTest `
- Run `npm install`
- create an .env file and update the following environmental variables:
  - PORT - the port where your serve will be running
  - DB_HOST - Mysql localhost
  - DB_USER - Mysql username
  - DB_PASSWORD - Mysql password
  - DB_NAME(Please ensure your create this database in my MySQL) - Mysql database name
  - DB_PORT - Mysql database port
  - JWT
  - RAVEN_SECRET 
  - ENVIRONMENT = test(Set this to run integraton testing)
- Create your database and connect it on the knexfile.ts
  - Run `npm run createDB`
- Run `npm run migrate` to migrate the table columns and their properties to your database
- Run `npm run dev` to start the application
- open postman and read the documentation to test the app

## Run integration testing
- Run `npm test` on your terminal
# Authors

## 👤 Dozie Udeagha
- [GitHub](https://github.com/udeaghad)
- [Twitter](https://twitter.com/theodoz)
- [Linkedin](https://www.linkedin.com/in/)

## 🤝 Contributing
Contributions, issues, and feature requests are welcome!

## Show your support
Give a ⭐️ if you like this project!


## Acknowledgments
- RavenPay(for providing their API to interconnectivity)
- webhook.site (for managing messages and alerts)
## 📝 License
This project is [MIT](./LICENSE) licensed.


