import React, {useState} from 'react'

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Registration from './pages/registration'


function App() {

  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Registration />} />
        </Routes>
      </Router>
    </>
  )
}

export default App
