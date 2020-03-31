USE employees_DB;


INSERT INTO department (name)
VALUES ("Sales"), ("Engineering"), ("Design"), ("HR");


INSERT INTO role (title, salary, department_id)
VALUES ("Sales Person", 200000, 1);

INSERT INTO role (title, salary, department_id)
VALUES ("Software Engineer", 200000, 2);

INSERT INTO role (title, salary, department_id)
VALUES ("Designer", 200000, 3);

INSERT INTO role (title, salary, department_id)
VALUES ("Chief Collaboration Officer", 200000, 4);


INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("John", "Myers", 1, null);

INSERT INTO employee(first_name, last_name, role_id, manager_id)
VALUES ("Jane", "Myers", 1, null);

INSERT INTO employee(first_name, last_name, role_id, manager_id)
VALUES ("Sally", "Myers", 2, null);

INSERT INTO employee(first_name, last_name, role_id, manager_id)
VALUES ("Tom", "Myers", 3, null);