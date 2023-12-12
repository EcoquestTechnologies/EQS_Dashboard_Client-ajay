import React, { useState, useEffect } from "react";
import { Menu, MenuItem } from "@material-ui/core";
import { MoreVert as MoreVertIcon } from "@material-ui/icons";
import axios from "axios";
import Cookies from "js-cookie";
import AddIcon from "@material-ui/icons/Add";
import apiList from "../lib/apiList";


import {
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
	Select,
	InputLabel,
	TextField,
	TextareaAutosize,
} from "@material-ui/core";
import { useForm, Controller } from "react-hook-form";
import { Pagination } from "antd";
import {
	IconButton,
	Drawer,
	List,
	ListItem,
	ListItemText,
	Table,
	TableContainer,
	TableHead,
	TableBody,
	TableRow,
	TableCell,
	Paper,
	Button,
	makeStyles,
} from "@material-ui/core";

import StatusDot from "../components/StatusDot";

import { ToastContainer, toast, Zoom } from "react-toastify";

import { ThreeDots } from "react-loader-spinner";
import EmployeeNavbar from "./EmployeeNavbar";
import EmployeeSidebar from "./EmployeeSidebar";

const useStyles = makeStyles((theme) => ({
	header: {
		backgroundColor: "#00022e",
		color: "#fc86aa",
	},
	drawer: {
		width: 240,
		backgroundColor: "#d8dcd6",
	},
	main: {
		flex: 1,
		backgroundColor: "#ffffff",
		padding: theme.spacing(3),
	},
	table: {
		minWidth: 650,
	},
	button: {
		position: "absolute",
		backgroundColor: "#ff8135",
		top: "95px",
		right: theme.spacing(3),
	},

	textarea: {
		width: "100%",
		marginTop: theme.spacing(2),
	},
}));

function Leaves() {
	const classes = useStyles();
	const [isOpened, setIsOpened] = useState(false);
	const [anchorEl, setAnchorEl] = useState(null);
	const [selectedIndex, setSelectedIndex] = useState(null);
	const [isEdit, setIsEdit] = useState(false);
	const [editingLeave, setEditingLeave] = useState(null);

	const [open, setOpen] = useState(false);
	const [loader, setLoader] = useState(true);
	const [allLeaves, setAllLeaves] = useState([]);

	const { control, handleSubmit, reset, formState } = useForm();

	const employeeId = Cookies.get('employeeId');

	const token = Cookies.get('employeeToken')

	const handleClose = () => {
		setOpen(false);
	};

	const onSubmit = async (data) => {
		try {
			if (isEdit) {
				// Handle update logic for existing leave
				const areAllFieldsFilled = Object.values(data).some(
					(value) => value === undefined
				);

				if (areAllFieldsFilled) {
					// Display toast message and return early if any field is empty
					toast.error("Please fill in all fields");
					return;
				} else {
					const response = await axios.put(
						`${apiList.updateLeave}/${employeeId}/${editingLeave._id}`,
						{
							data,
						},
						{
							headers: {
								Authorization: `Bearer ${token}`,
							},
						}
					);
					// Handle the response as needed
					toast.success(response.data.message);
					handleClose();
					setLoader(false);
					handleMenuClose();
					fetchData();
				}
			} else {
				//apply new leave
				const areAllFieldsFilled = Object.values(data).some(
					(value) => value === undefined
				);

				if (areAllFieldsFilled) {
					// Display toast message and return early if any field is empty
					toast.error("Please fill in all fields");
					return;
				} else {
					// Add employeeId to the data
					data.employeeId = employeeId;

					// Call the Apply Leave API
					const response = await axios.post(apiList.applyLeave, data, {
						headers: {
							Authorization: `Bearer ${token}`,
						},
					});

					// Handle the response as needed
					toast.success(response.data.message);
					setLoader(false);
					fetchData();
				}

				// Reset the form and close the dialog
				reset();
				handleClose();
			}
		} catch (error) {
			console.error("Error applying for leave:", error);
		}
	};


	const handleMenuOpen = (event, index) => {
		setAnchorEl(event.currentTarget);
		setSelectedIndex(index);

		// Set the form in edit mode and store the leave details
		setIsEdit(true);
		setEditingLeave(allLeaves[index]);
	};

	const handleMenuClose = () => {
		setAnchorEl(null);
		setSelectedIndex(null);
	};

	const handleDelete = async () => {
		try {
			if (selectedIndex !== null) {
				const leaveIdToDelete = allLeaves[selectedIndex]._id;
				setLoader(true);
				const response = await axios.delete(
					`${apiList.deleteLeave}/${employeeId}/${leaveIdToDelete}`,
					{
						headers: {
							Authorization: `Bearer ${token}`,
						},
					}
				);
				// Handle the response as needed
				toast.success(response.data.message);
				// Refresh the leave data after deletion
				setLoader(false);
				fetchData();
			}
		} catch (error) {
			console.error("Error deleting leave:", error);
		} finally {
			// Close the menu after the operation
			handleMenuClose();
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




	const renderLeaveForm = () => (
		<Dialog open={open} onClose={handleClose}>
			<form onSubmit={handleSubmit(onSubmit)}>
				<DialogTitle>{isEdit ? "Edit Leave" : "Apply for Leave"}</DialogTitle>
				<DialogContent>
					<InputLabel id="leave-type">Leave Type</InputLabel>
					<Controller
						name="leaveType"
						control={control}
						render={({ field }) => (
							<Select
								labelId="leave-type-label"
								id="leave-type"
								name="leaveType"
								value={field.value}
								onChange={(e) => field.onChange(e)}
								rules={{ required: "Leave type is required" }}
								fullWidth
							>
								{leaveTypes.map((leaveType) => (
									<MenuItem key={leaveType._id} value={leaveType.leaveType}>
										{leaveType.leaveType}
									</MenuItem>
								))}
							</Select>
						)}
					/>

					<Controller
						name="from"
						control={control}
						render={({ field }) => (
							<TextField
								className="mt-2"
								label="From"
								type="date"
								InputLabelProps={{
									shrink: true,
								}}
								fullWidth
								value={field.value}
								onChange={(e) => field.onChange(e.target.value)}
								{...field}
							/>
						)}
					/>

					<Controller
						name="to"
						control={control}
						render={({ field }) => (
							<TextField
								className="mt-2"
								{...field}
								label="To"
								type="date"
								InputLabelProps={{
									shrink: true,
								}}
								fullWidth
								value={field.value}
								onChange={(e) => field.onChange(e.target.value)}
								rules={{ required: "To date is required" }}
							/>
						)}
					/>

					<Controller
						name="days"
						control={control}
						render={({ field }) => (
							<TextField
								{...field}
								name="days"
								label="Number of days"
								type="number"
								InputLabelProps={{
									shrink: true,
								}}
								fullWidth
								value={field.value}
								onChange={(e) => field.onChange(e)}
								rules={{ required: "Days are required" }}
							/>
						)}
					/>
					<Controller
						name="reason"
						control={control}
						render={({ field }) => (
							<TextareaAutosize
								{...field}
								className={`${classes.textarea} mt-2 p-1`}
								name="reason"
								placeholder="Leave Reason"
								rowsMin={3}
								fullWidth
								value={field.value}
								onChange={(e) => field.onChange(e)}
								rules={{ required: "Leave reason is required" }}
							/>
						)}
					/>
				</DialogContent>
				<DialogActions>
					<Button
						type="submit"
						style={{ backgroundColor: "#ff8135", color: "#fff" }}
						disabled={!formState.isValid || formState.isSubmitting}
					>
						{isEdit ? "Update" : "Submit"}
					</Button>
				</DialogActions>
			</form>
		</Dialog>
	);

	useEffect(() => {
		fetchData();
	}, []);

	useEffect(() => {
		if (isEdit && editingLeave) {
			reset({
				leaveType: editingLeave.type,
				from: editingLeave.from,
				to: editingLeave.to,
				days: editingLeave.days,
				reason: editingLeave.reason,
			});
		} else {
			reset();
		}
	}, [isEdit, editingLeave]);

	const fetchData = async () => {
		try {
			const response = await axios.get(
				`${apiList.employeeLeaves}/${employeeId}`,
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			);

			setAllLeaves(response.data); // Assuming the server returns an array of leave data
			setLoader(false);
		} catch (error) {
			console.error("Error fetching leave data:", error);
		}
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
			<div className="App" style={{ marginLeft: "250px", marginTop: "80px", height: "80vh", overflowY: "scroll" }}>
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
				<Drawer
					variant="persistent"
					anchor="left"
					open={isOpened}
					className={classes.drawer}
				>
					<List>
						<ListItem>
							<ListItemText primary="Sick leave" secondary="1/1" />
						</ListItem>
						<ListItem>
							<ListItemText primary="Personal leave" secondary="6/3" />
						</ListItem>
					</List>
				</Drawer>
				<main className={classes.main}>
					<h2 className="attendence mt-3" >LEAVES</h2>
					{loader ? (
						<div
							style={{
								display: "flex",
								justifyContent: "center",
								alignItems: "center",
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
						<TableContainer component={Paper}>
							<Table className={classes.table} aria-label="simple table">
								<TableHead style={{ backgroundColor: "#000" }}>
									<TableRow >
										<TableCell style={{ fontSize: "17px", fontWeight: "600", color: "#fff" }}>Type</TableCell>
										<TableCell style={{ fontSize: "17px", fontWeight: "600", color: "#fff" }}>From</TableCell>
										<TableCell style={{ fontSize: "17px", fontWeight: "600", color: "#fff" }}>To</TableCell>
										<TableCell style={{ fontSize: "17px", fontWeight: "600", color: "#fff" }}>No of Days</TableCell>
										<TableCell style={{ fontSize: "17px", fontWeight: "600", color: "#fff" }}>Reason</TableCell>
										<TableCell style={{ fontSize: "17px", fontWeight: "600", color: "#fff" }}>Status</TableCell>
										<TableCell style={{ fontSize: "17px", fontWeight: "600", color: "#fff" }}>Action By</TableCell>
										<TableCell style={{ fontSize: "17px", fontWeight: "600", color: "#fff" }}>Action</TableCell>
									</TableRow>
								</TableHead>
								<TableBody>
									{allLeaves.slice(startIndex, endIndex).map((row, index) => (
										<TableRow key={row._id}>
											<TableCell>{row.type}</TableCell>
											<TableCell>{row.from}</TableCell>
											<TableCell>{row.to}</TableCell>
											<TableCell>{row.days}</TableCell>
											<TableCell>{row.reason}</TableCell>
											<TableCell>
												<div className="status-container">
													<StatusDot status={row.status} />
													<span>{row.status}</span>
												</div>
											</TableCell>
											<TableCell>{row.actionBy}</TableCell>
											<TableCell>
												<IconButton
													onClick={(event) => handleMenuOpen(event, index)}
												>
													<MoreVertIcon />
												</IconButton>
											</TableCell>
											<Menu
												anchorEl={anchorEl}
												keepMounted
												open={index === selectedIndex}
												onClose={handleMenuClose}
											>
												<MenuItem onClick={() => setOpen(true)}>Edit</MenuItem>
												<MenuItem onClick={handleDelete}>Delete</MenuItem>
											</Menu>
										</TableRow>
									))}
								</TableBody>
							</Table>
						</TableContainer>
					)}
					<Button
						variant="contained"
						color="#ff8135"
						className={classes.button}
						onClick={setOpen}
						endIcon={<AddIcon />}
						style={{
							color: "#fff"
						}}
					>
						Apply for leave
					</Button>
					{open && renderLeaveForm()}
					<Pagination

						current={currentPage}
						onChange={handlePageChange}
						defaultPageSize={pageSize}
						className="my-3"
						total={allLeaves ? allLeaves.length : 0}
						style={{ width: 800, margin: "auto", textAlign: "center" }}
					/>

				</main>
			</div>
		</>
	);
}

export default Leaves;