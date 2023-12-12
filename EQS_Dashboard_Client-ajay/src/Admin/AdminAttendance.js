import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Link, useNavigate } from "react-router-dom";
import apiList from "../lib/apiList";
import { Pagination } from "antd";
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  MenuItem,
  FormControl,
  Select,
  InputLabel,
  TableRow,
  TextField,
  Typography,
  Button,
} from "@material-ui/core";
import { green, red } from "@material-ui/core/colors";
import { ThreeDots } from "react-loader-spinner";
import CheckIcon from "@material-ui/icons/Check";
import CloseIcon from "@material-ui/icons/Close";
import AdminSidebar from "./AdminSidebar";
import Cookies from "js-cookie";

const useStyles = makeStyles({
  // (Your styles remain unchanged)
  present: {
    color: green[500],
  },
  absent: {
    color: red[500],
  },


  table: {
    minWidth: 650,
    border: "1px solid #ddd",
    marginTop:10,
  },
  cell: {
    border: "1px solid #ddd", // Add border to each cell
  },
  menuButton: {
    padding: 0,
  },
  select: {
    "&:before": {
      borderBottom: "none",
    },
    "&:after": {
      borderBottom: "none",
    },
  },

});

const AdminAttendence = () => {
  let navigate = useNavigate();
  const classes = useStyles();
  const [loader, setLoader] = useState(true);
  const [employee, setEmployee] = useState("");
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());
  const [data, setData] = useState([]);

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const getMonthNumber = (monthName) => {
    const monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    return monthNames.indexOf(monthName) + 1;
  };

  const handleEmployeeChange = (e) => {
    setEmployee(e.target.value);
  };

  const handleMonthChange = (e) => {
    setMonth(getMonthNumber(e.target.value));
  };

  const handleYearChange = (e) => {
    setYear(e.target.value);
  };

  const handleSearch = async () => {
    setLoader(true);
    try {
      const response = await fetch(
        `${apiList.adminAttendance}?employee=${employee}&month=${month}&year=${year}`,
        {
          headers: {
            Authorization: `Bearer ${Cookies.get("adminToken")}`,
          },
        }
      );
      const result = await response.json();
      // console.log(result);
      setData(result);
      setLoader(false);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const generateYearOptions = (numYears) => {
    const currentYear = new Date().getFullYear();
    const years = Array.from(
      { length: numYears + 1 },
      (_, i) => currentYear - i
    );
    return years;
  };

  useEffect(() => {
    const currentDate = new Date();
    setMonth(currentDate.getMonth() + 1);
    setYear(currentDate.getFullYear());

    handleSearch();
  }, []);

  const renderAttendanceIcon = (attendanceStatus) => {
    if (attendanceStatus === "Present") {
      return <CheckIcon className={classes.present} style={{fontSize:"13px"}}/>;
    } else if (attendanceStatus === "Absent") {
      return <CloseIcon className={classes.absent} style={{fontSize:"13px"}} />;
    } else if (attendanceStatus === "Half Day") {
      return <Typography variant="body1" style={{fontSize:"10px"}}>HL</Typography>;
    } else {
      return null;
    }
  };

  const renderTableHeader = () => {
    let days = new Date(year, month, 0).getDate();
    let dayNumbers = Array.from({ length: days }, (_, i) => i + 1);

    return (
      <TableHead style={{ backgroundColor: "#000" }}>
        <TableRow>
          <TableCell style={{ color: "#fff" }} className={classes.cell}>
            Employee
          </TableCell>
          {dayNumbers.map((day) => (
            <TableCell
              key={day}
              align="center"
              style={{ color: "#fff" }}
              className={classes.cell}
            >
              {day}
            </TableCell>
          ))}
        </TableRow>
      </TableHead>
    );
  };

  const sortDates = (attendance) => {
    return attendance.sort((a, b) => new Date(a.date) - new Date(b.date));
  };

 

const pageSize = 10; // Number of cards per page
const [currentPage, setCurrentPage] = useState(1);

const handlePageChange = (page) => {
  setCurrentPage(page);
};

const startIndex = (currentPage - 1) * pageSize;
const endIndex = startIndex + pageSize;
  const renderTableBody = () => {
    let days = new Date(year, month, 0).getDate();
    let dayNumbers = Array.from({ length: days }, (_, i) => i + 1);

    return (
      <TableBody>

        {data?.length > 0 ? data?.slice(startIndex, endIndex).map((row) => { 
          const sortedAttendance = sortDates(row.attendance);
          return (
            <TableRow key={row._id}>

              <TableCell component="th" scope="row" className={classes.cell} style={{width:"100px"}}>
                <Link to={`/admin/employee/${monthNames[month-1]}/${row._id}`} style={{color:"#000"}}>
                  {" "}
                  {row.employeeName}
                </Link>
              </TableCell>
              {dayNumbers.map((day) => {
                const formattedDay = day < 10 ? `0${day}` : `${day}`;
                const currentDate = `${year}-${month}-${formattedDay}`;

                // Check if the date is in the future or the current date
                const isFutureDate =
                  new Date(currentDate) > new Date() ||
                  currentDate === new Date().toISOString().split("T")[0];
                  const matchingAttendance = sortedAttendance.find(
                    (attendance) => attendance.date === currentDate
                  );

                  if (isFutureDate) {
                    return (
                      <TableCell
                        key={currentDate}
                        align="center"
                        className={classes.cell}
                      >
                        {/* Future date, don't render anything */}
                      </TableCell>
                    );
                  }
              

                return (
                  <TableCell
                    key={currentDate}
                    align="center"
                    className={classes.cell}
                  >
                    <Link
                      to={`/admin/employee/day-wise/${row._id}/${currentDate}`}
                    >
                      {matchingAttendance ? (
                        renderAttendanceIcon(
                          matchingAttendance?.attendanceStatus || (
                            <CloseIcon className={classes.absent}   style={{fontSize:"13px"}}/>
                          )
                        )
                      ) : (
                        <CloseIcon className={classes.absent}  style={{fontSize:"13px"}}/>
                      )}
                    </Link>
                  </TableCell>
                );
              })}
            </TableRow>
          );
        }) :
          
          <h1 style={{width:'75vw', margin: 20,textAlign:'center'}}>No Records Found.</h1>
          
          }

      </TableBody>
    );
  };



  return (
    <>
      <AdminSidebar />

      <div
        className="p-5"
        style={{
          marginTop: "80px",
          marginLeft: "210px",
          height: "90vh",
          overflowY: "scroll",
        }}
      >
        <h1 className="attendence container">Attendance</h1>

        <div className="container">
          <div className="row">
            <div className="col-md-3 p-0 text-center m-auto">
              <TextField
                label="Employee Name"
                value={employee}
                onChange={handleEmployeeChange}
                style={{
                  
                  borderRadius: "10px",
                  width: "90%",
                }}
                InputProps={{
                  disableUnderline: true,
                }}
              />
            </div>

            <div className="col-md-3 p-0 mt-3" >
            

            
                <InputLabel>Select Month</InputLabel>


                <Select
                  value={monthNames[month - 1]}
                  onChange={handleMonthChange}
                  className={classes.select}
                  style={{
                    margin: "25px 8px" ,
                    borderRadius: "10px",
                    width: "90%",
                  }}
                >
                  <MenuItem value="January">January</MenuItem>
                  <MenuItem value="February">February</MenuItem>
                  <MenuItem value="March">March</MenuItem>
                  <MenuItem value="April">April</MenuItem>
                  <MenuItem value="May">May</MenuItem>
                  <MenuItem value="June">June</MenuItem>
                  <MenuItem value="July">July</MenuItem>
                  <MenuItem value="August">August</MenuItem>
                  <MenuItem value="September">September</MenuItem>
                  <MenuItem value="October">October</MenuItem>
                  <MenuItem value="November">November</MenuItem>
                  <MenuItem value="December">December</MenuItem>
                </Select>
             

            </div>

            <div className="col-md-3 p-0 mt-3">
           

            
                <InputLabel>Select Year</InputLabel>


                <Select
                  value={year}
                  onChange={handleYearChange}
                  className={classes.select}
                  style={{
                    margin: "25px 8px" ,
                    borderRadius: "10px",
                    width: "90%",
                    
                  }}
                  InputProps={{
                    disableUnderline: true,
                  }}
                >
                  {generateYearOptions(3).map((option) => (
                    <MenuItem key={option} value={option}>
                      {option}
                    </MenuItem>
                  ))}
                </Select>
              

            </div>
            <div className="col-md-3 p-0" style={{marginTop:"43px"}}>
              <Button
                variant="contained"
                color="primary"
                onClick={handleSearch}
                style={{
                  backgroundColor: "#ff8135",

                  width: "90%",
                  height: "40px",

                }}
              >
                Search
              </Button>
            </div>
          </div>
        </div>

        {loader ? (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              width: "75vw",
            }}
          >
            <ThreeDots
              height={60}
              width={60}
              radius={10}
              color="#ff8135"
              ariaLabel="loading"
            />
          </div>
        ) : (
          <TableContainer className="container">
            <Table className={classes.table}>
              {renderTableHeader()}
              {renderTableBody()}
            </Table>
          </TableContainer>
        )}
        <Pagination

            current={currentPage}
            onChange={handlePageChange}
            defaultPageSize={pageSize}
            className="my-3"
            total={data ? data.length : 0}
            style={{ width: 800, margin: "auto", textAlign: "center" }}
          />


      </div>
    </>
  );
};

export default AdminAttendence;
