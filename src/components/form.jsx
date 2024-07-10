// import { useState } from "react";
// import "./form.css"

// function Form() {
//   const [name, setName] = useState('');
//   const [emailAddress, setEmailAddress] = useState('');
//   const [phoneNumber, setPhoneNumber] = useState('');
//   const [image, setImage] = useState('');
//   const [position, setPosition] = useState('');
//   const [ID, setID] = useState('');
//   const [emailError, setEmailError] = useState('');

//   const handleSubmits = () => {
//     const employee = {
//       name : name,
//       email : emailAddress,
//       position : position,
//       phonenumber : phoneNumber,
//       ID:ID,
//       image:image
//     }
//     fetch('http://localhost:8080/registrations', {
//       method : 'POST',
//       headers : {'Content-Type' : 'application/json'},
//       body : JSON.stringify(employee)
//     }).then(data => {
//       console.log(data)
//     })

//   }

//   return (
//   <div className="form-container">
//       <label>
//         Enter your name:
//         <input type="text"
//           onChange={e => setName(e.target.value)}
//         />
//       </label>

//       <label>
//         email address
//         <input type="text"
//          onChange={e => setEmailAddress(e.target.value)}

//         />
//         <p> { emailError } </p>
//       </label>

//       <label>
//         phone number:
//         <input type="number"
//          onChange={e => setPhoneNumber(e.target.value)}
//          />

//       </label>

//       <label>
//         image
//         <input type="file" required onChange={e=>{
//           setImage(e.target.files)
//         }} />
//       </label>

//       <label>
//         {" "}
//         Employee position:
//         <input type="text"
//          onChange={e => setPosition(e.target.value)}

//         />
//       </label>

//       <label>
//         ID:
//         <input type="text"  onChange={e => setID(e.target.value)}
//         />
//       </label>
//       <button onClick={handleSubmits}> submit Form</button>
//     </div>
//   );
// }

// export default Form;
import React, { useState } from "react";
import "./form.css";
import axios from "axios";
function Form() {
  const [name, setName] = useState("");
  const [emailAddress, setEmailAddress] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [image, setImage] = useState("");
  const [position, setPosition] = useState("");
  const [ID, setID] = useState("");
  const [emailError, setEmailError] = useState("");
  const [submittedData, setSubmittedData] = useState(null);
  const [employees, setEmployees] = useState([])
  const handleSubmits = () => {
    const employee = {
      name,
      emailAddress,
      phoneNumber,
      position,
      ID,
      image,
    };

    fetch("http://localhost:8080/registrations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(employee),
    })
      .then((response) => response.json())
      .then((data) => {
        setSubmittedData(employee);
        console.log(data);
      })
      .catch((error) => console.error("Error:", error));
  };

  const get_users = () =>{
    fetch('http://localhost:8080/registrations')
    .then(res => res.json())
    .then(data => setEmployees(data))
    .catch(err => console.log(err)) 
  }
  get_users()
  return (
    <div style={{
        display : 'flex',
        justifyContent : 'center',
        gap : '30px'
    }}>
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
        <p>{emailError}</p>
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
      <button className = 'btn-submit' onClick={handleSubmits}>Submit </button>
      </div>
      
     
    </div>
     <div style={{
        display : 'flex', 

      }}>
        { employees.length === 0 ? (<div> Loading... </div>) : employees.map(employee => (
            <div key={employee.id} style={{
                border : '2px solid black',
                borderRadius:"6px",
                width : '15vw',
                textAlign : 'center'
            }}>
                <h1> {employee.name} </h1>
                <h1> {employee.phoneNumber} </h1>
                <h1> {employee.email} </h1>
                <h1> {employee.ID} </h1>
                <h1> {employee.position} </h1>
                <img src={employee.image} alt="" style={{
                    height : '150px',
                    objectFit : 'cover'
                }} />
                <button onClick={ async () => {
                    try {
                        await axios.delete('http://localhost:8080/registrations/' + employee.id);
                        console.log('deleted')
                    } catch (error) {
                        
                    }
                }}> Delete</button>
            </div>
        )) }
      </div>
    </div>
   
  );
}

export default Form;
