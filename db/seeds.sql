INSERT INTO department (name)
VALUES ('Management'), ('Engineering'), ('Surveying'), ('Architecture');

INSERT INTO role (title, salary, department_id)
VALUES ('CEO', 1000000.00, 1),       -- id 1
       ('President', 500000.00, 1),  -- id 2
       ('Vice President', 250000.00, 1),  -- id 3
       ('Project Manager', 150000.00, 2), -- id 4
       ('Civil Engineer', 125000.00, 2),  -- id 5
       ('CAD Technician', 75000.00, 2),  -- id 6
       ('Survey Manager', 100000.00, 3),  -- id 7
       ('Party Chief', 75000.00, 3),  -- id 8
       ('Survey Technician', 50000.00, 3),  -- id 9
       ('Lead Architect', 150000.00, 4),  -- id 10
       ('Architect', 125000.00, 4),  -- id 11
       ('Intern Architect', 50000.00, 4);  -- id 12

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ('Dan', 'Name', 1, NULL),  -- id 1
       ('Jeff', 'Name', 2, 1),  --id 2
       ('Ed', 'Name', 3, 2),   -- id 3
       ('Grant', 'Name', 4, 3),  --id 4
       ('John', 'Name', 5, 4),   --id 5
       ('Jill', 'Name', 5, 4),  --id 6
       ('Joe', 'Name', 6, 5),  --id 7
       ('Tim', 'Name', 6, 6),  --id 8
       ('Steve', 'Name', 7, 3),  --id 9
       ('Eric', 'Name', 8, 9),  -- id 10
       ('Mike', 'Name', 8, 9),  --id 11
       ('Jesse', 'Name', 9, 10), --id 12
       ('Jenny', 'Name', 9, 11),  --id 13
       ('Jasmine', 'Name', 10, 3),  --id 14
       ('Jared', 'Name', 11, 14),  --id 15
       ('Ben', 'Name', 12, 15),  --id 16
       ('Jen', 'Name', 12, 15);  --id 17