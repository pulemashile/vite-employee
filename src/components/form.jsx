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
          setEditingEmployee(updatedEmployee); // Set the editing employee state
        } catch (error) {
          console.error("Error editing employee:", error);
        }
      };
    useEffect(() => {
        get_users();
    }, []);

    return (
        <div  className="grid grid-cols-12 gap-4 justify-center items-center">
            <div className="border border-gray-200 p-4 col-span-6 rounded-md bg-white shadow-lg justify-center ">
                <div className="justify-center">
                    <label className="font-sans font-medium">
                        Enter your name:
                        <input className="bg-gray border  border-gray shadow rounded-sm"
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </label>

                    <label>
                        Email address:
                        Enter your name:
                        <input className="bg-gray border  border-gray shadow rounded-sm"
                            type="text"
                            value={emailAddress}
                            onChange={(e) => setEmailAddress(e.target.value)}
                        />
                    </label>

                    <label>
                        Phone number:
                        
                        <input className="bg-gray border  border-gray shadow rounded-sm "
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
                        
                        <input className="bg-gray border  border-gray shadow rounded-sm "
                            type="text"
                            value={position}
                            onChange={(e) => setPosition(e.target.value)}
                        />
                    </label>

                    <label>
                        ID:
                        
                        <input className="bg-gray border  border-gray shadow rounded-sm " type="text" value={ID} onChange={(e) => setID(e.target.value)} />
                    </label>

                    <button className="bg-red-400 rounded-sm h-[40px] w-[70px] items-center mt-5" onClick={handleSubmits}>
                        Submit
                    </button>
                </div>
            </div>

            <div className="col-span-6 gap-4 mt-5 grid grid-cols-12">
                {employees.length === 0 ? (
                    <div>Loading...</div>
                ) : (
                    employees.map((employee) => (
                        <div key={employee.id} className="border-spacing-4 border-gray-200 shadow-xl   h-[200px] col-span-4">
                            <h1  className="text-2xl font-bold">{employee.name}</h1>

                            <h1 className="text-xl font-bold">{employee.phoneNumber}</h1>
                            <h1 className="text-xl font-bold">{employee.email}</h1>
                            <h1 className="text-xl font-mono">{employee.ID}</h1>
                            <h1 className=" text-xl font-mono">{employee.position}</h1>
                            <img src={employee.image} alt="" className="h-24 w-24 object-cover rounded-full" />
                            <button className=" bg-slate-400 hover:bg-slate-200 text-"
                                onClick={() => {
                                    setEditingEmployee(employee);
                                    setEditModalOpen(true);
                                }}
                            >
                              Edit
              </button>
              <button 
  className="bg-slate-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
  
  
                                onClick={async () => {
                                    try {
                                        await axios.delete(`http://localhost:8080/registrations/${employee.id}`);
                                        console.log("deleted");
                                        // Reload the page here to see the changes
                                        window.location.reload();
                                    } catch (error) {
                                        console.error("Error deleting employee:", error);
                                    }
                                }}
                            >
                                Delete
                            </button>

              {editModalOpen && editingEmployee.id === employee.id && (
                <div className="modal">
                  <div className="modal-content">
                    <h2>Edit Employee</h2>
                    <form>
                      <label>
                        Name:
                        <input
                          type="text"
                          value={editingEmployee.name}
                          onChange={(e) => setEditingEmployee({ ...editingEmployee, name: e.target.value })}
                        />
                      </label>
                      <label>
                        Email Address:
                        <input
                          type="text"
                          value={editingEmployee.emailAddress}
                          onChange={(e) => setEditingEmployee({ ...editingEmployee, emailAddress: e.target.value })}
                        />
                      </label>
                      <label>
                        Phone Number:
                        <input
                          type="text"
                          value={editingEmployee.phoneNumber}
                          onChange={(e) => setEditingEmployee({ ...editingEmployee, phoneNumber: e.target.value })}
                        />
                      </label>
                      <label>
                        Position:
                        <input
                          type="text"
                          value={editingEmployee.position}
                          onChange={(e) => setEditingEmployee({ ...editingEmployee, position: e.target.value })}
                        />
                      </label>
                      <label>
                        ID:
                        <input
                          type="text"
                          value={editingEmployee.ID}
                          onChange={(e) => setEditingEmployee({ ...editingEmployee, ID: e.target.value })}
                        />
                      </label>
                      <label>
                        Image:
                        <input
                          type="text"
                          value={editingEmployee.image}
                          onChange={(e) => setEditingEmployee({ ...editingEmployee, image: e.target.value })}
                        />
                      </label>
                      <button onClick={() => editEmployee(editingEmployee.id, editingEmployee)}>Save Changes</button>
                    </form>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      <div>
        {submittedData !== null && (
          <table className="border border-gray-300 rounded-lg w-1/4 flex flex-row shadow-md">
            <tr key="name" className="bg-gray-100">
              <th className="px-4 py-2 text-left">Name</th>
              <td className="px-4 py-2">{submittedData.name}</td>
            </tr>
            <tr key="email">
              <th className="px-4 py-2 text-left">Email</th>
              <td className="px-4 py-2">{submittedData.emailAddress}</td>
            </tr>
            <tr key="image">
              <th className="px-4 py-2 text-left">Image</th>
              <td className="px-4 py-2">
                <img
                  src={submittedData.image}
                  alt=""
                  style={{ height: "150px", objectFit: "cover", borderRadius: "10px" }}
                />
              </td>
            </tr>
          </table>
        )}
      </div>
    </div>
  );
}

export default Form;