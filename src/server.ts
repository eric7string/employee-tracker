import express from 'express';
import { QueryResult } from 'pg';
import { pool, connectToDb } from './connection.js';
import inquirer from 'inquirer';

await connectToDb();

interface DepartmentInput {
  name: string;
};

interface RoleInput {
  title: string;
  salary: number;
  department_id: number;
};

interface EmployeeInput {
  first_name: string;
  last_name: string;
  role_id: number;
  manager_id: number | null;
};

const PORT = 3001;
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const clearScreen = () => {
  process.stdout.write('\x1Bc');
};

const viewAllDepartments = async () => {
  const result: QueryResult = await pool.query('SELECT id, name FROM department');
  clearScreen();
  console.log('\n--- Departments ---\n');
  console.table(result.rows);
  console.log('\n' + '-'.repeat(50) + '\n');
  await inquirer.prompt([{ type: 'input', name: 'continue', message: 'Press ENTER to return to the main menu' }]);
};

const viewAllRoles = async () => {
  const result: QueryResult = await pool.query('SELECT * FROM role');
  clearScreen();
  console.log('\n--- Roles ---\n');
  console.table(result.rows);
  console.log('\n' + '-'.repeat(50) + '\n');
  await inquirer.prompt([{ type: 'input', name: 'continue', message: 'Press ENTER to return to the main menu' }]);
};

const viewAllEmployees = async () => {
  const result: QueryResult = await pool.query('SELECT * FROM employee');
  clearScreen();
  console.log('\n--- Employees ---\n');
  console.table(result.rows);
  console.log('\n' + '-'.repeat(50) + '\n');
  await inquirer.prompt([{ type: 'input', name: 'continue', message: 'Press ENTER to return to the main menu' }]);
};

const addDeptQuery = async () => {
  const answers = await inquirer.prompt<DepartmentInput>([
    {
      type: 'input',
      name: 'name',
      message: 'Enter the name of the department',
    },
  ]);
  const { name } = answers;
  await pool.query('INSERT INTO department (name) VALUES ($1)', [name]);
  console.log('Department added successfully');
  await inquirer.prompt([{ type: 'input', name: 'continue', message: 'Press ENTER to return to the main menu' }]);
};

const addRoleQuery = async () => {
  const departments: QueryResult = await pool.query('SELECT id, name FROM department');
  const departmentChoices = departments.rows.map((department) => ({
    name: department.name,
    value: department.id,
  }));
  
  const answers = await inquirer.prompt<RoleInput>([
    { type: 'input', name: 'title', message: 'Enter the title of the role' },
    { type: 'number', name: 'salary', message: 'Enter the salary of the role' },
    { type: 'list', name: 'department_id', message: 'Select the department for the role', choices: departmentChoices },
  ]);
  
  const { title, salary, department_id } = answers;
  await pool.query('INSERT INTO role (title, salary, department_id) VALUES ($1, $2, $3)', [title, salary, department_id]);
  console.log('Role added successfully');
  await inquirer.prompt([{ type: 'input', name: 'continue', message: 'Press ENTER to return to the main menu' }]);
};

const addEmployeeQuery = async () => {
  const roles: QueryResult = await pool.query('SELECT id, title FROM role');
  const employees: QueryResult = await pool.query('SELECT id, CONCAT(first_name, \' \', last_name) AS name FROM employee');
  
  const roleChoices = roles.rows.map((role) => ({
    name: role.title,
    value: role.id,
  }));

  const managerChoices = employees.rows.map((employee) => ({
    name: employee.name,
    value: employee.id,
  }));
  
  managerChoices.unshift({ name: 'None', value: null });

  const answers = await inquirer.prompt<EmployeeInput>([
    { type: 'input', name: 'first_name', message: 'Enter the first name of the employee' },
    { type: 'input', name: 'last_name', message: 'Enter the last name of the employee' },
    { type: 'list', name: 'role_id', message: 'Select the role of the employee', choices: roleChoices },
    { type: 'list', name: 'manager_id', message: 'Select the manager of the employee', choices: managerChoices },
  ]);

  await pool.query(
    'INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ($1, $2, $3, $4)',
    [answers.first_name, answers.last_name, answers.role_id, answers.manager_id]
  );

  console.log('Employee added successfully');
  await inquirer.prompt([{ type: 'input', name: 'continue', message: 'Press ENTER to return to the main menu' }]);
};

const updateEmployeeRoleQuery = async () => {
  const employees: QueryResult = await pool.query('SELECT id, CONCAT(first_name, \' \', last_name) AS name FROM employee');
  const roles: QueryResult = await pool.query('SELECT id, title FROM role');
  
  const employeeChoices = employees.rows.map((employee) => ({
    name: employee.name,
    value: employee.id,
  }));

  const roleChoices = roles.rows.map((role) => ({
    name: role.title,
    value: role.id,
  }));

  const employeeAnswer = await inquirer.prompt([
    { type: 'list', name: 'employee_id', message: 'Select the employee whose role you want to update', choices: employeeChoices },
  ]);

  const roleAnswer = await inquirer.prompt([
    { type: 'list', name: 'role_id', message: 'Select the new role for the employee', choices: roleChoices },
  ]);

  await pool.query('UPDATE employee SET role_id = $1 WHERE id = $2', [roleAnswer.role_id, employeeAnswer.employee_id]);

  console.log('Employee role updated successfully');
  await inquirer.prompt([{ type: 'input', name: 'continue', message: 'Press ENTER to return to the main menu' }]);
};

async function mainMenu() {
  clearScreen();

  const answers = await inquirer.prompt([
    {
      type: 'list',
      name: 'action',
      message: 'What would you like to do?',
      choices: [
        'View all departments',
        'View all roles',
        'View all employees',
        'Add a department',
        'Add a role',
        'Add an employee',
        'Update an employee role',
        'Exit',
      ],
    },
  ]);

  switch (answers.action) {
    case 'View all departments':
      await viewAllDepartments();
      break;
    case 'View all roles':
      await viewAllRoles();
      break;
    case 'View all employees':
      await viewAllEmployees();
      break;
    case 'Add a department':
      await addDeptQuery();
      break;
    case 'Add a role':
      await addRoleQuery();
      break;
    case 'Add an employee':
      await addEmployeeQuery();
      break;
    case 'Update an employee role':
      await updateEmployeeRoleQuery();
      break;
    case 'Exit':
      clearScreen();
      console.log('Goodbye!');
      process.exit(0);
  }

  await mainMenu();
}

mainMenu();

app.listen(PORT, () => {
  console.log(`\n Employee Tracker Database\n`);
});
