import React from 'react'
import {useSelector} from 'react-redux'
import Login from '../user/login'

const ProtectedRoute = ({children}) => {
    const {isAuthenticated,loading} = useSelector((state) => state.auth)
    if(!loading&&isAuthenticated) {
        return children
    
    } else{
       return <Login/>
    }
    


}
export default ProtectedRoute