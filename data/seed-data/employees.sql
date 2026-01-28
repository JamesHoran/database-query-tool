-- Employees database for Day 1-2 challenges
DROP TABLE IF EXISTS employees;

CREATE TABLE employees (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  department TEXT NOT NULL,
  salary INTEGER NOT NULL,
  hire_date TEXT
);

INSERT INTO employees VALUES
  (1, 'John Smith', 'Engineering', 95000, '2020-01-15'),
  (2, 'Jane Doe', 'Marketing', 75000, '2019-03-20'),
  (3, 'Bob Johnson', 'Sales', 85000, '2021-06-10'),
  (4, 'Alice Williams', 'Engineering', 110000, '2018-11-05'),
  (5, 'Charlie Brown', 'Marketing', 68000, '2022-02-28'),
  (6, 'Diana Ross', 'Sales', 92000, '2019-09-15'),
  (7, 'Edward Chen', 'Engineering', 125000, '2017-04-01'),
  (8, 'Fiona Garcia', 'HR', 65000, '2020-07-20'),
  (9, 'George Miller', 'Sales', 78000, '2021-01-10'),
  (10, 'Hannah Lee', 'Engineering', 105000, '2019-12-01');
