import React, { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";import { Pagination } from "antd";
import {
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Paper,
} from "@material-ui/core";
import { ThreeDots } from "react-loader-spinner";
import apiList from "../lib/apiList";

import EmployeeSidebar from "./EmployeeSidebar";
import EmployeeNavbar from "./EmployeeNavbar";

// The main component for the dashboard
const Holidays = () => {
	const [holidays, setHolidays] = useState([]);
	const [loader, setLoader] = useState(true);
	const token = Cookies.get('employeeToken')

	useEffect(() => {
		fetchHolidays();
	}, []);

	const fetchHolidays = async () => {
		try {
			const response = await axios.get(apiList.getHolidays, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});
	
			// Sort the holidays by date in descending order
			const sortedHolidays = response.data.sort((a, b) => {
				const dateA = new Date(a.date);
				const dateB = new Date(b.date);
				return dateB - dateA;
			});
	
			console.log(sortedHolidays);
	
			setHolidays(sortedHolidays);
			setLoader(false);
		} catch (error) {
			console.error("Error fetching holidays:", error);
		}
	};
	
	// A function to render the table row
	const renderRow = (row, index) => {
		return (
			<TableRow key={row._id}>
				<TableCell>{index + 1}</TableCell>
				<TableCell>{row.title}</TableCell>
				<TableCell>{row.date}</TableCell>
				<TableCell>{row.day}</TableCell>
				<TableCell>{row.action}</TableCell>
			</TableRow>
		);
	};

	// A function to render the table component
	const renderTable = () => {
		return (
			<TableContainer component={Paper}>
				<Table>
					<TableHead style={{ backgroundColor: "#000" }}>
						<TableRow>
							<TableCell style={{fontSize:"17px" , fontWeight:"600", color:"#fff"}}>#</TableCell>
							<TableCell style={{fontSize:"17px" , fontWeight:"600", color:"#fff"}}>Title</TableCell>
							<TableCell style={{fontSize:"17px" , fontWeight:"600", color:"#fff"}}>Holiday Date</TableCell>
							<TableCell style={{fontSize:"17px" , fontWeight:"600", color:"#fff"}}>Day</TableCell>
							<TableCell style={{fontSize:"17px" , fontWeight:"600", color:"#fff"}}>Action</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{holidays.slice(startIndex, endIndex).map((row, index) => renderRow(row, index))}
					</TableBody>
				</Table>
			</TableContainer>
		);
	};
	const pageSize = 8; // Number of cards per page
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
			<div className=" p-5" style={{marginLeft:"250px",marginTop:"80px",height:"80vh",overflowY:"scroll" }}>
				<h2 className="attendence">HOLIDAYS</h2>
				{loader ? (
					<div
						style={{
							display: "flex",
							justifyContent: "center",
							alignItems: "center",
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
					renderTable()
				)}
				<Pagination
					
					current={currentPage}
					onChange={handlePageChange}
					defaultPageSize={pageSize}
					className="my-3 fixed-bottom pagenation_item"
					total={holidays ? holidays.length : 0}
					style={{ width: 800, margin: "auto", textAlign: "center" }}
				/>
			</div>
		</>
	);
};

export default Holidays;