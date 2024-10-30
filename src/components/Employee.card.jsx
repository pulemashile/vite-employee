
import React from 'react';

const EmployeeCard = ({ employee }) => {
  return (
    <div className="employee-card">
      <h1>{employee.name}</h1>
      <h1>{employee.phoneNumber}</h1>
      <h1>{employee.email}</h1>
      <h1>{employee.ID}</h1>
      <h1>{employee.position}</h1>
      <img src={employee.image} alt="" style={{ height: "150px", objectFit: "cover" }} />
      <button onClick={() => editEmployee(employee.id, employee)}>Edit</button>
      <button onClick={async () => {
        try {
          await axios.delete(`http://localhost:8081/registrations/${employee.id}`);
          console.log("deleted");
        } catch (error) {
          console.error("Error deleting employee:", error);
        }
      }}>Delete</button>
    </div>
  );
};

export default EmployeeCard;