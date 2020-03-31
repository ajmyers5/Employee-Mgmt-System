const mysql = require("mysql");
const inquirer = require("inquirer");
const cTable = require("console.table");

const connection = mysql.createConnection({
    host: "localhost",
    port: 3306, 
    user: "root", 
    password: "yourRootPassword",
    database: "employees_db"
});

connection.connect(function(err){
    if (err) throw err;
    initialSearch();

});

function initialSearch(){
    inquirer
    .prompt({
        name: "action",
        type: "list",
        message: "what would you like to do?", 
        choices: [
            "View All Employees",
            "View All Departments",
            "View All Roles",
            "Add Employee",
            "Add Department",
            "Add Role",
            "Update Employee Role"
        ]
    }).then(response => {
        switch (response.action){
            case "View All Employees":
                viewAllEmployees();
                break;
            case "View All Departments":
                viewAllDepartments();
                break;
            case "View All Roles":
                viewAllRoles();
                break;
            case "Add Employee":
                addEmployee();
                break;
            case "Add Department":
                addDepartment();
                break;
            case "Add Role":
                addRole();
                break;
            case "Update Employee Role":
                updateEmpmloyee();
                break;


                    
        }
    });
}

function viewAllEmployees() {
    const query = `
    SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department, role.salary
    FROM employee
    INNER JOIN role ON employee.role_id = role.id
    INNER JOIN department ON role.department_id = department.id;
    `;
    connection.query(query, (err, res) => {
        if (err) throw err;
        console.table("ALL EMPLOYEES", res);
        initialSearch();

    });
}

function viewAllDepartments(){
    const query = `
    SELECT name AS Departments
    FROM department;
    `;
    connection.query(query, (err, res) => {
        if (err) throw err;
        console.table("ALL DEPARTMENTS", res);
        initialSearch();
    });


}

function viewAllRoles() {
    const query = `
    SELECT title, salary
    FROM role;
    `;
    connection.query(query, (err, res) => {
      if (err) throw err;
      console.table("ALL ROLES", res);
      runSearch();
    });

  }

  function addEmployee(){
      connection.query("SELECT * FROM role", (err, result) => {
          inquirer.prompt([{
              name: "first_name", 
              type: "input",
              message: "what is the employee's first name?",
              validate: input => {
                  if (input !== "" && input != null){
                      return true;
                  } else {
                      return "First name cannot be blank";
                  }
              }
          },
          {
              name: "last_name",
              type: "input",
              message: "What is the emplyee's last name?",
              validate: input => {
                  if (input !== "" && input != null){
                      return true;
                  } else{
                      return "Last name cannot be blank";
                  }
              }
          },
          {
              name: "role",
              type: "list",
              message: "what's the employees role",
              choices: function(){
                  var rolesArr = [];
                  for (let i = 0; i< result.length; i++){
                      rolesArr.push(result[i].title);
                  }
                  return rolesArr;
              }
          }
        
        ]).then(response =>{
            let chosenItem;
            for (let i = 0; i < result.length; i++){
                if (result[i].title === response.role) {
                    chosenItem = result[i];
                }
            }

        connection.query(
            "INSERT INTO employee SET?",
            {
                first_name: response.first_name,
                last_name: response.last_name,
                role_id: chosenItem.id,
                manager_id: null
            },
            (err, res) => {
                if (err) throw err;
                console.log("Empl Added");
                initialSearch();
            }
        );
        });
      });
  }

  function addDepartment (){
      inquirer.prompt([
          {
            name: "department_name",
            type: "input",
            message: "wht is the department name?",
            validate: input => {
                if (input !== "" && input != null) {
                    return true;
                } else {
                    return "Dept name cannot be blank";
                }
            }
      }
    ]).then(response => {
        connection.query(
            "INSERT INTO department SET ?",
            {
                name: response.department_name
            },
            (err, res) => {
                if (err) throw err;
                console.log("Dept added");
                initialSearch();
            }
        );
    });
  }
  
  function addRole() {
      connection.query("SELECT * FROM department", (err, result) =>{
          if (err) throw err;
          inquirer.prompt([
              {
                  name: "role_title",
                  type: "input", 
                  message: "what is the role name?",
                  validate: input => {
                      if (input !== "" && input != null){
                          return true;
                      } else {
                          return "Role name cannot be blank";
                      }
                  }
              },
              {
                  name: "salary",
                  type: "input",
                  message: "how much is the salary?",
                  validate: input => {
                      if (input !== "" && input != null && !isNaN(input)){
                          return true;
                      } else {
                          return "Salary cannot be blank and should be a number";
                      }
                  }
              },
              {
                  name: "department", 
                  type: "list",
                  message: "What's the role's department?",
                  choices: function (){
                      var deptArray = [];
                      for (let i = 0; i< result.length; i++){
                          deptArray.push(result[i].name);
                      }
                      return deptArray;
                  }
              }
          ]).then(response => {
              let chosenItem;
              for (let i = 0; i < result.length; i++){
                  if (result[i].name === response.department){
                      chosenItem = result[i];
                  }
              }
              connection.query(
                  "INSERT INTO role SET ?",
                  {
                      title: response.role_title,
                      salary: response.salary,
                      department_id: chosenItem.id
                  },
                  (err, res) => {
                      if (err) throw err;
                      console.log("Role added");
                      initialSearch();
                  }
              );
          });
      }
      );
  }

  function updateEmployee() {
      connection.query("SELECT * FROM employee", (err, result) => {
          connection.query("SELECT * FROM role", (err, result2) => {
              if (err) throw err;
              inquirer.prompt([
                  {
                      name: "employee",
                      type: "list", 
                      message: "Select employee to update",
                      choices: function () {
                          const employeesArray = [];
                          result.forEach(employee => {
                              employeesArray.push(
                                  `${employee.first_name} ${employee.last_name}`
                              );
                          });
                          return employeesArray;
                      }
                  },
                  {
                      name: "role",
                      type: "list",
                      message: "What is the user's new role?",
                      choices: function () {
                          var rolesArr = [];
                          for (let i = 0; i < result2.length; i++) {
                              rolesArr.push(result2[i].title);

                          }
                          return rolesArr;
                      }
                  }
              ]).then(response => {
                  for (let i = 0; i< result2.length; i++){
                      if (result2[i].title === response.role){
                          chosenItem = result2[i];
                      }
                  }
                  const employee_name = response.employee;
                  const employeeArr = employee_name.split(" ");
                  connection.query(
                      `UPDATE employee SET ? WHERE first_name - '${employeeArr[0]}' AND last_name = '${employeeArr[1]}'`,
                      [{ role_id: chosenItem.id}],
                      (err, result) => {
                          if (err) throw err;
                          console.log(`Succesful Update of ${response.employee}'s role.`);
                      }
                  );
              });
          });
      });
  }