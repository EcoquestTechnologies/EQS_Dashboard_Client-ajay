import React, { useEffect, useState } from "react";
import axios from "axios";
import { ThreeDots } from "react-loader-spinner";
import { ToastContainer, toast } from "react-toastify";
import { Pagination } from "antd";
import InputAdornment from "@material-ui/core/InputAdornment";
import apiList from "../lib/apiList";
import { Zoom } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "react-vertical-timeline-component/style.min.css";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  FormControl,
  Button,
  MenuItem,
  Select,
  InputLabel,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import EmployeeNavbar from "./EmployeeNavbar";
import EmployeeSidebar from "./EmployeeSidebar";
import Cookies from "js-cookie";

const useStyles = makeStyles(() => ({
  table: {
    minWidth: 650,
  },
  container: {
    maxHeight: 440,
  },
  header: {
    backgroundColor: "#000 !important",
    color: "white",
    fontSize: "17px",
    fontWeight: "600",
  },
  input: {
    borderWidth: 2,
  },
  select: {
    "&:before": {
      borderBottom: "0px",
    },
    "&:after": {
      borderBottom: "none",
    },
  },
  icon: {
    fill: "none",
  },
}));

const columns = ["#", "Date", "Punch In", "Punch Out", "Production", "Break"];

const Attendance = () => {
  const [datewiseData, setDatewiseData] = useState([]);
  const [loader, setLoader] = useState(true);
  const employeeId = Cookies.get("employeeId");
  const token = Cookies.get("employeeToken");
  const classes = useStyles();
  const [fromDate, setFromDate] = useState("");
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");

  const handleFromDateChange = (e) => {
    setFromDate(e.target.value);
  };

  const handleMonthChange = (e) => {
    setMonth(e.target.value);
  };

  const handleYearChange = (e) => {
    setYear(e.target.value);
  };

  const handleSearchClick = async () => {
    try {
      setLoader(true);
      const response = await axios.get(`${apiList.dateWisePunches}/${employeeId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = response.data;

      // If month and year are selected, filter the data
      if (month && year) {
        const selectedMonth = month;

        // Filter the data for the selected month and year
        const filteredData = data.filter((entry) => {
          const entryMonth = new Date(entry.firstPunchIn).toLocaleString("default", {
            month: "long",
          });
          const entryYear = new Date(entry.firstPunchIn).getFullYear();
          return entryMonth === selectedMonth && entryYear === year;
        });

        const sortedData = filteredData.sort(
          (a, b) => new Date(a.firstPunchIn) - new Date(b.firstPunchIn)
        );

        setDatewiseData(sortedData);
      } else {
        // If no month and year selected, fetch data for the current month
        fetchdDateWiseData();
      }

      setLoader(false);
    } catch (error) {
      console.error("Error fetching Datewise Data:", error);
    }
  };

  useEffect(() => {
    fetchdDateWiseData();
  }, [employeeId]);

  const fetchdDateWiseData = async () => {
    try {
      const response = await axios.get(`${apiList.dateWisePunches}/${employeeId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = response.data;

      // If no month and year selected, filter the data for the current month
      const currentMonth = new Date().toLocaleString("default", { month: "long" });
      const filteredData = data.filter((entry) => {
        const entryMonth = new Date(entry.firstPunchIn).toLocaleString("default", {
          month: "long",
        });
        return entryMonth === currentMonth;
      });

      const sortedData = filteredData.sort(
        (a, b) => new Date(a.firstPunchIn) - new Date(b.firstPunchIn)
      );
      setDatewiseData(sortedData);
      setLoader(false);
    } catch (error) {
      console.error("Error fetching Datewise Data:", error);
    }
  };

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`;
  };

  const punchesTimeFormat = (dateString) => {
    const dateObject = new Date(dateString);
    const hours = dateObject.getHours();
    const minutes = dateObject.getMinutes();
    const ampm = hours >= 12 ? "PM" : "AM";

    const formattedHours = (hours % 12 || 12).toString().padStart(2, "0");
    const formattedMinutes = minutes.toString().padStart(2, "0");

    return `${formattedHours}:${formattedMinutes} ${ampm}`;
  };

  const generateYearOptions = (numYears) => {
    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: numYears + 1 }, (_, i) => currentYear - i);
    return years;
  };

  const pageSize = 10; // Number of cards per page
  const [currentPage, setCurrentPage] = useState(1);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;

  return (
    <>
      {/* <EmployeeNavbar /> */}
      <EmployeeSidebar />
      <div
        className="p-5 d-flex flex-column"
        style={{ marginLeft: "230px", marginTop: "80px", height: "90vh", overflowY: "scroll" }}
      >
        <h2 className="attendence">ATTENDANCE</h2>
        <div className="card_item p-3 mb-2">
          <div className="row">
            {/* <div className="col-md-4">
                            <label style={{fontSize:"17px", fontWeight:"500"}}>Select Date</label>
							<div className="p-1 d-flex flex-column  form_item w-100 ">
							
								<TextField
									className={classes.input} 
									type="date"
									value={fromDate}
									onChange={handleFromDateChange}
									InputLabelProps={{
										shrink: true,
									}}
									InputProps={{
										startAdornment: <InputAdornment></InputAdornment>,
										disableUnderline: true, 
									}}
								/>
							</div>
						</div> */}
            <div className="col-md-4">
              <label style={{ fontSize: "17px", fontWeight: "500" }}>Select Month</label>
              <div className="p-1 d-flex flex-column w-100 form_item">
                <FormControl className={classes.formControl}>
                  {/* <InputLabel>Select Month</InputLabel> */}
                  <Select
                    className={classes.select}
                    label="Month"
                    value={month}
                    onChange={handleMonthChange}
                  >
                    {/* <MenuItem value="default">-</MenuItem> */}
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
                </FormControl>
              </div>
            </div>
            <div className="col-md-4">
              <label style={{ fontSize: "17px", fontWeight: "500" }}>Select Year</label>
              <div className="p-1 d-flex flex-column w-100 form_item">
                <FormControl>
                  <Select
                    className={classes.select}
                    label="Year"
                    value={year}
                    onChange={handleYearChange}
                  >
                    {generateYearOptions(4).map((option) => (
                      <MenuItem key={option} value={option}>
                        {option}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </div>
            </div>
            <div className="col-md-4" style={{ marginTop: "40px" }}>
              <Button className="search_btn" onClick={handleSearchClick}>
                Search
              </Button>
            </div>
          </div>
          {/* <div className="d-flex justify-content-center mt-3 mb-3">
						<Button
							className="search_btn"
							onClick={handleSearchClick}
						>
							Search
						</Button>
					</div> */}
        </div>

        {loader ? (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              // Adjust this value as needed
            }}
          >
            <ThreeDots height={60} width={60} radius={10} color="#ff8135" ariaLabel="loading" />
          </div>
        ) : (
          <TableContainer component={Paper} className={classes.container}>
            <Table className={classes.table} stickyHeader aria-label="simple table">
              <TableHead>
                <TableRow>
                  {columns.map((column) => (
                    <TableCell className={classes.header} key={column}>
                      {column}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {datewiseData.length > 0 ? (
                  datewiseData.slice(startIndex, endIndex).map((row, index) => (
                    <TableRow key={index}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>{row._id}</TableCell>
                      <TableCell>{punchesTimeFormat(row.firstPunchIn)}</TableCell>
                      <TableCell>{punchesTimeFormat(row.lastPunchOut)}</TableCell>
                      <TableCell>{formatTime(row.totalWorkingTime)} HRS </TableCell>
                      <TableCell>{formatTime(row.totalBreakTime)} HRS</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <div
                    style={{
                      display: "flex",
                      paddingTop: "10px",
                      paddingBottom: "10px",
                      justifyContent: "center",
                      alignItems: "center",
                      width: "100vw",
                    }}
                  >
                    <h5>No Records Found for this filter Try with Others</h5>
                  </div>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        )}
        <Pagination
          current={currentPage}
          onChange={handlePageChange}
          defaultPageSize={pageSize}
          total={datewiseData.length}
          className="my-3 fixed-bottom pagenation_item"
          style={{ width: 800, margin: "auto", textAlign: "center" }}
        />
      </div>
    </>
  );
};

export default Attendance;
