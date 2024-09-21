import express from 'express';
import { QueryResult } from 'pg';
import { pool, connectToDb } from './connection.js';
import inquirer from 'inquirer';

await connectToDb();

interface DepartmentInput{
  name: string;
};

interface RoleInput{
  title: string;
  salary: number;
  department_id: number;
};

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
    console.log('\n---Departments---\n');
    console.table(result.rows);
    console.log('\n' + '-'.repeat(50) + '\n');
  });
};

// view all roles

const viewAllRoles = async () => {
  pool.query('SELECT * FROM role', (error: Error, result: QueryResult) => {
    if (error) {
      console.error('Error executing query', error);
      return;
    
    }
    console.log('\n---Departments---\n');
    console.table(result.rows);
    console.log('\n' + '-'.repeat(50) + '\n')
   
  });
};

// view all employees

const viewAllEmployees = async () => {
  pool.query('SELECT * FROM employee', (error: Error, result: QueryResult) => {
    if (error) {
      console.error('Error executing query', error);
      return;
    }
    console.log('\n---Departments---\n');
    console.table(result.rows);
    console.log('\n' + '-'.repeat(50) + '\n')
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
};
// get departments
const getDepartments = async (): Promise<{ id: number; name: string }[]> => {
  return new Promise((resolve, reject) => {
    pool.query('SELECT id, name FROM department', (error: Error, result: QueryResult) => {
      if (error) {
        reject(error);
        return;
      }
      resolve(result.rows);

    });
  });
};

//add a role
const addRole = async (role: RoleInput): Promise<void> => {
  const query = {
    text: 'INSERT INTO role (title, salary, department_id) VALUES ($1, $2, $3)',
    values: [role.title, role.salary, role.department_id],
  };
  try {
    await pool.query(query);
    console.log('Role added successfully');
  } catch (error) {
    console.error('Error executing query', error);
  }
};

const addRoleQuery = async (): Promise<void> => {
  try {
    const departments = await getDepartments();
    const departmentChoices = departments.map((department) => ({
      name: department.name,
      value: department.id,
    }));

  const answers = await inquirer.prompt<RoleInput>([
    {
      type: 'input',
      name: 'title',
      message: 'Enter the title of the role',
    },
    {
      type: 'number',
      name: 'salary',
      message: 'Enter the salary of the role',
    },
    {
      type: 'list',
      name: 'department_id',
      message: 'Select the department for the role',
      choices: departmentChoices,
    },
  ]);
  const { title, salary, department_id } = answers;
  await addRole({ title, salary, department_id });
} catch (error) {
  console.error('Error adding role', error);
} ;
}


//add an employee

//update an employee role




// inquirer
async function mainMenu() {
    const answers= await inquirer.prompt([
        {
          type: 'list',
          name: 'action',
          message: 'What would you like to do?',
          choices: ['View all departments', 'View all roles', 'View all employees', 'Add a department', "Add a role", ], //'Add a department', 'Add a role', 'Add an employee', 'Update an employee role'
        },
      ])
      
        if (answers.action === 'View all departments') {
           await viewAllDepartments();
        } else if (answers.action === 'View all roles') {
          await  viewAllRoles();
        } else if (answers.action === 'View all employees') {
          await  viewAllEmployees();
        } else if (answers.action === 'Add a department') {
         await addDeptQuery();
        } else if (answers.action === 'Add a role') {
          await addRoleQuery();
        }
        console.clear();
        await mainMenu();
      };
      
      
      
      mainMenu();





app.listen(PORT, () => {
  console.log(`\n Server running on port ${PORT}\n`);
}); 