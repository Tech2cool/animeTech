import React from 'react';
import {Link, useLocation} from "react-router-dom";
import { useLanguage } from '../../context/langContext';

import "./Navbar.css";


const Navbar = () => {
  const location = useLocation()

  const { currentLang, toggleLanguage } = useLanguage();

  // console.log(location.pathname);
  
  // useEffect(()=>{
  // })
  return (
    <div className={`navbar-container`}>
      <div className="navbar-logo">
        <Link
        to={`/`}>
        <span>Anime</span>
        <span style={{color:"rgb(255, 123, 0)"}}>Tech</span>
        </Link>
      </div>
      <ul>
        <li className={`navbar-li ${(location.pathname==="/" || location.pathname.match(/^\/\d+$/))?'active':''}`}><Link to={`/`}><i className={`fa-solid fa-tv`}></i>Latest</Link></li>
        <li className={`navbar-li ${location.pathname==="/search"?'active':''}`}><Link to={`/search`}><i className={`fa-solid fa-search`}></i>Search</Link></li>
        <li className={`navbar-li ${location.pathname==="/new-season"?'active':''}`}><Link to={`/new-season`}><i className={`fa-brands fa-connectdevelop`}></i>New Season</Link></li>
        <li className={`navbar-li ${location.pathname==="/popular"?'active':''}`}><Link to={`/popular`}><i className={`fa-solid fa-fire`}></i>Popular</Link></li>
      </ul>
      <div className={`navbar-bar ${currentLang ==="en"?"":"active"}`} onClick={toggleLanguage}>
        <span>EN</span>
        <span>JP</span>
        {/* <i className='fa-solid fa-bars' onClick={()=>alert("not added yet")}></i> */}
      </div>
    </div>
  )
}

export default Navbar
