import React, { useEffect, useState } from "react";
import axios from "axios";
import { ThreeDots } from "react-loader-spinner";
import { ToastContainer, toast } from "react-toastify";
import { Pagination } from "antd";
import InputAdornment from "@material-ui/core/InputAdornment";
import { useParams } from "react-router-dom";

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
import AdminSidebar from "./AdminSidebar";
import AdminNavbar from "./AdminNavBar";
import Cookies from "js-cookie";

const useStyles = makeStyles(() => ({
  table: {
    minWidth: 650,
  },
  container: {
    maxHeight: 440,
  },
  header: {
    backgroundColor: "#000",
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

const EmpMonthWiseData = () => {

  const [datewiseData, setDatewiseData] = useState([]);
  const [loader, setLoader] = useState(true);
  let params = useParams();
  const { employeeId, monthname } = params;
  const token = Cookies.get("adminToken");
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
      const response = await axios.get(
        `${apiList.dateWisePunches}/${employeeId}`,
        {
          params: {
            fromDate,
            month,
            year,
          },
        }
      );

      const data = response.data;

      const sortedData = data.sort(
        (a, b) => new Date(a.firstPunchIn) - new Date(b.firstPunchIn)
      );
      setDatewiseData(sortedData);

      if (sortedData.length === 0) {
        setLoader(false);
      }
    } catch (error) {
      console.error("Error fetching Datewise Data:", error);
    }
  };


  useEffect(() => {
    fetchdDateWiseData();
  }, [employeeId]);

  const fetchdDateWiseData = async () => {
    try {
      const response = await axios.get(
        `${apiList.dateWisePunches}/${employeeId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

	
			
			const data = response.data;

			const selectedMonth = monthname;

    		// Filter the data for the selected month
			const filteredData = data.filter((entry) => {
				const entryMonth = new Date(entry.firstPunchIn).toLocaleString('default', { month: 'long' });
				return entryMonth === selectedMonth;
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
    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}`;
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
    const years = Array.from(
      { length: numYears + 1 },
      (_, i) => currentYear - i
    );
    return years;
  };

  return (
    <>
      <AdminSidebar />
      <div
        className="p-5 d-flex flex-column"
        style={{
          marginLeft: "230px",
          marginTop: "80px",
          height: "80vh",
          overflowY: "scroll",
        }}
      >
        <h2 className="attendence">
          ATTENDANCE / Emp Id : {employeeId && employeeId}
        </h2>

        {loader ? (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              // Adjust this value as needed
            }}
          >
            <ThreeDots
              height={50}
              width={50}
              radius={10}
              color="#ff8135"
              ariaLabel="loading"
            />
          </div>
        ) : (
          <TableContainer component={Paper} className={classes.container}>
            <Table
              className={classes.table}
              stickyHeader
              aria-label="simple table"
            >
              <TableHead style={{ backgroundColor: "#000" }}>
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
                  datewiseData.map((row, index) => (
                    <TableRow key={index}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>{row._id}</TableCell>
                      <TableCell>
                        {punchesTimeFormat(row.firstPunchIn)}
                      </TableCell>
                      <TableCell>
                        {punchesTimeFormat(row.lastPunchOut)}
                      </TableCell>
                      <TableCell>
                        {formatTime(row.totalWorkingTime)} HRS{" "}
                      </TableCell>
                      <TableCell>
                        {formatTime(row.totalBreakTime)} HRS
                      </TableCell>
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
      </div>
    </>
  );
};

export default EmpMonthWiseData;
