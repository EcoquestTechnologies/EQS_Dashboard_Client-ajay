

import React, { useState , useEffect} from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
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
  TbArrowsExchange 
  
} from "react-icons/ri";
import { RiArrowLeftRightLine } from "react-icons/ri";
import { RiFileCopyLine } from "react-icons/ri";
import { RiGroupLine } from "react-icons/ri";
import { RiNotificationBadgeFill } from "react-icons/ri";
import { RiArrowRightDoubleLine } from "react-icons/ri";

import { FiChevronsLeft, FiChevronsRight } from "react-icons/fi/";
import {
  Sidebar,
  SubMenu,
  Menu,
  MenuItem,
  //useProSidebar
} from "react-pro-sidebar";
// import Navbar from "./Navbar";
import Navbar from "./EmployeeNavbar";
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
    const jwtToken = Cookies.get('employeeToken');
  
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

          <Menu className="mt-2" >
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
            <NavLink to="/employee/dashboard" className="nav_link" activeClassName="active">
              {" "}
              <MenuItem icon={<RiHome4Line />}>
                Dashboard
              </MenuItem>
            </NavLink>
            <NavLink to="/employee/leaves" className="nav_link" activeClassName="active">
              {" "}
              <MenuItem icon={<RiArrowRightDoubleLine />}>
                Leaves
              </MenuItem>
            </NavLink>
            <NavLink to="/employee/attendance" className="nav_link" activeClassName="active">
              {" "}
              <MenuItem icon={<RiGroupLine />}>
                Attendance
              </MenuItem>
            </NavLink>
            <NavLink to="/employee/payslip" className="nav_link" activeClassName="active">
              <MenuItem  icon={<RiFileCopyLine/>}>
                PaySlips
              </MenuItem>
            </NavLink>
            <NavLink to="/employee/holidays" className="nav_link" activeClassName="active">
              <MenuItem  icon={<RiNotificationBadgeFill />}>
                Holidays
              </MenuItem>
            </NavLink>
            <NavLink to="/employee/change-password" className="nav_link" activeClassName="active">
              <MenuItem  icon={<RiArrowLeftRightLine />}>
                Change Password
              </MenuItem> 
            </NavLink>
            {/* <SubMenu defaultOpen label={"Professors"} icon={<RiTeamLine />}>
              <MenuItem icon={<RiUserFollowLine />}>Active </MenuItem>
              <MenuItem icon={<RiUserUnfollowLine />}>Ex Professors</MenuItem>
              <MenuItem icon={<RiCalendar2Line />}>Probation Period</MenuItem>
            </SubMenu>
            <SubMenu defaultOpen label={"Records"} icon={<RiFolder2Line />}>
              <MenuItem icon={<RiStackLine />}>Senior Students</MenuItem>
              <MenuItem icon={<RiPlantLine />}>Junior Students</MenuItem>
            </SubMenu> */}
          </Menu>
        </main>
      </Sidebar>
    </div>
  );
}
export default Sidebars;
