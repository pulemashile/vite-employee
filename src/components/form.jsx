import React, { useState, useEffect } from "react";
import "./form.css";
import axios from "axios";
import { RiSave2Fill, RiSearchEyeLine, RiDeleteBin2Line, RiEdit2Line } from '@remixicon/react';

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
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [errors, setErrors] = useState({}); // State for holding validation errors

    const handleSubmits = async () => {
        const employee = { name, emailAddress, phoneNumber, position, ID, image };
        const validationErrors = validateInputs(employee);

        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return; // Stop submission if there are validation errors
        }

        try {
            const response = await axios.post("http://localhost:8080/registrations", employee);
            const data = response.data;
            setSubmittedData(employee);
            console.log(data);
            clearForm(); // Clear form after successful submission
        } catch (error) {
            console.error("Error adding employee:", error);
        }
    };

    const validateInputs = (employee) => {
        const errors = {};
        if (!employee.name) errors.name = "Name is required.";
        if (!employee.emailAddress) errors.emailAddress = "Email is required.";
        if (!/\S+@\S+\.\S+/.test(employee.emailAddress)) errors.emailAddress = "Email is invalid.";
        if (!employee.phoneNumber) errors.phoneNumber = "Phone number is required.";
        if (!employee.position) errors.position = "Position is required.";
        if (!employee.ID) errors.ID = "ID is required.";
        return errors;
    };

    const clearForm = () => {
        setName("");
        setEmailAddress("");
        setPhoneNumber("");
        setImage("");
        setPosition("");
        setID("");
        setErrors({}); // Clear errors on form reset
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

            const updatedEmployees = employees.map((employee) => 
                employee.id === employeeId ? updatedEmployee : employee
            );
            setEmployees(updatedEmployees);
            setEditingEmployee(updatedEmployee);
        } catch (error) {
            console.error("Error editing employee:", error);
        }
    };

    useEffect(() => {
        get_users();
    }, []);

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 justify-center items-center">
            <div className="border border-gray-200 p-4 col-span-6 rounded-md bg-white shadow-lg md:w-1/2 lg:w-1/3">
                <div className="justify-center">
                    <label className="font-sans font-medium">
                        Enter your name:
                        <input className="bg-gray border border-gray shadow rounded-sm"
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                        {errors.name && <span className="text-red-500">{errors.name}</span>}
                    </label>

                    <label>
                        Email address:
                        <input className="bg-gray border border-gray shadow rounded-sm"
                            type="text"
                            value={emailAddress}
                            onChange={(e) => setEmailAddress(e.target.value)}
                        />
                        {errors.emailAddress && <span className="text-red-500">{errors.emailAddress}</span>}
                    </label>

                    <label>
                        Phone number:
                        <input className="bg-gray border border-gray shadow rounded-sm"
                            type="text"
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                        />
                        {errors.phoneNumber && <span className="text-red-500">{errors.phoneNumber}</span>}
                    </label>

                    <label>
                        Image:
                        <input type="file" onChange={(e) => setImage(URL.createObjectURL(e.target.files[0]))} />
                    </label>

                    <label>
                        Employee position:
                        <input className="bg-gray border border-gray shadow rounded-sm"
                            type="text"
                            value={position}
                            onChange={(e) => setPosition(e.target.value)}
                        />
                        {errors.position && <span className="text-red-500">{errors.position}</span>}
                    </label>

                    <label>
                        ID:
                        <input className="bg-gray border border-gray shadow rounded-sm"
                            type="text"
                            value={ID}
                            onChange={(e) => setID(e.target.value)}
                        />
                        {errors.ID && <span className="text-red-500">{errors.ID}</span>}
                    </label>

                    <button className="bg-[#B8001F] rounded-lg h-[40px] w-[350px] items-center mt-5" onClick={handleSubmits}>
                        Submit
                    </button>
                </div>
            </div>

            <div className="col-span-1 md:col-span-2 lg:col-span-3 gap-4 mt-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                {employees.length === 0 ? (
                    <div>Loading...</div>
                ) : (
                    employees.map((employee) => (
                        <div key={employee.id} className="border-spacing-4 border-gray-200 shadow-xl h-[300px] md:h-[250px] lg:h-[250px] col-span-1 md:col-span-1 lg:col-span-1">
                            <div className="bg-[#B8001F]"></div>
                            <img src={employee.image} alt="image" className="h-24 w-24 object-cover rounded-full bg-[#B8001F] mx-auto my-auto" />
                            <h1 className="text-xl font-bold text-center">{employee.name}</h1>
                            <h1 className="text-xl font-bold text-center text-[#507687] font-custom-font">{employee.phoneNumber}</h1>
                            <h1 className="text-xl font-bold text-center text-[#507687] font-custom-font">{employee.email}</h1>
                            <h1 className="text-xl font-bold text-center text-[#507687] font-custom-font">{employee.ID}</h1>
                            <h1 className="text-xl font-bold text-center text-[#507687] font-custom-font">{employee.position}</h1>
                            
                            <button className="shadow-sm hover:bg-red-100 px-4 py-2 mr-2 rounded-sm"
                                onClick={() => {
                                    setEditingEmployee(employee);
                                    setEditModalOpen(true);
                                }}
                            >
                                <RiEdit2Line />
                            </button>
                            <button className="shadow-sm font-bold py-2 px-4 rounded"
                                onClick={async () => {
                                    try {
                                        await axios.delete(`http://localhost:8080/registrations/${employee.id}`);
                                        console.log("deleted");
                                        window.location.reload();
                                    } catch (error) {
                                        console.error("Error deleting employee:", error);
                                    }
                                }}
                            >
                                <RiDeleteBin2Line />
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
                                            <button 
                                                type="button" 
                                                onClick={() => {
                                                    editEmployee(editingEmployee.id, editingEmployee);
                                                    setEditModalOpen(false); 
                                                }}>
                                                Save Changes
                                            </button>
                                            <button 
                                                type="button" 
                                                onClick={() => setEditModalOpen(false)}>
                                                Cancel
                                            </button>
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
                    <table className="border border-gray-300 rounded-lg w-full md:w-1/2 lg:w-1/3 flex flex-row shadow-md">
                        <tbody>
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
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}

export default Form;

