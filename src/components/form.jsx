import React, { useState, useEffect } from "react";
import "./form.css";
import axios from "axios";

function Form() {
    const [name, setName] = useState("");
    const [emailAddress, setEmailAddress] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [image, setImage] = useState("");
    const [position, setPosition] = useState("");
    const [ID, setID] = useState("");
    const [submittedData, setSubmittedData] = useState(null);
    const [employees, setEmployees] = useState([]);
    const [editingEmployee, setEditingEmployee] = useState(null);
const [editModalOpen, setEditModalOpen] = useState(false)
    

    const handleSubmits = async () => {
        const employee = {
            name,
            emailAddress,
            phoneNumber,
            position,
            ID,
            image,
        };

        try {
            const response = await axios.post("http://localhost:8080/registrations", employee);
            const data = response.data;
            setSubmittedData(employee);
            console.log(data);
        } catch (error) {
            console.error("Error adding employee:", error);
        }
    };

    const get_users = async () => {
        try {
            const response = await axios.get("http://localhost:8080/registrations");
            const data = response.data;
            setEmployees(data);
        } catch (error) {
            console.error("Error fetching employees:", error);
        }
    };

    const editEmployee = async (employeeId, updatedEmployee) => {
        try {
            const response = await axios.put(`http://localhost:8080/registrations/${employeeId}`, updatedEmployee);
            const data = response.data;
            console.log(data);

            const updatedEmployees = employees.map((employee) => {
                if (employee.id === employeeId) {
                    return updatedEmployee;
                }
                return employee;
            });

            setEmployees(updatedEmployees);
        } catch (error) {
            console.error("Error editing employee:", error);
        }
    };

    useEffect(() => {
        get_users();
    }, []);

    return (
        <div style={{ display: "flex", justifyContent: "center", gap: "30px" }}>
            <div className="form-container">
                <div>
                    <label>
                        Enter your name:
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </label>

                    <label>
                        Email address:
                        <input
                            type="text"
                            value={emailAddress}
                            onChange={(e) => setEmailAddress(e.target.value)}
                        />
                    </label>

                    <label>
                        Phone number:
                        <input
                            type="text"
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                        />
                    </label>

                    <label>
                        Image:
                        <input
                            type="file"
                            onChange={(e) => setImage(URL.createObjectURL(e.target.files[0]))}
                        />
                    </label>

                    <label>
                        Employee position:
                        <input
                            type="text"
                            value={position}
                            onChange={(e) => setPosition(e.target.value)}
                        />
                    </label>

                    <label>
                        ID:
                        <input type="text" value={ID} onChange={(e) => setID(e.target.value)} />
                    </label>

                    <button className="btn-submit" onClick={handleSubmits}>
                        Submit
                    </button>
                </div>
            </div>

            <div style={{ display: "flex" }}>
                {employees.length === 0 ? (
                    <div>Loading...</div>
                ) : (
                    employees.map((employee) => (
                        <div key={employee.id} style={{ border: "2px solid black", borderRadius: "6px", width: "15vw", textAlign: "center" }}>
                            <h1>{employee.name}</h1>
                            <h1>{employee.phoneNumber}</h1>
                            <h1>{employee.email}</h1>
                            <h1>{employee.ID}</h1>
                            <h1>{employee.position}</h1>
                            <img src={employee.image} alt="" style={{ height: "150px", objectFit: "cover" }} />
                            <button
  onClick={() => {
    setEditingEmployee(employee);
    setEditModalOpen(true);
  }}
>
  Edit
</button> {editModalOpen && (
  <div className="modal">
    <div className="modal-content">
      <h2>Edit Employee</h2>
      <form>
        <label>
          Name:
          <input type="text" value={editingEmployee.name} onChange={(e) => setEditingEmployee({ ...editingEmployee, name: e.target.value })} />
        </label>
        <label>
          Email Address:
          <input type="text" value={editingEmployee.emailAddress} onChange={(e) => setEditingEmployee({ ...editingEmployee, emailAddress: e.target.value })} />
        </label>
        <label>
          Phone Number:
          <input type="text" value={editingEmployee.phoneNumber} onChange={(e) => setEditingEmployee({ ...editingEmployee, phoneNumber: e.target.value })} />
        </label>
        <label>
          Position:
          <input type="text" value={editingEmployee.position} onChange={(e) => setEditingEmployee({ ...editingEmployee, position: e.target.value })} />
        </label>
        <label>
          ID:
          <input type="text" value={editingEmployee.ID} onChange={(e) => setEditingEmployee({ ...editingEmployee, ID: e.target.value })} />
        </label>
        <label>
          Image:
          <input type="text" value={editingEmployee.image} onChange={(e) => setEditingEmployee({ ...editingEmployee, image: e.target.value })} />
        </label>
        <button onClick={() => editEmployee(editingEmployee.id, editingEmployee)}>Save Changes</button>
      </form>
    </div>
  </div>
)}


                            <button
                                onClick={async () => {
                                    console.log(employee.id);
                                    try {
                                        await axios.delete(`http://localhost:8080/registrations/${employee.id}`);
                                        console.log("deleted");
                                    } catch (error) {
                                        console.error("Error deleting employee:", error);
                                    }
                                }}
                            >
                                Delete
                            </button>
                        </div>
                    ))
                )}
            </div>

            {submittedData !== null && (
                <table style={{ border: "2px solid black", borderRadius: "6px", width: "15vw" }}>
                    <tr key="name">
                        <th>Name</th>
                        <td>{submittedData.name}</td>
                    </tr>
                    <tr key="email">
                        <th>Email</th>
                        <td>{submittedData.emailAddress}</td>
          </tr>
          <tr key="image">
            <th>Image</th>
            <td>
              <img src={submittedData.image} alt="" style={{ height: "150px", objectFit: "cover" }} />
            </td>
          </tr>
        </table>
      )}
    </div>
  );
}

export default Form;