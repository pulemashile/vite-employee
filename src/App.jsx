import { useState } from 'react'
import Form from './components/form'
import './App.css'
import Search from './components/search/Search'



function App() {


  return (
    <div>
      
  <div>
      <Search />
   </div>

    <div className=''>
        <Form />
     </div>
    </div>

  )
}

export default App
