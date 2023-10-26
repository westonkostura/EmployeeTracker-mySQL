# EmployeeTracker-mySQL

Developers frequently have to create interfaces that allow non-developers to easily view and interact with information stored in databases. These interfaces are called content management systems (CMS). Your assignment this week is to build a command-line application from scratch to manage a company's employee database, using Node.js, Inquirer, and MySQL.

## Description

The employee tracker is a command line application that allows the user to view, add, update, and delete employees, roles, and departments. The application uses node.js, inquirer, and MySQL to create a database of employees, roles, and departments. The user can view all employees, roles, and departments, add employees, roles, and departments, update employee roles, and delete employees, roles, and departments.

## Installation

To install the employee tracker application, the user must clone the repository from GitHub. The user must then install the dependencies by running the following command in the terminal:

`npm install`

The user must then create the database by running the following command in the terminal:

`mysql -u root -p`
`source db/schema.sql`


## Usage

The user can start the application with the following command in the terminal:

`node server.js`

The user can then select from the following options:
View all employees,
View all employees by department,
View all employees by manager,
Add an employee,
Remove an employee,
Update an employee role,
Update an employee manager,
View all roles,
Add a role,
Remove a role,
View all departments,
Add a department,
Delete a department






## Credits 

The application was helped to completion by Github Copilot and the resources from the ASU bootcamp challenges.

## License

