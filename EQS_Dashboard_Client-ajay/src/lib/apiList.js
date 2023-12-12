 // export const server = "http://localhost:4444";

 export const server = "https://eqs-server.onrender.com";



 const apiList = {
   login: `${server}/auth/login`,
   punches:`${server}/api/punches`,
   dateWisePunches:`${server}/api/date-wise-data`,
   punchIn:`${server}/api/punchin`,
   punchOut:`${server}/api/punchout`,
   applyLeave:`${server}/api/apply-leave`,
   employeeLeaves:`${server}/api/get-leaves`,
   updateLeave:`${server}/api/update-leave`,
   deleteLeave:`${server}/api/delete-leave`,
   getHolidays:`${server}/api/get-holidays`,
   addEmployee:`${server}/api/add-employee`,
   allEmployees:`${server}/api/all-employees`,
   deleteEmpoyee:`${server}/api/delete-employee`,
   allHolidays:`${server}/api/get-holidays`,
   addHoliday:`${server}/api/add-holiday`,
   updateHoliday:`${server}/api//update-holiday`,
   deleteHoliday:`${server}/api/delete-holiday`,
   allLeaves:`${server}/api/all-leaves`,
   leaveStatusUpdate:`${server}/api/leave/update-status`,
   changepassword: `${server}/api/changepassword`,
   uploadPayslip : `${server}/api/upload-payslip/`,
   employeePayslip : `${server}/api/employee-payslip`,
   adminAttendance:`${server}/api/admin/attendance`,
   datePunchesInAdmin:`${server}/api/admin/employee/date-punches`,
   departments : `${server}/api/department`,
   getDepartments: `${server}/api/getDepartment`,
   leaveType: `${server}/api/leaveType`,
   getleaveType: `${server}/api/getLeavetype`,
   individualEmployee: `${server}/api/individualemployee`,
   monthWiseAttendance:`${server}/api/month-wise-data`

 };
 
 export default apiList;
