// EmployeeList.js
import React from 'react';
import EmployeeCard from '../components/Employee.card';

const EmployeeList = ({ employees }) => {
  return (
    <div className="employee-list">
      {employees.map((employee) => (
        <EmployeeCard key={employee.id} employee={employee} />
      ))}
    </div>
  );
};

export default EmployeeList;