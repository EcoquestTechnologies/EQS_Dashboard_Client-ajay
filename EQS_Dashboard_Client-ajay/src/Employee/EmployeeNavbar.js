// import Cookies from "js-cookie";
// import React from "react";
// import 'remixicon/fonts/remixicon.css'

// const EmployeeNavbar = () => {
//   return (
//     <div>
//       <nav class="navbar navbar-expand-lg  nav_sec">
//         <a class="navbar-brand" href="#">

//         </a>
//         <button
//           class="navbar-toggler"
//           type="button"
//           data-toggle="collapse"
//           data-target="#navbarNav"
//           aria-controls="navbarNav"
//           aria-expanded="false"
//           aria-label="Toggle navigation"
//         >
//           <span class="navbar-toggler-icon"></span>
//         </button>
//         <div class="collapse navbar-collapse" id="navbarNav">
//           <ul class="navbar-nav m-auto">
//             <li class="nav-item active">
//               <a class="nav-link" href="#">
//                 <img
//                   src="https://res.cloudinary.com/dhpkv1tec/image/upload/v1701065736/natural%20places/Eco_Quest_Technologies_White_pn5g9v.png"
//                   alt="logo"
//                   className="img-fluid nav_logo"
//                 />
//               </a>
//             </li>
//           </ul>
//           <ul>
//             <li style={{listStyleType:"none"}}>
//               <div class="dropdown">
//                 <button
//                   type="button"
//                   class="btn dropdown-toggle nav_dropdown"
//                   data-toggle="dropdown"
//                   style={{color:"#fff",paddingRight:"40px"}}
//                 >
//                   <span className="nav_pro_icon"><i class="ri-user-line"></i></span> {Cookies.get('employeeName')}
//                 </button>
//                 <div class="dropdown-menu">
//                   <a class="dropdown-item" href="#">
//                     My Profile
//                   </a>
//                   <a class="dropdown-item" href="#">
//                     Log Out
//                   </a>

//                 </div>
//               </div>
//             </li>
//           </ul>
//         </div>
//       </nav>
//     </div>
//   );
// };

// export default EmployeeNavbar;

import React from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import "remixicon/fonts/remixicon.css";
import Cookies from "js-cookie";

const Navbar = () => {
  let navigate = useNavigate();
    const logout = () => {
    // Clear cookies related to authentication
    Cookies.remove('employeeToken');
    Cookies.remove('employeeId');
    Cookies.remove('empType');
    Cookies.remove('employeeName');

    // Redirect to the login page after logout
    navigate('/');
  };
  
  return (
    <div>
      <nav class="navbar navbar-expand-lg  nav_sec fixed-top">
        <a class="navbar-brand" href="#"></a>
        <button
          class="navbar-toggler"
          type="button"
          data-toggle="collapse"
          data-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span class="navbar-toggler-icon"></span>
        </button>
        <div
          class="collapse  navbar-collapse d-flex justify-content-between"
          id="navbarNav"
        >
          <ul class="navbar-nav  ">
            <li class="nav-item ">
              <Link class="nav-link pl-0" to="/employee/dashboard">
                <img
                  src="https://res.cloudinary.com/dhpkv1tec/image/upload/v1701065736/natural%20places/Eco_Quest_Technologies_White_pn5g9v.png"
                  alt="logo"
                  className="img-fluid nav_logo"
                />
              </Link>
            </li>
          </ul>
          <ul>
            <li style={{ listStyleType: "none" }}>
              <div class="dropdown">
                <button
                  type="button"
                  class="btn dropdown-toggle nav_dropdown"
                  data-toggle="dropdown"
                  style={{
                    color: "#fff",
                    paddingRight: "40px",
                    fontSize: "15px",
                    border:'none'
                  }}
                >
                  <span className="nav_pro_icon">
                    <i class="ri-user-line"></i>
                  </span>{" "}
                  {Cookies.get('employeeName')}
                </button>
                <div class="dropdown-menu">
                  <Link class="dropdown-item" to="/employee/myproifle">
                    My Profile
                  </Link>
                  <a class="dropdown-item" href="#">
                    <button className="btn " onClick={logout}>Log Out</button>
                  </a>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
