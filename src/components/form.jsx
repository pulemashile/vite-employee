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
    const [errors, setErrors] = useState({});

    const handleSubmits = async () => {
        const employee = { name, emailAddress, phoneNumber, position, ID, image };
        const validationErrors = validateInputs(employee);

        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        try {
            const response = await axios.post("http://localhost:8081/registrations", employee);
            setSubmittedData(response.data);
            clearForm();
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
        setErrors({});
    };

    const get_users = async () => {
        try {
            const response = await axios.get("http://localhost:8081/registrations");
            setEmployees(response.data);
        } catch (error) {
            console.error("Error fetching employees:", error);
        }
    };

    const editEmployee = async (employeeId, updatedEmployee) => {
        try {
            await axios.put(`http://localhost:8081/registrations/${employeeId}`, updatedEmployee);
            const updatedEmployees = employees.map(employee =>
                employee.id === employeeId ? updatedEmployee : employee
            );
            setEmployees(updatedEmployees);
            setEditingEmployee(updatedEmployee);
        } catch (error) {
            console.error("Error editing employee:", error);
        }
    };

    const deleteEmployee = async (employeeId) => {
        try {
            await axios.delete(`http://localhost:8081/registrations/${employeeId}`);
            setEmployees(employees.filter(employee => employee.id !== employeeId));
        } catch (error) {
            console.error("Error deleting employee:", error);
        }
    };

    useEffect(() => {
        get_users();
    }, []);

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 justify-center items-center">
            <div className="border border-gray-200 p-4 col-span-6 rounded-md bg-white shadow-lg md:w-1/2 lg:w-1/3">
                <div className="justify-center">
                    <label>
                        Enter your name:
                        <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
                        {errors.name && <span className="text-red-500">{errors.name}</span>}
                    </label>
                    <label>
                        Email address:
                        <input type="text" value={emailAddress} onChange={(e) => setEmailAddress(e.target.value)} />
                        {errors.emailAddress && <span className="text-red-500">{errors.emailAddress}</span>}
                    </label>
                    <label>
                        Phone number:
                        <input type="text" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} />
                        {errors.phoneNumber && <span className="text-red-500">{errors.phoneNumber}</span>}
                    </label>
                    <label>
                        Image:
                        <input type="file" onChange={(e) => setImage(URL.createObjectURL(e.target.files[0]))} />
                    </label>
                    <label>
                        Employee position:
                        <input type="text" value={position} onChange={(e) => setPosition(e.target.value)} />
                        {errors.position && <span className="text-red-500">{errors.position}</span>}
                    </label>
                    <label>
                        ID:
                        <input type="text" value={ID} onChange={(e) => setID(e.target.value)} />
                        {errors.ID && <span className="text-red-500">{errors.ID}</span>}
                    </label>
                    <button onClick={handleSubmits}>
                        Submit
                    </button>
                </div>
            </div>
            <div className="col-span-1 md:col-span-2 lg:col-span-3 gap-4 mt-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                {employees.length === 0 ? (
                    <div>Loading...</div>
                ) : (
                    employees.map((employee) => (
                        <div key={employee.id}>
                            <h1>{employee.name}</h1>
                            <h2>{employee.position}</h2>
                            <button onClick={() => {
                                setEditingEmployee(employee);
                                setEditModalOpen(true);
                            }}>
                                <RiEdit2Line />
                            </button>
                            <button onClick={() => deleteEmployee(employee.id)}>
                                <RiDeleteBin2Line />
                            </button>
                            {editModalOpen && editingEmployee.id === employee.id && (
                                <div>
                                    <h2>Edit Employee</h2>
                                    <form>
                                        <input type="text" value={editingEmployee.name} onChange={(e) => setEditingEmployee({ ...editingEmployee, name: e.target.value })} />
                                        <button type="button" onClick={() => editEmployee(editingEmployee.id, editingEmployee)}>Save Changes</button>
                                        <button type="button" onClick={() => setEditModalOpen(false)}>Cancel</button>
                                    </form>
                                </div>
                            )}
                        </div>
                    ))
                )}
            </div>
            <div>
                {submittedData && (
                    <table>
                        <tbody>
                            <tr>
                                <th>Name</th>
                                <td>{submittedData.name}</td>
                            </tr>
                            <tr>
                                <th>Email</th>
                                <td>{submittedData.emailAddress}</td>
                            </tr>
                            <tr>
                                <th>Image</th>
                                <td>
                                    <img src={submittedData.image} alt="" />
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
