import React, { useEffect, useState } from 'react'
import axios from 'axios'
import './search.css'

function Search() {
    const [inputText, setInputText] = useState('')
    const [employees ,setEmployee] = useState([]) 
    
    useEffect(()=>{
            axios.get("http://localhost:8080/registrations")
                .then((response) => setEmployee(response.data))    }
      )

    ///handled
    const inputHandler = (e) =>{
        let lowerCaseValue = e.target.value.toLowerCase()
        setInputText(lowerCaseValue)
    }
    let datafiltered = employees?.filter((employee) => {  
        //return the item which contains the user input
        if (inputText !== ''){
            return employee.name.toLowerCase().includes(inputText)
        }
    })

  return (
    <div className='content-1'>
        <input type="text" onChange={inputHandler} placeholder='Search' />
        <ul>
            {datafiltered?.map(value=><li>
                <div className=''>
                    <p style={{ color: 'black' }}>{value.name}</p>
                    <p style={{ color: 'black' }}>{value.emailadress}</p>
                    <p style={{ color: 'black' }}>{value.phonenumber}</p>
                    <p style={{ color: 'black' }}>{value.ID}</p>
                    <img src={value.image} style={{ color: 'black' }}></img >
                    </div>
            </li>)}
            
        </ul>
    </div>
  )
}

export default Search