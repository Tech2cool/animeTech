import React from 'react'
import {Link} from "react-router-dom";

import "./ExtraNavbar.css";

const ExtraNavbar = () => {
  return (
    <div className='extra_navbar'>
        <Link
        to={"/schedule"}
        >
        <div className="extra_navbar_icn_btn">
        <i className='fa-solid fa-clock'></i>
        <p className='extra_navbar_p'>Schedule</p>
        </div>
        </Link>
    </div>
  )
}

export default ExtraNavbar
