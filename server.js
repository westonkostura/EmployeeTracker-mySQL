const mysql = require("mysql2");
const inquirer = require("inquirer");
const cTable = require("console.table");

//mysql connection
const connection =
 mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Wjk10056203!",
  database: "employee_db",
  port: 3306,
});
connection.connect((err) => {
  if (err) throw err;
  console.log(
    " ______ __  __ _____  _      ______     ________ ______   _______ _____            _____ _  ________ _____  "
  );
  console.log(
    "|  ____|  \\/  |  __ \\| |    / __ \\ \\   / /  ____|  ____| |__   __|  __ \\     /\\   / ____| |/ /  ____|  __ \\ "
  );
  console.log(
    "| |__  | \\  / | |__) | |   | |  | \\ \\_/ /| |__  | |__       | |  | |__) |   /  \\ | |    | ' /| |__  | |__) |"
  );
  console.log(
    "|  __| | |\\/| |  ___/| |   | |  | |\\   / |  __| |  __|      | |  |  _  /   / /\\ \\| |    |  < |  __| |  _  / "
  );
  console.log(
    "| |____| |  | | |    | |___| |__| | | |  | |____| |____     | |  | | \\ \\  / ____ \\ |____| . \\| |____| | \\ \\ "
  );
  console.log(
    "|______|_|  |_|_|    |______\\____/  |_|  |______|______|    |_|  |_|  \\_\\/_/    \\_\\_____|_|\\_\\______|_|  \\_\\"
  );
  console.log(
    "*************************************************************************************************************"
  );
  mainMenu();
});

//inquirer prompts
function mainMenu() {
  inquirer
    .prompt([
      {
        type: "list",
        name: "action",
        message: "What would you like to do?",
        choices: [
          "View all employees",
          "View all employees by department",
          "View all employees by manager",
          "Add employee",
          "Remove employee",
          "Update employee role",
          "Update employee manager",
          "View all roles",
          "Add role",
          "Remove role",
          "View all departments",
          "Add department",
          "Remove department",
          "Exit",
        ],
      },
    ])
    .then((answers) => {
      // Handle user input
      switch (answers.action) {
        case "View all employees":
          viewAllEmployees();
          break;
        case "View all employees by department":
          viewEmployeesByDepartment();
          break;
        case "View all employees by manager":
          viewEmployeesByManager();
          break;
        case "Add employee":
          addEmployee();
          break;
        case "Remove employee":
          removeEmployee();
          break;
        case "Update employee role":
          updateEmployeeRole();
          break;
        case "Update employee manager":
          updateEmployeeManager();
          break;
        case "View all roles":
          viewAllRoles();
          break;
        case "Add role":
          addRole();
          break;
        case "Remove role":
          removeRole();
          break;
        case "View all departments":
          viewAllDepartments();
          break;
        case "Add department":
          addDepartment();
          break;
        case "Remove department":
          removeDepartment();
          break;
        case "Exit":
          console.log("Goodbye!");
          connection.end();
          break;
        default:
          console.log("Invalid action!");
          connection.end();
          break;
      }
    });
}

//function to view all employees
function viewAllEmployees() {
  connection.query("SELECT * FROM employees", function (err, results) {
    if (err) throw err;
    if (results.length === 0) {
      console.log("No employees found.");
    } else {
      console.log("Viewing all employees...\n");
      console.log("\n");
      console.table(results);
    }
  });
  console.log(
    "*************************************************************************************************************"
  );
  mainMenu();
}

function viewEmployeesByDepartment() {
  // Select all employees and join with departments table
  connection.query(
    "SELECT employees.id, employees.first_name, employees.last_name, roles.title, departments.name AS department, roles.salary, CONCAT(managers.first_name, ' ', managers.last_name) AS manager FROM employees LEFT JOIN roles ON employees.role_id = roles.id LEFT JOIN departments ON roles.department_id = departments.id LEFT JOIN employees managers ON employees.manager_id = managers.id ORDER BY departments.id",
    function (err, results) {
      if (err) throw err;
      console.log("Viewing all employees by department...\n");
      console.table(results);
      console.log(
        "*************************************************************************************************************"
      );
      mainMenu();
    }
  );
}

function viewEmployeesByManager() {
  // Select all employees and join with employees table to get manager names
  connection.query(
    "SELECT employees.id, employees.first_name, employees.last_name, roles.title, departments.name AS department, roles.salary, CONCAT(managers.first_name, ' ', managers.last_name) AS manager FROM employees LEFT JOIN roles ON employees.role_id = roles.id LEFT JOIN departments ON roles.department_id = departments.id LEFT JOIN employees managers ON employees.manager_id = managers.id ORDER BY manager",
    function (err, results) {
      if (err) throw err;
      console.log("Viewing all employees by manager...\n");
      console.table(results);
      console.log(
        "*************************************************************************************************************"
      );
      mainMenu();
    }
  );
}

function addEmployee() {
  // Prompt the user for employee information
  inquirer
    .prompt([
      {
        type: "input",
        name: "first_name",
        message: "Enter the employee's first name:",
      },
      {
        type: "input",
        name: "last_name",
        message: "Enter the employee's last name:",
      },
      {
        type: "input",
        name: "role_id",
        message:
          "Enter the employee's role ID(1 = Sales, 2 = Engineering, 3 = Finance, 4 = Legal):",
      },
      {
        type: "input",
        name: "manager_id",
        message: "Enter the employee's manager ID (optional):",
      },
    ])
    .then(function (answer) {
      // Insert the new employee into the database
      connection.query(
        "INSERT INTO employees SET ?",
        {
          first_name: answer.first_name,
          last_name: answer.last_name,
          role_id: answer.role_id,
          manager_id: answer.manager_id || null,
        },
        function (err, res) {
          if (err) throw err;
          console.log(
            "*************************************************************************************************************"
          );
          console.log(res.affectedRows + " employee added!\n");
          // Return to main menu
          mainMenu();
        }
      );
    });
}

function removeEmployee() {
  // Prompt the user to select an employee to remove
  connection.query("SELECT * FROM employees", function (err, results) {
    if (err) throw err;
    inquirer
      .prompt([
        {
          type: "list",
          name: "employee_id",
          message: "Select an employee to remove:",
          choices: function () {
            // Map the results to an array of choices for the prompt
            return results.map(function (employee) {
              return {
                name: `${employee.first_name} ${employee.last_name}`,
                value: employee.id,
              };
            });
          },
        },
      ])
      .then(function (answer) {
        // Delete the selected employee from the database
        connection.query(
          "DELETE FROM employees WHERE ?",
          {
            id: answer.employee_id,
          },
          function (err, res) {
            if (err) throw err;
            console.log(res.affectedRows + " employee removed!\n");
            // Return to main menu
            mainMenu();
          }
        );
      });
  });
}

function updateEmployeeRole() {
  // Prompt the user to select an employee to update
  connection.query("SELECT * FROM employees", function (err, results) {
    if (err) throw err;
    inquirer
      .prompt([
        {
          type: "list",
          name: "employee_id",
          message: "Select an employee to update:",
          choices: function () {
            // Map the results to an array of choices for the prompt
            return results.map(function (employee) {
              return {
                name: `${employee.first_name} ${employee.last_name}`,
                value: employee.id,
              };
            });
          },
        },
        {
          type: "input",
          name: "role_id",
          message: "Enter the employee's new role ID:",
        },
      ])
      .then(function (answer) {
        // Update the selected employee's role in the database
        connection.query(
          "UPDATE employees SET ? WHERE ?",
          [
            {
              role_id: answer.role_id,
            },
            {
              id: answer.employee_id,
            },
          ],
          function (err, res) {
            if (err) throw err;
            console.log(
              "*************************************************************************************************************"
            );
            console.log(res.affectedRows + " employee updated!\n");
            // Return to main menu
            mainMenu();
          }
        );
      });
  });
}

function updateEmployeeManager() {
  // Prompt the user to select an employee to update
  connection.query("SELECT * FROM employees", function (err, results) {
    if (err) throw err;
    inquirer
      .prompt([
        {
          type: "list",
          name: "employee_id",
          message: "Select an employee to update:",
          choices: function () {
            // Map the results to an array of choices for the prompt
            return results.map(function (employee) {
              return {
                name: `${employee.first_name} ${employee.last_name}`,
                value: employee.id,
              };
            });
          },
        },
        {
          type: "list",
          name: "manager_id",
          message: "Select the employee's new manager:",
          choices: function () {
            // Map the results to an array of choices for the prompt
            return results.map(function (employee) {
              return {
                name: `${employee.first_name} ${employee.last_name}`,
                value: employee.id,
              };
            });
          },
        },
      ])
      .then(function (answer) {
        // Update the selected employee's manager in the database
        connection.query(
          "UPDATE employees SET ? WHERE ?",
          [
            {
              manager_id: answer.manager_id,
            },
            {
              id: answer.employee_id,
            },
          ],
          function (err, res) {
            if (err) throw err;
            console.log(
              "*************************************************************************************************************"
            );
            console.log(res.affectedRows + " employee updated!\n");
            // Return to main menu
            mainMenu();
          }
        );
      });
  });
}

function viewAllRoles() {
  connection.query("SELECT * FROM roles", function (err, results) {
    if (err) throw err;
    if (results.length === 0) {
      console.log("No roles found.");
    } else {
      console.log("*************************************************************************************************************");
      console.log("Viewing all roles...\n")
      console.table(results);
    }
    // Return to main menu
    mainMenu();
  });
}

function addRole() {
  // Prompt the user for role information
  inquirer
    .prompt([
      {
        type: "input",
        name: "title",
        message: "Enter the role's title:",
      },
      {
        type: "input",
        name: "salary",
        message: "Enter the role's salary:",
      },
      {
        type: "input",
        name: "department_id",
        message: "Enter the role's department ID:",
      },
    ])
    .then(function (answer) {
      // Check that the department_id value exists in the departments table
      connection.query(
        "SELECT id FROM departments",
        function (err, res) {
          if (err) throw err;
          const departmentIds = res.map((department) => department.id);
          if (!departmentIds.includes(parseInt(answer.department_id))) {
            console.log(
              "*************************************************************************************************************"
            );
            console.log("Invalid department ID. Please try again.");
            console.log(
              "*************************************************************************************************************"
            );
            addRole();
          } else {
            // Insert the new role into the database
            connection.query(
              "INSERT INTO roles SET ?",
              {
                title: answer.title,
                salary: parseFloat(answer.salary),
                department_id: answer.department_id,
              },
              function (err, res) {
                if (err) throw err;
                console.log(
                  "*************************************************************************************************************"
                );
                console.log(res.affectedRows + " role added!\n");
                console.log(
                  "*************************************************************************************************************"
                );
                mainMenu();
              }
            );
          }
        }
      );
    });
}

function removeRole() {
  // Prompt the user to select a role to remove
  connection.query("SELECT * FROM roles", function (err, results) {
    if (err) throw err;
    inquirer
      .prompt([
        {
          type: "list",
          name: "role_id",
          message: "Select a role to remove:",
          choices: function () {
            // Map the results to an array of choices for the prompt
            return results.map(function (role) {
              return {
                name: role.title,
                value: role.id,
              };
            });
          },
        },
      ])
      .then(function (answer) {
        // Delete the selected role from the database
        connection.query(
          "DELETE FROM roles WHERE ?",
          {
            id: answer.role_id,
          },
          function (err, res) {
            if (err) throw err;
            console.log("*************************************************************************************************************");
            console.log(res.affectedRows + " role removed!\n");
            // Return to main menu
            mainMenu();
          }
        );
      });
  });
}

function viewAllDepartments() {
  connection.query("SELECT * FROM departments", function (err, results) {
    if (err) throw err;
    if (results.length === 0) {
      console.log("No departments found.");
    } else {
      console.log("*************************************************************************************************************");
      console.table(results);
    }
    // Return to main menu
    mainMenu();
  });
}

function addDepartment() {
  // Prompt the user for department information
  inquirer
    .prompt([
      {
        type: "input",
        name: "name",
        message: "Enter the department's name:",
      },
    ])
    .then(function (answer) {
      // Insert the new department into the database
      connection.query(
        "INSERT INTO departments SET ?",
        {
          name: answer.name,
        },
        function (err, res) {
          if (err) throw err;
          console.log("*************************************************************************************************************");
          console.log(res.affectedRows + " department added!\n");
          // Return to main menu
          mainMenu();
        }
      );
    });
}

function removeDepartment() {
  // Prompt the user to select a department to remove
  connection.query("SELECT * FROM departments", function (err, results) {
    if (err) throw err;
    inquirer
      .prompt([
        {
          type: "list",
          name: "department_id",
          message: "Select a department to remove:",
          choices: function () {
            // Map the results to an array of choices for the prompt
            return results.map(function (department) {
              return {
                name: department.name,
                value: department.id,
              };
            });
          },
        },
      ])
      .then(function (answer) {
        // Delete the selected department from the database
        connection.query(
          "DELETE FROM departments WHERE ?",
          {
            id: answer.department_id,
          },
          function (err, res) {
            if (err) throw err;
            console.log(
              "*************************************************************************************************************"
            );
            console.log(res.affectedRows + " department removed!\n");
            // Return to main menu
            mainMenu();
          }
        );
      });
  });
}
