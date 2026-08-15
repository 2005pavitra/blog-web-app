import React from 'react'
import { useAuth } from '../context/AuthProvider'

function Hero() {
  const {blogs} = useAuth()
  console.log(blogs)
  return (
    <div>Hero</div>
  )
}

export default Hero