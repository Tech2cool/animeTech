import React, { useEffect } from 'react';
import {Link, useLocation} from "react-router-dom";

import "./Navbar.css";


const Navbar = () => {
  const location = useLocation()
  console.log(location.pathname);
  

  // useEffect(()=>{
  // })
  return (
    <div className={`navbar-container`}>
      <div className="navbar-logo">
        <Link
        to={`/`}>
        <span>Anime</span>
        <span style={{color:"#0095ee"}}>Tech</span>
        </Link>
      </div>
      <ul>
        <li className={`navbar-li ${(location.pathname==="/" || location.pathname.match(/^\/\d+$/))?'active':''}`}><Link to={`/`}><i className={`fa-solid fa-tv`}></i>Latest</Link></li>
        <li className={`navbar-li ${location.pathname==="/search"?'active':''}`}><Link to={`/search`}><i className={`fa-solid fa-search`}></i>Search</Link></li>
        <li className={`navbar-li ${location.pathname==="/anime-list"?'active':''}`}><Link to={`/anime-list`}><i className={`fa-solid fa-list`}></i>Anime List</Link></li>
        <li className={`navbar-li ${location.pathname==="/popular"?'active':''}`}><Link to={`/popular`}><i className={`fa-solid fa-fire`}></i>Popular</Link></li>
      </ul>
      <div className="navbar-profile">
        <i className='fa-solid fa-user'></i>
      </div>
      <div className="navbar-bar">
        <i className='fa-solid fa-bars' onClick={()=>alert("not added yet")}></i>
      </div>
    </div>
  )
}

export default Navbar
