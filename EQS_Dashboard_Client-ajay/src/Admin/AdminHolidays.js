import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import AddIcon from "@material-ui/icons/Add";
import { ToastContainer, Zoom, toast } from "react-toastify";
import { Pagination } from "antd";
import { format } from "date-fns";
import axios from "axios";
import Cookies from "js-cookie";

import apiList from "../lib/apiList";

import { ThreeDots } from "react-loader-spinner";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  
  Paper,
  
  IconButton,
  Menu,

  MenuItem,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,

  Typography,
  TextField,
  Button,

} from "@material-ui/core";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AdminSidebar from "./AdminSidebar";



// Custom styles for the components
const useStyles = makeStyles((theme) => ({
  table: {
    minWidth: 650,
    border: '1px solid #ddd',
  },
  cell: {
    border: '1px solid #ddd', // Add border to each cell
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
}));

const AdminHolidays = () => {
  const classes = useStyles();

  // State for the menu anchor element
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [holidayName, setHolidayName] = useState("");
  const [holidayDate, setHolidayDate] = useState("");
  
  const [updateHolidayName, setUpdateHolidayName] = useState("");
  const [updateHolidayDate, setUpdateHolidayDate] = useState("");

  const [updateDialogOpen, setUpdateDialogOpen] = useState(false);
  
  const [loader, setLoader] = useState(true);
  
  const [selectedHoliday, setSeletedHoliday] = useState(null);

  // The state variable for the dialog visibility
  const [open, setOpen] = useState(false);
  const [Holidays, setHolidays] = useState([]);
  const token = Cookies.get('adminToken')


 



  // The function to handle the form submission
  const handleSubmit = async () => {
    try {
        // Perform any additional validation if needed
        if (!holidayName || !holidayDate) {
            toast.error('Please fill in all required fields');
            return;
        }

        setLoader(true);

        // Make an API request to add the holiday
        const response = await axios.post(apiList.addHoliday, {
            title: holidayName,
            date: holidayDate,
            action: "HR", // Assuming "HR" is a constant value for the action
        }, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        setLoader(false);
        toast.success(response.data.message);

        handleClose(); // Close the dialog after successful addition
        fetchHolidays(); // Fetch the updated list of holidays
    } catch (error) {
        console.error('Error adding holiday:', error);

        // Handle specific errors as needed
        if (error.response && error.response.status === 401) {
            // Unauthorized error handling
            // Redirect to login or handle accordingly
        }
    }
    setHolidayDate("");
    setHolidayName("");
};


  const handleUpdateDialogOpen = () => {
    setUpdateDialogOpen(true);
    setUpdateHolidayName(selectedHoliday.title);
    setUpdateHolidayDate(selectedHoliday.date);
    // Set other fields if needed
  };

  // The function to handle closing the update dialog
  const handleUpdateDialogClose = () => {
    setUpdateDialogOpen(false);
  }; 

  const handleUpdateSubmit = async () => {
    try {
      const response = await axios.put(
        `${apiList.updateHoliday}/${selectedHoliday._id}`,
        {
          title: updateHolidayName,
          date: updateHolidayDate,
          day: format(new Date(updateHolidayDate), 'EEEE'),
          // Include other fields if needed
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success(response.data.message);
      setUpdateDialogOpen(false);
      fetchHolidays();
    } catch (error) {
      console.error('Error updating holiday:', error);
      toast.error('Failed to update holiday');
    } finally {
      setUpdateHolidayName("");
      setUpdateHolidayDate("");
      setAnchorEl(null);
      setSeletedHoliday(null);
    }
  };

  // The function to handle the dialog opening
  const handleOpen = () => {
    setOpen(true);
  };

  // The function to handle the dialog closing
  const handleClose = () => {
    setOpen(false);
  };



  // Handler for the menu button click
  const handleMenuClick = (event, holiday) => {
    setAnchorEl(event.currentTarget);
    setSeletedHoliday(holiday);
  };

  // Handler for the menu close
  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const renderAddHoliday = () => {
    return (
      <div>
        <Dialog open={open} onClose={handleClose}>
          <DialogTitle>Add Holiday</DialogTitle>
          <DialogContent>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  label="Holiday Name"
                  name="holidayName"
                  value={holidayName}
                  onChange={(e)=>setHolidayName(e.target.value)}
                  fullWidth
                  margin="normal"
                  required
                />
              </Grid>
           
              <Grid item xs={12}>
                <TextField
                  label="Holiday Date"
                  name="holidayDate"
                  value={holidayDate}
                  onChange={(e) =>
                    setHolidayDate(e.target.value)
                  }
                  type="date"
                  fullWidth
                  margin="normal"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  required
                />
              </Grid>
             
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={handleClose}
              style={{ backgroundColor: "grey", color: "#fff" }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              style={{ backgroundColor: "#ff8135", color: "#fff" }}
            >
              Add Leave
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  };

  const renderUpdateHolidayForm = () => {
    return (
      <div>
        <Dialog open={updateDialogOpen} onClose={handleUpdateDialogClose}>
          <DialogTitle>Update Holiday</DialogTitle>
          <DialogContent>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  label="Holiday Name"
                  name="updateHolidayName"
                  value={updateHolidayName}
                  onChange={(e) => setUpdateHolidayName(e.target.value)}
                  fullWidth
                  margin="normal"
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Holiday Date"
                  name="updateHolidayDate"
                  value={updateHolidayDate}
                  onChange={(e) => setUpdateHolidayDate(e.target.value)}
                  type="date"
                  fullWidth
                  margin="normal"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  required
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={handleUpdateDialogClose}
              style={{ backgroundColor: "grey", color: "#fff" }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleUpdateSubmit}
              style={{ backgroundColor: "#ff8135", color: "#fff" }}
            >
              Update Holiday
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  };

  useEffect(() => {
    fetchHolidays()
  }, []);

  const fetchHolidays = async () => {
    try {
      const response = await axios.get(apiList.allHolidays, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setLoader(false);
      setHolidays(response.data);
    } catch (error) {
      console.error('Error fetching holidays:', error);
    }
  };

  const handleDeleteHoliday = async () => {
    try {
      setLoader(true);
  
      // Make sure a valid holiday is selected
      if (!selectedHoliday || !selectedHoliday._id) {
        toast.error('Invalid leave selection');
        return;
      }
  
      // Make an API request to delete the holiday
      const response = await axios.delete(`${apiList.deleteHoliday}/${selectedHoliday._id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      toast.success(response.data.message);
  
      // Fetch the updated list of holidays after deletion
      fetchHolidays();
    } catch (error) {
      console.error('Error deleting holiday:', error);
      toast.error('Failed to delete holiday. Please try again.');
    } finally {
      // Close the menu
      setAnchorEl(null);
      setSeletedHoliday(null);
      setLoader(false);
    }
  };
  const pageSize = 10; // Number of cards per page
  const [currentPage, setCurrentPage] = useState(1);
  
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };
  
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;

  console.log(selectedHoliday);

  return (

    <div>
        <AdminSidebar/>
    <div className="p-5" style={{marginTop:"80px",marginLeft:"210px" , height:"80vh", overflowY:"scroll"}}>
      <ToastContainer
        position="top-center"
        autoClose={2000}
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
      <Button
        variant="contained"
        color="secondary"
        style={{ margin: 8, float: "right", backgroundColor: "#ff8135" ,borderRadius:20}}
        startIcon={<AddIcon />}
        onClick={handleOpen}
      >
        Add Holiday
      </Button>
      <div>
        <h1 className="container attendence">
          Holidays
        </h1>


       
      </div>
      <TableContainer component={Paper}>
        <Table className={classes.table} aria-label="employee table">
          <TableHead style={{ backgroundColor: "#000" }}>
            <TableRow>
              <TableCell style={{color:"#fff"}} className={classes.cell}>S.No</TableCell>
              <TableCell style={{color:"#fff"}} className={classes.cell}>Title</TableCell>
              <TableCell style={{color:"#fff"}} className={classes.cell}>Holiday Date</TableCell>
              <TableCell style={{color:"#fff"}} className={classes.cell}>Day</TableCell>
              <TableCell style={{color:"#fff"}} className={classes.cell}>Action</TableCell>
             
            </TableRow>
          </TableHead>
          {loader ? (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                width:'75vw'
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
            <TableBody>
              {Holidays.slice(startIndex, endIndex).map((holiday, index) => (
                <TableRow key={holiday._id}>
                  <TableCell className={classes.cell}>{index + 1}</TableCell>
                  <TableCell className={classes.cell}>{holiday.title}</TableCell>
                  <TableCell className={classes.cell}>{holiday.date}</TableCell>
                  <TableCell className={classes.cell}>{holiday.day}</TableCell>
                  <TableCell className={classes.cell}>
                    <IconButton
                      className={classes.menuButton}
                      aria-label="more"
                      aria-controls="simple-menu"
                      aria-haspopup="true"
                      onClick={(event) => handleMenuClick(event, holiday)}
                    >
                      <MoreVertIcon />
                    </IconButton>
                    <Menu
                      id="simple-menu"
                      anchorEl={anchorEl}
                      keepMounted
                      open={Boolean(anchorEl)}
                      onClose={handleMenuClose}
                      
                    >
                      <MenuItem onClick={handleUpdateDialogOpen}>
                        <EditIcon color="secondary" />
                        <span style={{ marginLeft: "10px" }}>Update</span>
                      </MenuItem>
                      <MenuItem onClick={handleDeleteHoliday}>
                        <DeleteIcon color="action" />
                        <span style={{ marginLeft: "10px" }} >Delete</span>
                      </MenuItem>
                    </Menu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
            )
          }
        </Table>
      </TableContainer>
      {open && renderAddHoliday()}
      {updateDialogOpen && renderUpdateHolidayForm()}
      <Pagination
            current={currentPage}
            onChange={handlePageChange}
            defaultPageSize={pageSize}
            className="my-3"
            total={Holidays ? Holidays.length : 0}
            style={{ width: 800, margin: "auto", textAlign: "center" }}
          />
    </div>
    </div>
  );
};

export default AdminHolidays;
