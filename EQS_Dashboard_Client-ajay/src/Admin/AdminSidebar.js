// import React, { useState } from "react";
// import {Link, useNavigate} from 'react-router-dom'
// import Cookies from "js-cookie";
// import {
//   RiHome4Line,
//   RiTeamLine,
//   RiCalendar2Line,
//   RiFolder2Line,
//   RiUserFollowLine,
//   RiPlantLine,
//   RiStackLine,
//   RiUserUnfollowLine,
// } from "react-icons/ri";
// import { FiChevronsLeft, FiChevronsRight } from "react-icons/fi/";
// import {
//   Sidebar,
//   SubMenu,
//   Menu,
//   MenuItem,
//   //useProSidebar
// } from "react-pro-sidebar";
// import EmployeeNavbar from "./EmployeeNavbar";

// const EmployeeSidebar =()=> {
//   let navigate = useNavigate();
//   //const { collapseSidebar } = useProSidebar();
//   const [collapsed, setCollapsed] = useState(false);

//   const [toggled, setToggled] = useState(false);

//   const handleCollapsedChange = () => {
//     setCollapsed(!collapsed);
//   };
//   const handleToggleSidebar = (value) => {
//     setToggled(value);
//   };

//   const logout = () => {
//     // Clear cookies related to authentication
//     Cookies.remove('jwtToken');
//     Cookies.remove('employeeId');
//     Cookies.remove('empType');
//     Cookies.remove('employeeName');

//     // Redirect to the login page after logout
//     navigate('/');
//   };

//   return (
//     <div>
//       <EmployeeNavbar/>
//       <Sidebar
//         className={`app ${toggled ? "toggled" : ""}`}
//         style={{ height: "100%", position: "absolute" }}
//         collapsed={collapsed}
//         toggled={toggled}
//         handleToggleSidebar={handleToggleSidebar}
//         handleCollapsedChange={handleCollapsedChange}
//       >
//         <main className="sidebarbtn">
//           <Menu>

//             <MenuItem>
//               {collapsed ? (
//                 <MenuItem
//                   style={{fontSize:'40px',paddingLeft:"0px",color:"#ff8135"}}
//                   icon={<FiChevronsRight />}
//                   onClick={handleCollapsedChange}
//                 ></MenuItem>
//               ) : (
//                 <MenuItem
//                    style={{fontSize:'40px',paddingLeft:"0px",color:"#ff8135"}}
//                   suffix={<FiChevronsLeft />}
//                   onClick={handleCollapsedChange}
//                 ></MenuItem>
//               )}
//             </MenuItem>
//            <Link to="/employee/dashboard"> <MenuItem style={{color:"#fff"}} icon={<RiHome4Line />}>Dashboard</MenuItem></Link>
//            <Link to="/employee/leaves"> <MenuItem style={{color:"#fff"}} icon={<RiTeamLine />}>Leaves</MenuItem></Link>
//            <Link to="/employee/attendance"> <MenuItem  style={{color:"#fff"}} icon={<RiFolder2Line />}>Attendence</MenuItem></Link>
//            <Link to="/employee/payslip"><MenuItem  style={{color:"#fff"}} icon={<RiUserUnfollowLine />}>PaySlips</MenuItem></Link>
//            <Link to="/employee/holidays"><MenuItem  style={{color:"#fff"}} icon={<RiUserUnfollowLine />}>Holidays</MenuItem></Link>
//            <Link to="/employee/change-password"><MenuItem  style={{color:"#fff"}} icon={<RiUserUnfollowLine />}>Change Password</MenuItem></Link>

//           </Menu>
//           <button className="btn btn-primary m-5" onClick={logout}>Logout</button>
//         </main>
//       </Sidebar>
//     </div>
//   );
// }
// export default EmployeeSidebar;


import React, { useState, useEffect } from "react";
import { Link, useNavigate, NavLink } from "react-router-dom";
import Cookies from "js-cookie";

import {
  RiHome4Line,
  RiTeamLine,
  RiCalendar2Line,
  RiFolder2Line,
  RiUserFollowLine,
  RiPlantLine,
  RiStackLine,
  RiUserUnfollowLine,
  
} from "react-icons/ri";
import { MdOutlineGroups } from "react-icons/md";
import { RiArrowRightDoubleLine } from "react-icons/ri";
import { MdOutlineEditNote } from "react-icons/md";
import { RiNotificationBadgeFill } from "react-icons/ri";
import { RiFileCopyLine } from "react-icons/ri";
import { FaRegBuilding } from "react-icons/fa";
import { FiChevronsLeft, FiChevronsRight } from "react-icons/fi/";
import {
  Sidebar,
  SubMenu,
  Menu,
  MenuItem,
  //useProSidebar
} from "react-pro-sidebar";
import Navbar from "./AdminNavBar";
// import Navbar from "./Navbar";
// import Navbar from "./EmployeeNavbar";
function Sidebars() {
  //const { collapseSidebar } = useProSidebar();
  const [collapsed, setCollapsed] = useState(false);

  const [toggled, setToggled] = useState(false);

  const handleCollapsedChange = () => {
    setCollapsed(!collapsed);
  };
  const handleToggleSidebar = (value) => {
    setToggled(value);
  };


  let navigate = useNavigate();

  const isTokenValid = () => {
    const jwtToken = Cookies.get('adminToken');


    // Check if the token exists and is not expired
    return jwtToken ? true : false;
  };



  useEffect(() => {
    // Check if the token is not valid, then redirect to the login page
    if (!isTokenValid()) {
      navigate('/');
    }
  }, []);

  return (
    <div>
      <Navbar />
      <Sidebar
        className={`app ${toggled ? "toggled" : ""} `}
        style={{ height: "100%", position: "absolute", position: "fixed" }}
        // collapsed={collapsed}
        // toggled={toggled}
        handleToggleSidebar={handleToggleSidebar}
        handleCollapsedChange={handleCollapsedChange}
      >
        <main className="sidebarbtn ">
          {/* <Menu>
            {collapsed ? (
              <MenuItem
                icon={<FiChevronsRight />}
                onClick={handleCollapsedChange}
                
              ></MenuItem>
            ) : (
              <MenuItem
                suffix={<FiChevronsLeft />}
                onClick={handleCollapsedChange}
              >
                <div
                  style={{
                    padding: "9px",
                  
                    fontWeight: "bold",
                    fontSize: 14,
                    letterSpacing: "1px",
                  }}
                >
                 logo
                </div>
              </MenuItem>
            )}
            <hr />
          </Menu> */}

          <Menu className="">
            {/* <MenuItem>
              {collapsed ? (
                <MenuItem
                  style={{fontSize:'40px',paddingLeft:"0px",color:"#ff8135"}}
                  icon={<FiChevronsRight />}
                  onClick={handleCollapsedChange}
                ></MenuItem>
              ) : (
                <MenuItem
                   style={{fontSize:'40px',paddingLeft:"0px",color:"#ff8135"}}
                  suffix={<FiChevronsLeft />}
                  onClick={handleCollapsedChange}
                ></MenuItem>
              )}
            </MenuItem> */}
            <NavLink to="/admin/dashboard" className="nav_link" activeClassName="active"> <MenuItem icon={<RiHome4Line />}>Dashboard</MenuItem></NavLink>
            <NavLink to="/admin/all-employees" className="nav_link" activeClassName="active" > <MenuItem icon={<RiTeamLine />}>All Employees</MenuItem></NavLink>
            <NavLink to="/admin/leaves" className="nav_link" activeClassName="active"> <MenuItem icon={<RiArrowRightDoubleLine />}>Leaves</MenuItem></NavLink>
            <NavLink to="/leavetype" className="nav_link" activeClassName="active"><MenuItem icon={<RiUserUnfollowLine />}>Leave Type</MenuItem></NavLink>
            <NavLink to="/admin/attendance" className="nav_link" activeClassName="active" > <MenuItem icon={<MdOutlineEditNote />}>Attendance</MenuItem></NavLink>
            <NavLink to="/admin/employee/payslips" className="nav_link" activeClassName="active"><MenuItem icon={<RiFileCopyLine />}>PaySlips</MenuItem></NavLink>
            <NavLink to="/admin/holidays" className="nav_link" activeClassName="active"><MenuItem icon={<RiNotificationBadgeFill />}>Holidays</MenuItem></NavLink>
            <NavLink to="/departments" className="nav_link" activeClassName="active"><MenuItem icon={<FaRegBuilding />}>Department</MenuItem></NavLink>
          </Menu>
        </main>
      </Sidebar>
    </div>
  );
}
export default Sidebars;
