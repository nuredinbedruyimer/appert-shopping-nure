import React, { Fragment } from 'react'
import { Link } from 'react-router-dom';
import {useDispatch, useSelector} from 'react-redux';
import {useAlert} from 'react-alert';
import '../../App.css';
import Search from './Search';
import {logout} from '../../Action/userAction';
const Header = () => {
  const dispatch = useDispatch();
  const alert = useAlert();
  const {user,loading} = useSelector((state) => state.auth);
  const {cartItems} = useSelector((state) => state.cart);
  const logoutHandler = () => {
    dispatch(logout());
    alert.success('Logout Successfully');
  }

  return (
    <Fragment>
      <nav className="navbar row">
      <div className="col-12 col-md-4">
        <div className="navbar-brand">
        <Link to="/">
          <img src="/images/shopit_logo.png"  alt='shopit_logo'/>
        </Link>
        </div>
      </div>

      <div className="col-12 col-md-4 mt-2 mt-md-0">
        <Search />
        
      </div>

      <div className="col-12 col-md-4 mt-4 mt-md-0 text-center">
        <Link to ='/cart' style={{textDecoration:'none'}}>
        <span id="cart" className="ml-3">Cart</span>
        <span className="ml-1" id="cart_count">{cartItems.length}</span>
        </Link>
        {user ? (
          <div className='ml-4 dropdown d-inline'>
            <Link to="#!" className="btn dropdown-toggle text-white mr-4" 
            type='button' id='dropdownMenuButton' data-toggle='dropdown' 
            aria-haspopup='true' aria-expanded='false'>
              <figure className="avatar avatar-nav">
                <img src={user.avatar && user.avatar.url} 
                alt={user && user.name}
                  className="rounded-circle" 
                />
              </figure>
              <span>{user && user.name}</span>
            </Link>
            <div className="dropdown-menu" aria-labelledby="dropdownMenuButton">
              {user && user.role === 'admin' && (
                <Link to='/dashboard' className="dropdown-item">Dashboard</Link>
              )}
              <Link to='/orders/me' className="dropdown-item">Orders</Link>
              <Link to='/me' className="dropdown-item">Profile</Link>
              <Link to ='/' className="dropdown-item text-danger" onClick={logoutHandler}
              >Logout</Link>
            </div>
          </div>
        ): !loading && 
          <Link to='/login' className="btn ml-4" id="login_btn">Login</Link>
      }
        
        
      </div>
    </nav>
    </Fragment>
  )
}

export default Header