import React from 'react'
import {useSelector} from 'react-redux'
import Home from '../home'
import Login from '../user/login'


const AdminProtect = ({children}) => {
    const {user,} = useSelector((state) => state.auth)
  if (user) { 
    if(user.role === 'admin')return children 
    else return <Home/>
    } else return <Login/>
}

export default AdminProtect