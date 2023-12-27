import React from 'react'
import {Link,useLocation} from "react-router-dom";

import "./NavbarBottom.css";

const NavbarBottom = () => {
  const location = useLocation()

  return (
    <div className='navbar-b-container'>
      <ul>
        <li className={`navbar-b-li ${(location.pathname==="/" || location.pathname.match(/^\/\d+$/))?'active':''}`}><Link to={`/`}><i className={`fa-solid fa-tv`}></i>Latest</Link></li>
        <li className={`navbar-b-li ${location.pathname==="/search"?'active':''}`}><Link to={`/search`}><i className="fa-solid fa-search"></i>Search</Link></li>
        <li className={`navbar-b-li ${location.pathname==="/anime-list"?'active':''}`}><Link to={`/anime-list`}><i className={`fa-solid fa-list`}></i>Anime List</Link></li>
        <li className={`navbar-b-li ${location.pathname==="/popular"?'active':''}`}><Link to={`/popular`}><i className={`fa-solid fa-fire`}></i>Popular</Link></li>
      </ul>
    </div>
  )
}

export default NavbarBottom
