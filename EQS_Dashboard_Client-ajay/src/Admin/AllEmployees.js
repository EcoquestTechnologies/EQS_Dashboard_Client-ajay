import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import AddIcon from "@material-ui/icons/Add";
import { ToastContainer, Zoom, toast } from "react-toastify";
import { format } from "date-fns";
import axios from "axios";
import InputAdornment from "@material-ui/core/InputAdornment";
import apiList from "../lib/apiList";
import VisibilityIcon from "@material-ui/icons/Visibility";
import VisibilityOffIcon from "@material-ui/icons/VisibilityOff";
import { Pagination } from 'antd';
import { ThreeDots } from "react-loader-spinner";
import AdminSidebar from './AdminSidebar'
import Cookies from "js-cookie";
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    RadioGroup,
    FormControlLabel,
    TextareaAutosize,
    Radio,
    Paper,
    FormControl,
    IconButton,
    Menu,
    Select,
    MenuItem,
    Grid,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    InputLabel,
    Typography,
    TextField,
    Button,
    Avatar
} from "@material-ui/core";
import { Link } from "react-router-dom";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

// Sample data for employees

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

const AllEmployees = () => {
    const classes = useStyles();

    // State for the menu anchor element
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [employeeId, setEmployeeId] = useState("");
    const [employeeName, setEmployeeName] = useState("");
    const [designation, setDesignation] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loader, setLoader] = useState(true);
    const [isNoEmplFound, setIsNoEmpFound] = useState(false);
    const [errorMsg, setErrMsg] = useState("");
    const [selectedEmployee, setSelectedEmployee] = useState(null);

    // The state variable for the dialog visibility
    const [open, setOpen] = useState(false);
    const [allEmployees, setAllEmpEmployees] = useState([]);
    const token = Cookies.get('adminToken')

    // The state variable for the employee data
    const [employee, setEmployee] = useState({
        firstName: "",
        lastName: "",
        employeeId: "",
        mobile: "",
        email: "",
        dateOfBirth: "",
        joiningDate: "",
        department: "",
        designation: "",
        gender: "",
        report: "",
        role: "",
        address: "",
        password: "",
    });

    // The function to handle the form submission
    const handleSubmit = async () => {
        try {
            const requiredFields = [
                "firstName",
                "lastName",
                "employeeId",
                "mobile",
                "email",
                "dateOfBirth",
                "joiningDate",
                "department",
                "designation",
                "gender",
                "role",
                "report",
                "address",
            ];
            const isEmptyField = requiredFields.some((field) => !employee[field]);


            if (isEmptyField) {
                // Show a toast or alert indicating that required fields are empty
                toast.warning("Please fill all fields");
                return;
            } else {
                const response = await axios.post(apiList.addEmployee, employee, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                const data = response.data; // Use response.data instead of response.json()


                if (response.status === 201) {
                    toast.success(data.message);

                    // Close the dialog box
                    setOpen(false);
                }


                // Reset the employee state
                setEmployee({
                    firstName: "",
                    lastName: "",
                    employeeId: "",
                    mobile: "",
                    email: "",
                    dateOfBirth: "",
                    joiningDate: "",
                    department: "",
                    designation: "",
                    gender: "",
                    role: "",
                    report: "",
                    address: "",
                });
                fetchEmployees();
            }
        } catch (error) {
            // Handle specific errors, e.g., duplicate email or employee ID
            if (error.response && error.response.status === 400) {
                // Assuming that the server responds with a 400 status code for validation errors
                toast.error("Email or Employee ID already exists");
            } else {
                console.error("Error adding employee:", error);
            }
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

    const handleSearch = async () => {
        try {
            setLoader(true);

            // Prepare the filter object based on user inputs
            const filters = {};
            if (employeeId) {
                filters.employeeId = employeeId;
            }
            if (employeeName) {
                filters.employeeName = employeeName;
            }
            if (designation) {
                filters.designation = designation;
            }

            // Make an API request to get filtered employees
            const response = await axios.get(apiList.allEmployees, {
                params: filters,
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            // Update the state with the filtered employees
            setAllEmpEmployees(response.data);
            setIsNoEmpFound(false);
            setLoader(false);
        } catch (error) {
            if (error.response && error.response.status === 404) {
                setErrMsg(error.response.data.message);
                setIsNoEmpFound(true);
                setLoader(false);
            } else {
                console.error("Error searching for employees:", error);
            }
        }
        setEmployeeId("");
        setEmployeeName("");
        setDesignation("");
    };




    // Handler for the menu button click
    const handleMenuClick = (event, employee) => {
        setAnchorEl(event.currentTarget);
        setSelectedEmployee(employee);
    };

    // Handler for the menu close
    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const [departmentNames, setDepartmentNames] = useState([]);
    const [designationNames, setDesignationNames] = useState([]);

    useEffect(() => {
        const fetchDepartments = async () => {
            try {
                const response = await axios.get(apiList.getDepartments, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                console.log("Department API Response:", response.data);

               

                setDepartmentNames(response.data);
                setDesignationNames(response.data);
            } catch (error) {
                console.error("Error fetching departments:", error);
            }
        };

        fetchDepartments();
    }, [token]);


    const renderAddEmpForm = () => {
        return (
            <div>
                <Dialog open={open} onClose={handleClose}>
                    <DialogTitle>Add Employee</DialogTitle>
                    <DialogContent>
                        <Grid container spacing={2}>
                            <Grid item xs={6}>
                                <TextField
                                    label="First Name"
                                    name="firstName"
                                    value={employee.firstName}
                                    onChange={(e) =>
                                        setEmployee({ ...employee, firstName: e.target.value })
                                    }
                                    fullWidth
                                    margin="normal"
                                    required
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <TextField
                                    label="Last Name"
                                    name="lastName"
                                    value={employee.lastName}
                                    onChange={(e) =>
                                        setEmployee({ ...employee, lastName: e.target.value })
                                    }
                                    fullWidth
                                    margin="normal"
                                    required
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <TextField
                                    label="Employee ID"
                                    name="employeeId"
                                    value={employee.employeeId}
                                    onChange={(e) =>
                                        setEmployee({ ...employee, employeeId: e.target.value })
                                    }
                                    fullWidth
                                    margin="normal"
                                    required
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <TextField
                                    label="Mobile"
                                    name="mobile"
                                    value={employee.mobile}
                                    onChange={(e) =>
                                        setEmployee({ ...employee, mobile: e.target.value })
                                    }
                                    fullWidth
                                    margin="normal"
                                    required
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <TextField
                                    label="Email"
                                    name="email"
                                    value={employee.email}
                                    onChange={(e) =>
                                        setEmployee({ ...employee, email: e.target.value })
                                    }
                                    fullWidth
                                    margin="normal"
                                    required
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <TextField
                                    label="Date of Birth"
                                    name="dateOfBirth"
                                    value={employee.dateOfBirth}
                                    onChange={(e) =>
                                        setEmployee({ ...employee, dateOfBirth: e.target.value })
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
                            <Grid item xs={6}>
                                <TextField
                                    label="Joining Date"
                                    name="joiningDate"
                                    value={employee.joiningDate}
                                    onChange={(e) =>
                                        setEmployee({ ...employee, joiningDate: e.target.value })
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
                            <Grid item xs={6}>
                                <FormControl fullWidth margin="normal" required>
                                    <InputLabel>Department</InputLabel>
                                    <Select
                                        name="department"
                                        value={employee.department}
                                        onChange={(e) =>
                                            setEmployee({ ...employee, department: e.target.value })
                                        }
                                    >
                                        {/* Use departmentNames state variable to dynamically generate unique MenuItems */}
                                        {[...new Set(departmentNames.map((department) => department.department))].map((uniqueDepartment) => (
                                            <MenuItem key={uniqueDepartment} value={uniqueDepartment}>
                                                {uniqueDepartment}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>

                            </Grid>
                            <Grid item xs={12}>
                                <InputLabel>Gender</InputLabel>
                                <FormControl fullWidth margin="normal" required>
                                    <RadioGroup
                                        name="gender"
                                        value={employee.gender}
                                        onChange={(e) =>
                                            setEmployee({ ...employee, gender: e.target.value })
                                        }
                                        row
                                    >
                                        <FormControlLabel
                                            value="Male"
                                            control={<Radio />}
                                            label="Male"
                                        />
                                        <FormControlLabel
                                            value="Female"
                                            control={<Radio />}
                                            label="Female"
                                        />
                                        <FormControlLabel
                                            value="Other"
                                            control={<Radio />}
                                            label="Other"
                                        />
                                    </RadioGroup>
                                </FormControl>
                            </Grid>
                            <Grid item xs={6}>
                                <FormControl fullWidth margin="normal" required>
                                    <InputLabel>Select Designation</InputLabel>
                                    <Select
                                        value={employee.designation}
                                        onChange={(e) => setEmployee({ ...employee, designation: e.target.value })}
                                    >
                                        {/* Use designationNames state variable to dynamically generate unique MenuItems */}
                                        {[...new Set(designationNames.map((designation) => designation.designation))].map((uniqueDesignation) => (
                                            <MenuItem key={uniqueDesignation} value={uniqueDesignation}>
                                                {uniqueDesignation}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>


                            </Grid>

                            <Grid item xs={6}>
                                <FormControl fullWidth margin="normal" required>
                                    <InputLabel>Role</InputLabel>
                                    <Select
                                        name="role"
                                        value={employee.role}
                                        onChange={(e) =>
                                            setEmployee({ ...employee, role: e.target.value })
                                        }
                                    >
                                        <MenuItem value="Admin">Admin</MenuItem>
                                        <MenuItem value="Manager">Manager</MenuItem>
                                        <MenuItem value="Employee">Employee</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={6}>
                                <FormControl fullWidth margin="normal" required>
                                    <InputLabel>Reporting to</InputLabel>
                                    <Select
                                        name="reporting"
                                        value={employee.report}
                                        onChange={(e) =>
                                            setEmployee({ ...employee, report: e.target.value })
                                        }
                                    >
                                        <MenuItem value="HR">HR</MenuItem>
                                        <MenuItem value="Manager">Manager</MenuItem>
                                        <MenuItem value="Technical Laed">Technical Lead</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>

                            <Grid item xs={6}>
                                <TextareaAutosize
                                    label="Address"
                                    name="address"
                                    placeholder="Address"
                                    value={employee.address}
                                    onChange={(e) =>
                                        setEmployee({ ...employee, address: e.target.value })
                                    }
                                    style={{ width: "270px", border: '1px solid #ddd', borderRadius: "5px" }}
                                    required
                                    minRows={3}
                                    maxRows={5}
                                />
                            </Grid>

                            <Grid item xs={12}>
                                <TextField
                                    label="Password"
                                    name="password"
                                    type={showPassword ? "text" : "password"}
                                    value={employee.password}
                                    onChange={(e) =>
                                        setEmployee({ ...employee, password: e.target.value })
                                    }
                                    fullWidth
                                    margin="normal"
                                    required
                                    InputProps={{
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <IconButton
                                                    onClick={() => setShowPassword(!showPassword)}
                                                    edge="end"
                                                >
                                                    {showPassword ? (
                                                        <VisibilityOffIcon />
                                                    ) : (
                                                        <VisibilityIcon style={{ color: "#ff8135" }} />
                                                    )}
                                                </IconButton>
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                            </Grid>

                            <p className="text-secondary">
                                *Password Should Contain 1 Uppercase , 1 Lowercase , 1 Number, 1
                                Special Character
                            </p>
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
                            Add Employee
                        </Button>
                    </DialogActions>
                </Dialog>
            </div>
        );
    };

    useEffect(() => {
        fetchEmployees();
    }, []);

    const fetchEmployees = async () => {
        setLoader(true);
        try {
            const response = await axios.get(apiList.allEmployees, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setLoader(false);
             
            setAllEmpEmployees(response.data);
        } catch (error) {
            console.error("Error fetching employees:", error);
        }
    };


    const handleDeleteEmployee = async () => {
        setLoader(true);
        try {
            // Make sure a valid employee is selected
            if (!selectedEmployee || !selectedEmployee._id) {
                toast.error('Invalid employee selection');
                return;
            }

            // Make an API request to delete the employee with the Authorization header
            const response = await axios.delete(`${apiList.deleteEmpoyee}/${selectedEmployee.employeeId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            toast.success(response.data.message);
            // Fetch the updated list of employees after deletion
            setLoader(false);
            fetchEmployees();
        } catch (error) {
            console.error('Error deleting employee:', error);
        } finally {
            // Close the menu
            setAnchorEl(null);
            setSelectedEmployee(null);
        }
    };

    const pageSize = 10; // Number of cards per page
const [currentPage, setCurrentPage] = useState(1);

const handlePageChange = (page) => {
  setCurrentPage(page);
};

const startIndex = (currentPage - 1) * pageSize;
const endIndex = startIndex + pageSize;


    console.log()



    return (

        <div>
            <AdminSidebar />
            <div className="layout p-5 " style={{ marginTop: "80px", marginLeft: "210px", height: '90vh', overflowY: "scroll" }}>
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

                <div className="container">
                    <div className="row">
                        <div className="col-md-6">
                            <h1 className="attendence" >
                                All Employees
                            </h1>
                        </div>
                        <div className="col-md-6">
                            <Button
                                variant="contained"
                                color="secondary"
                                style={{ margin: 8, float: "right", backgroundColor: "#ff8135", boxShadow: ' rgba(100, 100, 111, 0.2) 0px 7px 29px 0px',borderRadius: 20 }}
                                startIcon={<AddIcon />}
                                onClick={handleOpen}
                            >
                                Add Employee
                            </Button>
                        </div>
                    </div>
                </div>


                <div>
                    <div style={{ padding: 16 }} className="d-flex justify-content-between container">
                        <TextField
                            label="Employee ID"
                            value={employeeId}
                            onChange={(e) => setEmployeeId(e.target.value)}
                            style={{
                                margin: 8,
                                // border: "1px solid #ddd",
                                borderRadius: "10px",
                                padding: "5px",
                                width: "300px",
                                // boxShadow: 'rgba(100, 100, 111, 0.2) 0px 7px 29px 0px',
                            }}
                            InputProps={{
                                disableUnderline: true, // Remove the underline
                            }}
                        />
                        <TextField
                            label="Employee Name"
                            value={employeeName}
                            onChange={(e) => setEmployeeName(e.target.value)}
                            style={{
                                margin: 8,
                                // border: "1px solid #ddd",
                                borderRadius: "10px",
                                padding: "5px",
                                width: "300px",
                                // boxShadow: 'rgba(100, 100, 111, 0.2) 0px 7px 29px 0px',
                            }}
                            InputProps={{
                                disableUnderline: true, // Remove the underline
                            }}
                        />

                        <div
                            className="p-1 d-flex flex-column input-box"
                            style={{ width: "300px", margin:" -5px", borderRadius: '10px' }}
                        >
                            <FormControl fullWidth margin="normal" required>
                                <InputLabel>Select Designation</InputLabel>
                                <Select
                                    value={designation}
                                    onChange={(e) => setDesignation(e.target.value)}
                                >
                                    {/* Use designationNames state variable to dynamically generate MenuItems */}
                                    {[...new Set(designationNames.map((designation) => designation.designation))].map((uniqueDesignation) => (
                                        <MenuItem key={uniqueDesignation} value={uniqueDesignation}>
                                            {uniqueDesignation}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </div>

                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleSearch}
                            style={{
                                margin: 8,
                                border: "none",
                                borderRadius: "10px",
                                padding: "0px",
                                width: "180px",
                                height: '47px',
                                marginTop: "30px",
                                backgroundColor: "#ff8135",
                                outline: "none",
                                boxShadow: 'rgba(100, 100, 111, 0.2) 0px 7px 29px 0px',
                            }}
                            InputProps={{
                                disableUnderline: true, // Remove the underline
                            }}
                        >
                            Search
                        </Button>
                    </div>
                </div>


                <TableContainer component={Paper} style={{ boxShadow: ' rgba(100, 100, 111, 0.2) 0px 7px 29px 0px;' }} className="container p-0">
                    <Table className={classes.table} aria-label="employee table">
                        <TableHead style={{ backgroundColor: "#000" }}>
                            <TableRow>
                                <TableCell style={{ color: "#fff" }} className={classes.cell}>Name</TableCell>
                                <TableCell style={{ color: "#fff" }} className={classes.cell}>Employee ID</TableCell>
                                <TableCell style={{ color: "#fff" }} className={classes.cell}>Email</TableCell>
                                <TableCell style={{ color: "#fff" }} className={classes.cell}>Mobile</TableCell>
                                <TableCell style={{ color: "#fff" }} className={classes.cell}>Join Date</TableCell>
                                <TableCell style={{ color: "#fff" }} className={classes.cell}>Department</TableCell>
                                <TableCell style={{ color: "#fff" }} className={classes.cell}>Action</TableCell>
                            </TableRow>
                        </TableHead>
                        {loader ? (
                            <div
                                style={{
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    width: '75vw'
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
                            isNoEmplFound ? <div
                                style={{
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    width: '100vw'
                                }}
                            >
                                <h4 >{errorMsg} Try with other filters</h4>
                            </div> : (<TableBody>
                                {allEmployees.slice(startIndex, endIndex).map((employee) => (
                                    <TableRow key={employee._id}>
                                        <TableCell className="d-flex">
                                            <Avatar ></Avatar>
                                            <div className="d-flex flex-column" style={{ marginLeft: "10px" }}>
                                               <Link to={`/admin/employee/profile/${employee.employeeId}`} style={{color:"#000"}}><span style={{ fontWeight: "500" }}>{`${employee.firstName} ${employee.lastName}`}</span></Link>
                                                <span style={{ fontSize: "12px", color: "grey", fontWeight: "500" }}>{employee.designation}</span>
                                            </div>

                                        </TableCell>
                                        <TableCell className={classes.cell}>{employee.employeeId}</TableCell>
                                        <TableCell className={classes.cell}>{employee.email}</TableCell>
                                        <TableCell className={classes.cell}>{employee.mobile}</TableCell>
                                        <TableCell className={classes.cell}>
                                            {format(new Date(employee.joiningDate), "dd-MM-yyyy")}
                                        </TableCell>
                                        <TableCell className={classes.cell}>{employee.department}</TableCell>
                                        <TableCell className={classes.cell}>
                                            <IconButton
                                                className={classes.menuButton}
                                                aria-label="more"
                                                aria-controls="simple-menu"
                                                aria-haspopup="true"
                                                onClick={(event) => handleMenuClick(event, employee)}
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
                                                <MenuItem onClick={handleMenuClose}>
                                                    <EditIcon color="secondary" />
                                                    <span style={{ marginLeft: "10px" }}>update</span>
                                                </MenuItem>
                                                <MenuItem onClick={handleDeleteEmployee}>
                                                    <DeleteIcon color="action" />
                                                    <span style={{ marginLeft: "10px" }}>delete</span>
                                                </MenuItem>
                                            </Menu>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>)
                        )}
                    </Table>
                </TableContainer>
                {open && renderAddEmpForm()}

               
                <Pagination
            current={currentPage}
            onChange={handlePageChange}
            defaultPageSize={pageSize}
            className="my-3"
            total={allEmployees ? allEmployees.length : 0}
            style={{ width: 800, margin: "auto", textAlign: "center" }}
          />

            </div>
        </div>
    );
};

export default AllEmployees;