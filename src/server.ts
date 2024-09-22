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
    console.log('Press ENTER key to return to the main menu');
  });
};

// view all roles

const viewAllRoles = async () => {
  pool.query('SELECT * FROM role', (error: Error, result: QueryResult) => {
    if (error) {
      console.error('Error executing query', error);
      return;
    
    }
    console.log('\n---Roles---\n');
    console.table(result.rows);
    console.log('\n' + '-'.repeat(50) + '\n');
    console.log('Press ENTER key to return to the main menu');
   
  });
};

// view all employees

const viewAllEmployees = async () => {
  pool.query('SELECT * FROM employee', (error: Error, result: QueryResult) => {
    if (error) {
      console.error('Error executing query', error);
      return;
    }
    console.log('\n---Employees---\n');
    console.table(result.rows);
    console.log('\n' + '-'.repeat(50) + '\n');
    console.log('Press ENTER key to return to the main menu');
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

// Fetch all roles from the database
const getRoles = async (): Promise<{ id: number, title: string }[]> => {
  return new Promise((resolve, reject) => {
    pool.query('SELECT id, title FROM role', (error: Error, result: QueryResult) => {
      if (error) {
        console.error('Error executing query', error);
        reject(error);
      } else {
        resolve(result.rows); // Return an array of { id, title }
      }
    });
  });
};

// Fetch all employees from the database (to be used as managers)
const getEmployees = async (): Promise<{ id: number | null; name: string }[]> => {
  return new Promise((resolve, reject) => {
    pool.query(`SELECT id, CONCAT(first_name, ' ', last_name) AS name FROM employee`, (error: Error, result: QueryResult) => {
      if (error) {
        console.error('Error executing query', error);
        reject(error);
      } else {
        resolve(result.rows); // Return an array of { id, name }
      }
    });
  });
};

const addEmployee = async (employee: {
  first_name: string; 
  last_name: string; 
  role_id: number; 
  manager_id: number | null; // Explicitly allow null
}): Promise<void> => {
  const query = {
    text: 'INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ($1, $2, $3, $4)',
    values: [employee.first_name, employee.last_name, employee.role_id, employee.manager_id],
  };
  try {
    await pool.query(query);
    console.log('Employee added successfully');
  } catch (error) {
    console.error('Error executing query', error);
  }
};






// Function to add an employee with role and manager selection

// Function to add an employee with role and manager selection
const addEmployeeQuery = async (): Promise<void> => {
  try {
    console.log('Entering addEmployeeQuery'); // Debugging log
    const roles = await getRoles();
    

    const employees = await getEmployees();
    console.log('Fetched Employees:', employees); // Debugging log

    const roleChoices = roles.map(role => ({
      name: role.title,
      value: role.id,
    }));

    const managerChoices: { name: string; value: number | null }[] = employees.map(employee => ({
      name: employee.name,
      value: employee.id,
    }));

    // Add an option for "No Manager"
    managerChoices.unshift({ name: 'None', value: null });

    // Prompt for employee details
    const answers = await inquirer.prompt([
      {
        type: 'input',
        name: 'first_name',
        message: 'Enter the first name of the employee',
      },
      {
        type: 'input',
        name: 'last_name',
        message: 'Enter the last name of the employee',
      },
      {
        type: 'list',
        name: 'role_id',
        message: 'Select the role of the employee',
        choices: roleChoices,
      },
      {
        type: 'list',
        name: 'manager_id',
        message: 'Select the manager of the employee',
        choices: managerChoices,
      },
    ]);

    await addEmployee({
      first_name: answers.first_name,
      last_name: answers.last_name,
      role_id: answers.role_id,
      manager_id: answers.manager_id,
    });

  } catch (error) {
    console.error('Error in addEmployeeQuery:', error);
  }
};


//update an employee role
// Function to update an employee's role
const updateEmployeeRole = async (employeeId: number, roleId: number): Promise<void> => {
  const query = {
    text: 'UPDATE employee SET role_id = $1 WHERE id = $2',
    values: [roleId, employeeId],
  };
  try {
    await pool.query(query);
    console.log('Employee role updated successfully');
  } catch (error) {
    console.error('Error updating employee role', error);
  }
};

// Function to handle the update role process
const updateEmployeeRoleQuery = async (): Promise<void> => {
  try {
    // Fetch all employees
    const employees = await getEmployees();
    
    // Generate employee choices for inquirer
    const employeeChoices = employees.map(employee => ({
      name: employee.name,
      value: employee.id,
    }));

    // Fetch all roles
    const roles = await getRoles();

    // Generate role choices for inquirer
    const roleChoices = roles.map(role => ({
      name: role.title,
      value: role.id,
    }));

    // Prompt the user to select an employee
    const employeeAnswer = await inquirer.prompt([
      {
        type: 'list',
        name: 'employee_id',
        message: 'Select the employee whose role you want to update',
        choices: employeeChoices,
      },
    ]);

    // Prompt the user to select a new role
    const roleAnswer = await inquirer.prompt([
      {
        type: 'list',
        name: 'role_id',
        message: 'Select the new role for the employee',
        choices: roleChoices,
      },
    ]);

    // Update the employee's role in the database
    await updateEmployeeRole(employeeAnswer.employee_id, roleAnswer.role_id);
  } catch (error) {
    console.error('Error updating employee role:', error);
  }
};




// inquirer
async function mainMenu() {
  console.clear(); // **Change 1: Clear the console before showing the new prompt**
  
  const answers = await inquirer.prompt([
    {
      type: 'list',
      name: 'action',
      message: 'What would you like to do?',
      choices: ['View all departments', 'View all roles', 'View all employees', 'Add a department', 'Add a role', 'Add an employee', "Update an employee role"], // 'Update an employee role'
    },
  ]);

      // Perform actions based on user selection
      if (answers.action === 'View all departments') {
        await viewAllDepartments();
      } else if (answers.action === 'View all roles') {
        await viewAllRoles();
      } else if (answers.action === 'View all employees') {
        await viewAllEmployees();
      } else if (answers.action === 'Add a department') {
        await addDeptQuery();
      } else if (answers.action === 'Add a role') {
        await addRoleQuery();
      } else if (answers.action === 'Add an employee') {
        await addEmployeeQuery();
      } else if (answers.action === 'Update an employee role') {
        await updateEmployeeRoleQuery();
      }

      // **Change 2: Add a prompt to pause after displaying results**
      // Wait for the user to see the results before continuing
      console.log("\nPress any key to return to the main menu...");
      await inquirer.prompt([{ type: 'input', name: 'continue', message: '' }]);

      await mainMenu(); // Recursively call main menu to show options again
    }

      
      console.clear();
      mainMenu();





app.listen(PORT, () => {
  console.log(`\n Server running on port ${PORT}\n`);
}); 