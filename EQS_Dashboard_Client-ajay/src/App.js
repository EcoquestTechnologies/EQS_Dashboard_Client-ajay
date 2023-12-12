import {Routes, Route} from 'react-router-dom';

import EmpDashboard from './Employee/EmpDashboard';
import Attendance from './Employee/Attendance';
import Leaves from './Employee/Leaves';
import Holidays from './Employee/Holidays';
import ChangePassword from './Employee/ChangePswrd';
import Payslip from './Employee/Payslip';
import AdminDashboard from './Admin/AdminDashboard';
import AllEmployees from './Admin/AllEmployees';
import AdminHolidays from './Admin/AdminHolidays';
import AdminLeaves from './Admin/AdminLeaves';
import AdminAttendance from './Admin/AdminAttendance';
import AdminPayslip from './Admin/AdminPayslip';
import LoginPage from './Auth/Login';
import EmpPloyeeProfile from './Employee/MyProfile';
import EmpMonthWiseData from './Admin/EmployeeMonthWiseAttendance';
import EmpDayWiseActivity from './Admin/EmployeeDayWiseActivtity';
import Department from './Admin/AdminDepartment';
import LeaveType from './Admin/AdminLeaveType';
import EmpProfile from './Admin/EmpProfile';


function App() {
  return (
    <>
    <div className='bodyy bodyyy'>
    <Routes>
      <Route exact path = "/" element={<LoginPage/>}/>
      <Route exact path = "/admin/dashboard" element={<AdminDashboard /> } />
      <Route exact path = "/admin/all-employees" element={<AllEmployees /> } />
      <Route exact path = "/admin/holidays" element={<AdminHolidays /> } />
      <Route exact path = "/admin/attendance" element={<AdminAttendance /> } />
      <Route exact path = "/admin/leaves" element={<AdminLeaves /> } />
      <Route exact path = "/admin/employee/payslips" element={<AdminPayslip /> } />
      <Route exact path = "/admin/employee/:monthname/:employeeId" element={<EmpMonthWiseData /> } />
      <Route exact path = "/admin/employee/day-wise/:employeeId/:date" element={<EmpDayWiseActivity /> } />
      <Route exact path = "/departments" element={<Department/>} />
      <Route exact path = "/leavetype" element={<LeaveType/>} />
      <Route exact path = "/admin/employee/profile/:employeeId" element={<EmpProfile /> } />
      
      <Route exact path = "/employee/dashboard" element={<EmpDashboard /> } />
      <Route exact path = "/employee/attendance" element={<Attendance/> }/>
      <Route exact path ="/employee/leaves" element={<Leaves />}/>
      <Route exact path ="/employee/payslip" element={<Payslip />}/>
      <Route exact path ="/employee/holidays" element={<Holidays />}/>
      <Route exact path ="/employee/myproifle" element={<EmpPloyeeProfile />}/>
      <Route exact path ="/employee/change-password" element={<ChangePassword />}/>

    </Routes>
    </div>

    <div className="bodyyyy">
				<div className="row">
					<div className="col-md-2"></div>
					<div className="col-md-8">
						<div className="desktop_img">
							<img src="..\images\Open in desktop.png" className=" img-fluid" alt='Desktop Img' />
						</div>
					</div> 
					<div className="col-md-2"></div>
				</div>
			</div>
   
    
    </>
  );
}

export default App;
