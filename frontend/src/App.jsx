import React, {useState} from 'react'

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Registration from './pages/registration'
import Blog from './pages/blog'


function App() {

  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Registration />} />
          <Route path="/blog" element={<Blog />} />
        </Routes>
      </Router>
    </>
  )
}

export default App
