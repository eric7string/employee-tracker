import express from 'express';
import { QueryResult } from 'pg';
import { pool, connectToDb } from './connection.js';
import inquirer from 'inquirer';

await connectToDb();

interface DepartmentInput{
  name: string;
}

const PORT = 3001;
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// services


// view all departments
const viewAllDepartments = async () => {
  pool.query('SELECT id, name FROM department', (error: Error, result: QueryResult) => {
    if (error) {
      console.error('Error executing query', error);
      return;
    }
    console.table(result.rows);
  });
};

// view all roles

const viewAllRoles = async () => {
  pool.query('SELECT * FROM role', (error: Error, result: QueryResult) => {
    if (error) {
      console.error('Error executing query', error);
      return;
    }
    console.table(result.rows);
  });
};

// view all employees

const viewAllEmployees = async () => {
  pool.query('SELECT * FROM department', (error: Error, result: QueryResult) => {
    if (error) {
      console.error('Error executing query', error);
      return;
    }
    console.table(result.rows);
  });
}
//add a department
const addDepartment = async (department: DepartmentInput): Promise<void> => {
  const query = {
    text: 'INSERT INTO department (name) VALUES ($1)',
    values: [department.name],
  };
  try {
    await pool.query(query);
    console.log('Department added successfully');
  } catch (error) {
    console.error('Error executing query', error);
  }
};
//add a role

//add an employee

//update an employee role
const addDeptQuery = async (): Promise<void> => {
 const answers = await inquirer.prompt<DepartmentInput>([
    {
      type: 'input',
      name: 'name',
      message: 'Enter the name of the department',
    },
  ]);
  const { name } = answers;
  await addDepartment({ name });
}





// inquirer
inquirer
  .prompt([
    {
      type: 'list',
      name: 'action',
      message: 'What would you like to do?',
      choices: ['View all departments', 'View all roles', 'View all employees', 'Add a department' ], //'Add a department', 'Add a role', 'Add an employee', 'Update an employee role'
    },
  ])
  .then((answers) => {
    if (answers.action === 'View all departments') {
        viewAllDepartments();
        return;
    } else if (answers.action === 'View all roles') {
        viewAllRoles();
        return;
    } else if (answers.action === 'View all employees') {
        viewAllEmployees();
        return;
    } else if (answers.action === 'Add a department') {
      addDeptQuery();
      return;
    }
  });









app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});