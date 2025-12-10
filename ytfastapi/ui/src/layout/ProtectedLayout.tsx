import React, { useEffect, useState } from 'react'
import { Navigate, Outlet, useNavigate } from 'react-router-dom'
import { useMainContext } from '../context/MainContext'

const ProtectedLayout = () => {

    const { profile } = useMainContext()
    const navigate = useNavigate()
    const [loading, setLoading] = useState(true)
    useEffect(()=> {
        if(!profile){
           navigate("/login")
        } else {
          setLoading(false)
        }
    },[profile])
    if(loading){
        return <div>loading...</div>
    }

  return (
    <>
      <Outlet/>
    </>
  )
}

export default ProtectedLayout
