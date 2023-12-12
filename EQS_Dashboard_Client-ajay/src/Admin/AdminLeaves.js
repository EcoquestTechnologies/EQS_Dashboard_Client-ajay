import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  Button,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { ToastContainer, toast, Zoom } from "react-toastify";
import { ThreeDots } from "react-loader-spinner";
import AdminSidebar from "./AdminSidebar";
import StatusDot from "../components/StatusDot";
import apiList from "../lib/apiList";
import axios from "axios";
import { Pagination } from 'antd';
import Cookies from "js-cookie";

const useStyles = makeStyles({
  table: {
    minWidth: 650,
    border: "1px solid #ddd",
  },
  cell: {
    border: "1px solid #ddd", // Add border to each cell
  },
  search: {
    margin: 10,
  },
  filter: {
    margin: 10,
    minWidth: 120,
  },

  selects: {
    "&:before": {
      borderBottom: "none",
    },
    "&:after": {
      borderBottom: "none",
    },
    border: "1px solid #dbcbcb",

    borderRadius: "10px",
  },
});

const AdminLeaves = () => {
  const classes = useStyles();
  const [search, setSearch] = useState("");
  const [leaveType, setLeaveType] = useState("All");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");

  const [leaveData, setLeaveData] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = Cookies.get("adminToken");

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
  };

  const handleLeaveTypeChange = (e) => {
    setLeaveType(e.target.value);
  };

  const handleFromChange = (e) => {
    setFrom(e.target.value);
  };

  const handleToChange = (e) => {
    setTo(e.target.value);
  };

  const handleStatusChange = async (e, index) => {
    const newStatus = e.target.value;

    setLoading(true);

    try {
      // Send a request to the backend API to update the leave status using Axios
      const response = await axios.put(
        apiList.leaveStatusUpdate,
        {
          leaveId: leaveData[index].id,
          status: newStatus,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setLoading(false);
      toast.success(response.data.message);

      if (response.status === 200) {
        // If the request is successful, update the local state
        setLeaveData((prevLeaveData) => {
          const updatedLeaveData = [...prevLeaveData];
          updatedLeaveData[index].status = newStatus;
          return updatedLeaveData;
        });
      } else {
        console.error("Failed to update leave status");
      }
    } catch (error) {
      console.error("Error updating leave status:", error);
    }
  };

  const filterData = () => {
    let filteredData = Array.isArray(leaveData) ? [...leaveData] : [];

    if (search) {
      filteredData = filteredData.filter(
        (data) =>
          data.employeeName &&
          data.employeeName.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (leaveType !== "All") {
      filteredData = filteredData.filter((data) => data.type === leaveType);
    }

    if (from) {
      filteredData = filteredData.filter(
        (data) => data.from && new Date(data.from) >= new Date(from)
      );
    }

    if (to) {
      filteredData = filteredData.filter(
        (data) => data.to && new Date(data.to) <= new Date(to)
      );
    }

    return filteredData;
  };

  useEffect(() => {
    fetchLeaveData();
  }, []);

  const handleSearch = () => {
    // Fetch data based on search criteria

    fetchLeaveData();
  };

  // Fetch leave data from the server when the component mounts
  const fetchLeaveData = async () => {
    try {
      const response = await fetch(apiList.allLeaves, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }); // Update the URL as needed

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      setLeaveData(data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching leave data:", error);
      setLoading(false);
    }
  };


  const [leaveTypes, setLeaveTypes] = useState([]);

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const response = await axios.get(apiList.getleaveType, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        console.log("Department API Response:", response.data);

        setLeaveTypes(response.data);

      } catch (error) {
        console.error("Error fetching Leave Types:", error);
      }
    };

    fetchDepartments();
  }, [token]);

  const pageSize = 10; // Number of cards per page
const [currentPage, setCurrentPage] = useState(1);

const handlePageChange = (page) => {
  setCurrentPage(page);
};

const startIndex = (currentPage - 1) * pageSize;
const endIndex = startIndex + pageSize;


  return (
    <>
      <AdminSidebar />
      <ToastContainer
        position="top-center"
        autoClose={1000}
        hideProgressBar={true}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        transition={Zoom}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"        
      />
      <div
        className="p-5"
        style={{
          marginTop: "80px",
          marginLeft: "210px",
          height: "90vh",
          overflowY: "scroll",
        }}
      >
        <h1 className="attendence container">Leaves</h1>
        <div className="d-flex container">
          <div
            className="d-flex flex-column input-box"
            style={{
              width: "200px",
              margin: 8,
              border: "none",
              borderRadius: "10px",
            }}
          >
            <TextField
              label="Search by employee name"
              value={search}
              onChange={handleSearchChange}
              style={{
                margin: 8,
                borderRadius: "10px",
                padding: "5px",
                width: "200px",
              }}
              InputProps={{
                disableUnderline: true,
              }}
            // InputLabelProps={{
            //   shrink: true,
            // }}
            />
          </div>

          <div
            className="p-1 d-flex flex-column input-box"
            style={{ width: "250px", margin: 8, borderRadius: "10px" }}
          >
            <FormControl className={classes.filter}>
              <InputLabel>Leave type</InputLabel>
              <Select
                value={leaveType}
                onChange={handleLeaveTypeChange}
                className={classes.select}
                InputLabelProps={{
                  shrink: false,
                }}
              >
                <MenuItem value="All">All</MenuItem>
                {leaveTypes.map((leaveType) => (
                  <MenuItem key={leaveType._id} value={leaveType.leaveType}>
                    {leaveType.leaveType}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

          </div>

          <div
            className="p-1 d-flex flex-column input-box"
            style={{
              width: "300px",
              margin: 8,
              border: "none",
              borderRadius: "10px",
            }}
          >
            <TextField
              className={classes.filter}
              label="from"
              type="date"
              value={from}
              onChange={handleFromChange}
              InputProps={{
                disableUnderline: true, // Remove the underline
              }}
              InputLabelProps={{
                shrink: true,
              }}
            />
          </div>

          <div
            className="p-1 d-flex flex-column input-box"
            style={{
              width: "300px",
              margin: 8,
              border: "none",
              borderRadius: "10px",
            }}
          >
            <TextField
              className={classes.filter}
              label="To"
              type="date"
              value={to}
              onChange={handleToChange}
              InputLabelProps={{
                shrink: true,
              }}
              InputProps={{
                disableUnderline: true, // Remove the underline
              }}
            />
          </div>
        </div>

        <div className="container" style={{ textAlign: "-webkit-right" }}>
          <div
            className="d-flex flex-column input-box"
            style={{
              width: " 180px",
              height: "40px",
              marginTop: " 35px",
              backgroundColor: "rgb(255, 129, 53)",
              border: "none",
              boxShadow: " rgba(100, 100, 111, 0.2) 0px 7px 29px 0px",
              borderRadius: "10px",
            }}
          >
            <Button
              onClick={handleSearch}
              InputProps={{
                disableUnderline: true, // Remove the underline
              }}
              style={{ color: "#fff", fontWeight: "400" }}
            >
              Search
            </Button>
          </div>
        </div>

        {loading ? (
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
          <TableContainer component={Paper} className="mt-5 container p-0">
            <div>
              <Table className={classes.table} aria-label="simple table">
                <TableHead style={{ backgroundColor: "#000" }}>
                  <TableRow>
                    <TableCell
                      style={{ color: "#fff" }}
                      className={classes.cell}
                    >
                      Employee
                    </TableCell>
                    <TableCell
                      align=""
                      style={{ color: "#fff" }}
                      className={classes.cell}
                    >
                      Leave type
                    </TableCell>
                    <TableCell
                      align=""
                      style={{ color: "#fff" }}
                      className={classes.cell}
                    >
                      From
                    </TableCell>
                    <TableCell
                      align=""
                      style={{ color: "#fff" }}
                      className={classes.cell}
                    >
                      To
                    </TableCell>
                    <TableCell
                      align=""
                      style={{ color: "#fff" }}
                      className={classes.cell}
                    >
                      No of days
                    </TableCell>
                    <TableCell
                      align=""
                      style={{ color: "#fff" }}
                      className={classes.cell}
                    >
                      Reason
                    </TableCell>
                    <TableCell
                      align=""
                      style={{ color: "#fff" }}
                      className={classes.cell}
                    >
                      Status
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filterData().slice(startIndex, endIndex).map((row, index) => (
                    <TableRow key={row.employee}>
                      <TableCell component="th" scope="row">
                        {row.employeeName}
                      </TableCell>
                      <TableCell align="" className={classes.cell}>
                        {row.type}
                      </TableCell>
                      <TableCell align="" className={classes.cell}>
                        {row.from}
                      </TableCell>
                      <TableCell align="" className={classes.cell}>
                        {row.to}
                      </TableCell>
                      <TableCell align="" className={classes.cell}>
                        {row.days}
                      </TableCell>
                      <TableCell align="" className={classes.cell}>
                        {row.reason}
                      </TableCell>
                      <TableCell align="">
                        <FormControl>
                          <Select
                            value={row.status}
                            onChange={(e) => handleStatusChange(e, index)}
                            className={classes.selects}
                            style={{
                              backgroundColor: "#f7f7f7",
                            }}
                            InputProps={{
                              disableUnderline: true,
                            }}
                          >
                            <MenuItem value="New" className="status-container">
                              <div className="pr-2">
                                <StatusDot status="New" />
                                New
                              </div>
                            </MenuItem>

                            <MenuItem
                              value="Pending"
                              className="status-container"
                            >
                              <div className="pr-2">
                                <StatusDot status="Pending" />
                                Pending
                              </div>
                            </MenuItem>
                            <MenuItem
                              value="Approved"
                              className="status-container"
                            >
                              <div className="pr-2">
                                <StatusDot status="Approved" />
                                Approved
                              </div>
                            </MenuItem>
                            <MenuItem
                              value="Declined"
                              className="status-container"
                            >
                              <div className="pr-2">
                                <StatusDot status="Declined" />
                                Declined
                              </div>
                            </MenuItem>
                          </Select>
                        </FormControl>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </TableContainer>
        )}

       <Pagination
            current={currentPage}
            onChange={handlePageChange}
            defaultPageSize={pageSize}
            className="my-3"
            total={filterData() ? filterData().length : 0}
            style={{ width: 800, margin: "auto", textAlign: "center" }}
          />

      </div>
    </>
  );
};

export default AdminLeaves;
