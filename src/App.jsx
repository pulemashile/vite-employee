import React, { useState, useEffect } from "react";
import axios from "axios";

function App() {
    const [name, setName] = useState("");
    const [emailAddress, setEmailAddress] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [image, setImage] = useState("");
    const [position, setPosition] = useState("");
    const [ID, setID] = useState("");
    const [inputText, setInputText] = useState("");
    const [employees, setEmployees] = useState([]);
    const [editingEmployee, setEditingEmployee] = useState(null);
    const [loading, setLoading] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        getEmployees();
    }, []);

    const getEmployees = async () => {
        setLoading(true);
        try {
            const response = await axios.get("http://localhost:8081/registrations");
            setEmployees(response.data);
        } catch (error) {
            console.error("Error fetching employees:", error);
        } finally {
            setLoading(false);
        }
    };

    const validateInputs = () => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const phoneRegex = /^[0-9]+$/;

        if (!name || !emailAddress || !phoneNumber || !position || !ID) {
            return "All fields are required.";
        }
        if (!emailRegex.test(emailAddress)) {
            return "Invalid email format.";
        }
        if (!phoneRegex.test(phoneNumber) || phoneNumber.length < 10) {
            return "Phone number must contain only digits and be at least 10 characters.";
        }
        return ""; 
    };

    const handleAddEmployee = async () => {
        const validationError = validateInputs();
        if (validationError) {
            setErrorMessage(validationError);
            return; 
        }
        const employee = { name, emailAddress, phoneNumber, position, ID, image };

        setLoading(true);
        try {
            if (editingEmployee) {
                const response = await axios.put(`http://localhost:8081/registrations/${editingEmployee.id}`, employee);
                setEmployees(employees.map(emp => (emp.id === editingEmployee.id ? response.data : emp)));
            } else {
                const response = await axios.post("http://localhost:8081/registrations", employee);
                setEmployees([...employees, response.data]);
            }
            clearForm();
            setShowForm(false);
            setErrorMessage(""); 
        } catch (error) {
            console.error("Error saving employee:", error);
        } finally {
            setLoading(false);
        }
    };

    const clearForm = () => {
        setName("");
        setEmailAddress("");
        setPhoneNumber("");
        setPosition("");
        setID("");
        setImage("");
        setEditingEmployee(null);
        setErrorMessage(""); 
    };

    const handleEditEmployee = (employee) => {
        setEditingEmployee(employee);
        setName(employee.name);
        setEmailAddress(employee.emailAddress);
        setPhoneNumber(employee.phoneNumber);
        setPosition(employee.position);
        setID(employee.ID);
        setImage(employee.image);
        setShowForm(true);
    };

    const handleDeleteEmployee = async (id) => {
        setLoading(true);
        try {
            await axios.delete(`http://localhost:8081/registrations/${id}`);
            setEmployees(employees.filter(employee => employee.id !== id));
        } catch (error) {
            console.error("Error deleting employee:", error);
        } finally {
            setLoading(false);
        }
    };

    const filteredEmployees = employees.filter((employee) =>
        employee.name.toLowerCase().includes(inputText.toLowerCase())
    );

    return (
        <div className="flex flex-col h-screen bg-background">
            <nav className="bg-primary p-4">
                <h1 className="text-primary-foreground text-lg font-semibold">mlab</h1>
            </nav>

            <div className="flex flex-1">
                <div className="bg-[#2E073F] w-1/5 p-4">
                    <h2 className="text-primary-foreground text-lg font-semibold mb-4 text-white">Employee Directory</h2>
                    <button
                        className="bg-secondary text-secondary-foreground hover:bg-secondary/80 px-4 py-2 rounded-md mb-4 text-white"
                        onClick={() => setShowForm(true)}
                    >
                        Add Employee
                    </button>
                    <input
                        type="text"
                        placeholder="Search employees..."
                        className="bg-input text-primary-foreground w-full p-2 rounded-md mb-4"
                        onChange={(e) => setInputText(e.target.value)}
                    />
                    <ul className="text-primary-foreground">
                        <li className="mb-2 cursor-pointer hover:text-primary-foreground/80 text-white">Dashboard</li>
                        <li className="mb-2 cursor-pointer hover:text-primary-foreground/80 text-white">Employees</li>
                        <li className="mb-2 cursor-pointer hover:text-primary-foreground/80 text-white">Departments</li>
                        <li className="mb-2 cursor-pointer hover:text-primary-foreground/80 text-white">Settings</li>
                    </ul>
                </div>

                <div className="p-4 w-4/5 overflow-y-auto">
                    {loading ? (
                        <div className="text-center">Loading...</div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {filteredEmployees.map((employee) => (
                                <div key={employee.id} className="bg-card p-4 rounded-lg shadow-md bg-[#EBD3F8] shadow-2xl">
                                    <img
                                        src={employee.image || "https://placehold.co/150?text=👤"}
                                        alt="employee"
                                        className="w-full h-32 object-cover rounded-lg mb-4"
                                    />
                                    <h3 className="text-card-foreground text-lg font-semibold mb-2">{employee.name}</h3>
                                    <p className="text-muted-foreground text-sm">{employee.position}</p>
                                    <div className="flex space-x-2">
                                        <button onClick={() => handleEditEmployee(employee)} className="border border-black w-20">
                                            Edit
                                        </button>
                                        <button onClick={() => handleDeleteEmployee(employee.id)}>
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {showForm && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
                    <div className="bg-primary p-4 rounded-lg w-1/3">
                        <h2 className="text-primary-foreground text-lg font-semibold mb-4">{editingEmployee ? "Edit Employee" : "Add Employee"}</h2>
                        <form onSubmit={(e) => e.preventDefault()}>
                            <input
                                type="text"
                                placeholder="Employee Name"
                                className="bg-input text-primary-foreground w-full p-2 rounded-md mb-4"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                            <input
                                type="text"
                                placeholder="Email Address"
                                className="bg-input text-primary-foreground w-full p-2 rounded-md mb-4"
                                value={emailAddress}
                                onChange={(e) => setEmailAddress(e.target.value)}
                            />
                            <input
                                type="text"
                                placeholder="Phone Number"
                                className="bg-input text-primary-foreground w-full p-2 rounded-md mb-4"
                                value={phoneNumber}
                                onChange={(e) => setPhoneNumber(e.target.value)}
                            />
                            <input
                                type="text"
                                placeholder="Position"
                                className="bg-input text-primary-foreground w-full p-2 rounded-md mb-4"
                                value={position}
                                onChange={(e) => setPosition(e.target.value)}
                            />
                            <input
                                type="text"
                                placeholder="Employee ID"
                                className="bg-input text-primary-foreground w-full p-2 rounded-md mb-4"
                                value={ID}
                                onChange={(e) => setID(e.target.value)}
                            />
                            <input
                                type="file"
                                onChange={(e) => setImage(URL.createObjectURL(e.target.files[0]))}
                                className="bg-input text-primary-foreground w-full p-2 rounded-md mb-4"
                            />
                            {errorMessage && <div className="text-red-500 mb-4">{errorMessage}</div>} 
                            <button
                                type="button"
                                onClick={handleAddEmployee}
                                className="bg-secondary text-secondary-foreground hover:bg-secondary/80 px-4 py-2 rounded-md mr-2"
                            >
                                {editingEmployee ? "Update Employee" : "Add Employee"}
                            </button>
                            <button
                                type="button"
                                onClick={() => setShowForm(false)}
                                className="bg-gray-300 text-gray-700 hover:bg-gray-400 px-4 py-2 rounded-md"
                            >
                                Cancel
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default App;
