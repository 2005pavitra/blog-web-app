import React from 'react'
import { AuthProvider } from '../context/AuthProvider'

function Hero() {
  const {blogs} = AuthProvider
  console.log(blogs)
  return (
    <div>Hero</div>
  )
}

export default Hero