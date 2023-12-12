import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Card, CardContent, Typography, Avatar, Grid } from "@material-ui/core";
import Navbar from "./AdminNavBar";
import Sidebars from "./AdminSidebar";
import { useParams } from "react-router-dom";
import Cookies from "js-cookie";
import apiList from "../lib/apiList";
import axios from "axios";
import { format } from "date-fns";

// Sample data for the employee


// Styles for the dashboard
const useStyles = makeStyles((theme) => ({
	root: {
		maxWidth: "100%",
		margin: "auto",
		marginTop: theme.spacing(4),
	},
	avatar: {
		width: theme.spacing(17),
		height: theme.spacing(17),
		margin: "auto",
	},
	section: {
		marginTop: theme.spacing(2),
		marginBottom: theme.spacing(2),
	},
	title: {
		fontWeight: "bold",
	},
	info: {
		marginLeft: theme.spacing(2),
	},
}));

// Component for the dashboard
const EmpPloyeeProfile = () => {
	const classes = useStyles();

	const [employee, setEmployee] = useState(null);
	let params = useParams();

	const {employeeId} = params;

	const fetchEmployeeDetails = async () => {
		try {
			
			
			
			const response = await axios.get(`${apiList.individualEmployee}/${employeeId}`);
			
			setEmployee(response.data);
		
			console.log(response.data);
		} catch (error) {
			console.error('Error fetching employee details:', error);
		}
	};

	useEffect(() => {
		fetchEmployeeDetails();
	}, []);



	// Helper function to render a section with a title and a list of items
	const renderSection = (title, items) => {
		return (
			<div className={classes.section}>
				<Typography variant="h6" className={classes.title}>
					{title}
				</Typography>
				<Grid container spacing={2}>
					{items.map((item, index) => (
						<Grid item key={index} xs={6} sm={4}>
							<Typography variant="body1">{item}</Typography>
						</Grid>
					))}
				</Grid>
			</div>
		);
	};

	return (
		<>
			< Sidebars/>
			
			<div className="container">
				{employee && (<div
					className="row mb-3"
					style={{ paddingTop: "100px", marginLeft: "150px" }}
				>
					<div className="col-md-6 mb-3">
						<Grid container alignItems="center">
							<div className="card img_card text-center">
								<div item xs={12} sm={4}>
									<div className="text-center mt-4">
										<Avatar
											src=""
											alt="Employee photo"
											className={classes.avatar}
										/>
									</div>

									<div className="mt-4">
										<Typography variant="h5" className={classes.title}>
											{employee.firstName} {employee.lastName}
										</Typography>
									</div>


									<Typography variant="body1">ID : {employee.employeeId}</Typography>
									<Typography variant="body1" className="mb-3">
										Date of Joining :  {format(new Date(employee.joiningDate), "dd-MM-yyyy")}
									</Typography>
								</div>
							</div>
						</Grid>
					</div>
					<div className="col-md-6 mb-3">
						<div className="card img_card">
							<Grid item xs={12} sm={8} className={classes.info}>
								<Typography
									variant="body1"
									className="mt-3"
									style={{ fontSize: "17px", fontWeight: "500", display: "flex", justifyContent: "space-between" }}
								>
									<span>Email </span><span> : </span> <span className="emp_colors">{employee.email}</span>
								</Typography>
								<Typography
									variant="body1"
									className="mt-3"
									style={{ fontSize: "17px", fontWeight: "500", display: "flex", justifyContent: "space-between" }}
								>
									<span> Phone </span><span> : </span>  <span className="emp_colors">{employee.mobile}</span>
								</Typography>
								<Typography
									variant="body1"
									className="mt-3"
									style={{ fontSize: "17px", fontWeight: "500", display: "flex", justifyContent: "space-between" }}
								>
									<span>Date Of Birth </span> <span> : </span>  <span className="emp_colors"> {format(new Date(employee.dateOfBirth), "dd-MM-yyyy")}</span>
								</Typography>
								<Typography
									variant="body1"
									className="mt-3"
									style={{ fontSize: "17px", fontWeight: "500", display: "flex", justifyContent: "space-between" }}
								>
									<span> Address  </span> <span> : </span> <span className="emp_colors">{employee.address}</span>
								</Typography>
								<Typography
									variant="body1"
									className="mt-3"
									style={{ fontSize: "17px", fontWeight: "500", display: "flex", justifyContent: "space-between" }}
								>
									<span>Gender </span>  <span> : </span> <span className="emp_colors">{employee.gender}</span>
								</Typography>
								<Typography
									variant="body1"
									className="mt-3"
									style={{ fontSize: "17px", fontWeight: "500", display: "flex", justifyContent: "space-between" }}
								>
									<span>Reports To </span> <span> : </span>  <span className="emp_colors">{employee.report}</span>
								</Typography>
							</Grid>
						</div>
					</div>
					<div className="col-md-6">
						<div className="card img_card1">
							<h4 className="my-3 pl-3">Personal Information</h4>
							<Grid item xs={12} sm={8} className={classes.info}>
								<Typography
									variant="body1"
									className=""
									style={{ fontSize: "17px", fontWeight: "500", display: "flex", justifyContent: "space-between" }}
								>
									<span>Passport No</span> <span>--</span>  <span className="emp_colors"></span>
								</Typography>
								<Typography
									variant="body1"
									className="mt-3"
									style={{ fontSize: "17px", fontWeight: "500", display: "flex", justifyContent: "space-between" }}
								>
									<span>Passport Exp Date</span> <span>--</span>  <span className="emp_colors"></span>
								</Typography>
								<Typography
									variant="body1"
									className="mt-3"
									style={{ fontSize: "17px", fontWeight: "500", display: "flex", justifyContent: "space-between" }}
								>
									<span>Tel</span> <span>--</span>  <span className="emp_colors"></span>
								</Typography>
								<Typography
									variant="body1"
									className="mt-3"
									style={{ fontSize: "17px", fontWeight: "500", display: "flex", justifyContent: "space-between" }}
								>
									<span>Nationality </span> <span>--</span>  <span className="emp_colors">{employee.nationality}</span>
								</Typography>
								<Typography
									variant="body1"
									className="mt-3"
									style={{ fontSize: "17px", fontWeight: "500", display: "flex", justifyContent: "space-between" }}
								>
									<span>Religion</span> <span>--</span>  <span className="emp_colors"></span>
								</Typography>
								<Typography
									variant="body1"
									className="mt-3"
									style={{ fontSize: "17px", fontWeight: "500", display: "flex", justifyContent: "space-between" }}
								>
									<span>Marital Status </span> <span>--</span>   <span className="emp_colors">{employee.maritalStatus}</span>
								</Typography>
								<Typography
									variant="body1"
									className="mt-3"
									style={{ fontSize: "17px", fontWeight: "500", display: "flex", justifyContent: "space-between" }}
								>
									<span>Employement of Spouse</span> <span>--</span>  <span className="emp_colors"></span>
								</Typography>
								<Typography
									variant="body1"
									className="mt-3 mb-3"
									style={{ fontSize: "17px", fontWeight: "500", display: "flex", justifyContent: "space-between" }}
								>
									<span>No of Childrens</span> <span>--</span>  <span className="emp_colors"></span>
								</Typography>
							</Grid>
						</div>
					</div>
					<div className="col-md-6">
						<div className="card img_card1">
							<h4 className="my-3 pl-3">Emergency Contact</h4>
							<Grid item xs={12} sm={8} className={classes.info}>
								<Typography
									variant="body1"
									className=""
									style={{ fontSize: "17px", fontWeight: "500", display: "flex", justifyContent: "space-between" }}
								>
									<span>Primary</span> <span>--</span>  <span className="emp_colors"></span>
								</Typography>
								<Typography
									variant="body1"
									className="mt-3"
									style={{ fontSize: "17px", fontWeight: "500", display: "flex", justifyContent: "space-between" }}
								>
									<span>Name</span> <span>--</span>  <span className="emp_colors"></span>
								</Typography>
								<Typography
									variant="body1"
									className="mt-3"
									style={{ fontSize: "17px", fontWeight: "500", display: "flex", justifyContent: "space-between" }}
								>
									<span>Relationship</span> <span>--</span>  <span className="emp_colors"></span>
								</Typography>
								<Typography
									variant="body1"
									className="mt-3 mb-2"
									style={{ fontSize: "17px", fontWeight: "500", display: "flex", justifyContent: "space-between" }}
								>
									<span>Phone</span> <span>--</span>  <span className="emp_colors"></span>
								</Typography>
								<div
									style={{ borderBottom: "1px solid #c6c3c3", width: "430px" }}
								></div>
								<Typography
									variant="body1"
									className="mt-2"
									style={{ fontSize: "17px", fontWeight: "500", display: "flex", justifyContent: "space-between" }}
								>
									<span>Secondary</span> <span>--</span>  <span className="emp_colors"></span>
								</Typography>
								<Typography
									variant="body1"
									className="mt-3"
									style={{ fontSize: "17px", fontWeight: "500", display: "flex", justifyContent: "space-between" }}
								>
									<span>Name</span> <span>--</span>  <span className="emp_colors"></span>
								</Typography>
								<Typography
									variant="body1"
									className="mt-3"
									style={{ fontSize: "17px", fontWeight: "500", display: "flex", justifyContent: "space-between" }}
								>
									<span>Relationship</span> <span>--</span>  <span className="emp_colors"></span>
								</Typography>
								<Typography
									variant="body1"
									className="mt-3 mb-3"
									style={{ fontSize: "17px", fontWeight: "500", display: "flex", justifyContent: "space-between" }}
								>
									<span>Phone</span> <span>--</span>  <span className="emp_colors"></span>
								</Typography>
							</Grid>
						</div>
					</div>
					<div className="col-md-6 mt-3">
						<div className="card img_card1">
							<h4 className="my-3 pl-3">Bank Information</h4>
							<Grid item xs={12} sm={8} className={classes.info}>
								<Typography
									variant="body1"
									className=""
									style={{ fontSize: "17px", fontWeight: "500", display: "flex", justifyContent: "space-between" }}
								>
									<span>Bank Name</span> <span>--</span>   <span className="emp_colors">{employee.bankName}</span>
								</Typography>
								<Typography
									variant="body1"
									className="mt-3"
									style={{ fontSize: "17px", fontWeight: "500", display: "flex", justifyContent: "space-between" }}
								>
									<span>Bank Account No</span> <span>--</span>  <span className="emp_colors">{employee.bankAccount}</span>
								</Typography>
								<Typography
									variant="body1"
									className="mt-3"
									style={{ fontSize: "17px", fontWeight: "500", display: "flex", justifyContent: "space-between" }}
								>
									<span>IFSC Code</span> <span>--</span>  <span className="emp_colors"></span>
								</Typography>
								<Typography
									variant="body1"
									className="mt-3 mb-3"
									style={{ fontSize: "17px", fontWeight: "500", display: "flex", justifyContent: "space-between" }}
								>
									<span>PAN No</span> <span>--</span>  <span className="emp_colors"></span>
								</Typography>
							</Grid>
						</div>
					</div>
					<div className="col-md-6 mt-3">
						<div className="card img_card1 p-3">
							<h4 className="">Family Information</h4>
							<div style={{ height: "155px", overflowY: "scroll" }}>
								<table className="table table-bordered text-center table_head ">
									<thead className="sticky-top">
										<tr>
											<th style={{ backgroundColor: "#000", color: "#fff" }}>
												Name
											</th>
											<th style={{ backgroundColor: "#000", color: "#fff" }}>
												Relationship
											</th>
											<th style={{ backgroundColor: "#000", color: "#fff" }}>
												DOB
											</th>
											<th style={{ backgroundColor: "#000", color: "#fff" }}>
												Phone
											</th>
										</tr>
									</thead>
									<tbody className="table_row">
										<tr>
											<td>{employee.name}</td>
											<td>{employee.relation} Spouse</td>
											<td>{employee.Dob}</td>
											<td>{employee.phone}</td>
										</tr>
										<tr>
											<td>{employee.name}</td>
											<td>{employee.relation} son</td>
											<td>{employee.Dob}</td>
											<td>{employee.phone}</td>
										</tr>
										<tr>
											<td>{employee.name}</td>
											<td>{employee.relation}Daughter</td>
											<td>{employee.Dob}</td>
											<td>{employee.phone}</td>
										</tr>
									</tbody>
								</table>
							</div>
						</div>
					</div>
				</div>

				)}

			</div>
		</>
	);
};

export default EmpPloyeeProfile;