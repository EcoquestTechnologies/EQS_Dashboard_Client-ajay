import React, { useEffect, useState } from "react";
import axios from "axios";
import { Timeline } from "antd";
import { ToastContainer, toast } from "react-toastify";
import Cookies from "js-cookie";
import { ThreeDots } from "react-loader-spinner";
import apiList from "../lib/apiList";
import { Link, useNavigate } from "react-router-dom";
import { Zoom } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "react-vertical-timeline-component/style.min.css";
import EmployeeNavbar from "./EmployeeNavbar";
import EmployeeSidebar from "./EmployeeSidebar";

const EmpDashboard = () => {
	let navigate = useNavigate();
	const [isPunchedIn, setIsPunchedIn] = useState(false);
	const [todayPunches, setTodayPunches] = useState([]);

	const [loader, setLoader] = useState(true);


	const employeeId = Cookies.get('employeeId');
	const token = Cookies.get('employeeToken')
	const isTokenValid = () => {
		const jwtToken = Cookies.get("employeeToken");

		// Check if the token exists and is not expired
		return jwtToken ? true : false;
	};

	useEffect(() => {
		if (!isTokenValid()) {
			navigate("/");
		}

		fetchData();
	}, [employeeId]);

	const fetchData = async () => {
		try {

			const response = await axios.get(`${apiList.punches}/${employeeId}`, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});



			const punches = response.data.punches;
			// Check if the employee is currently punched in
			const latestPunch =
				punches.length > 0 ? punches[punches.length - 1] : null;
			const allPunches = response.data.punches;

			// Filter punches for today
			const today = new Date().toLocaleDateString();
			const todayPunches = allPunches.filter(
				(punch) => new Date(punch.punchIn).toLocaleDateString() === today
			);


			setTodayPunches(todayPunches);
			setIsPunchedIn(!!latestPunch && !latestPunch.punchOut);
			setLoader(false);
		} catch (error) {
			console.error("Error fetching punches:", error);
		}
	};

	const handlePunchIn = async () => {
		try {
			const response = await axios.post(apiList.punchIn, {
				employeeId,
				employeeName: Cookies.get("employeeName")
			}, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});

			toast.success(response.data.message);
			setIsPunchedIn(true);
			setLoader(false);

		} catch (error) {
			console.error("Error punching in:", error);
		}
		fetchData();
	};

	const handlePunchOut = async () => {
		try {
			const response = await axios.post(apiList.punchOut, {
				employeeId,
				employeeName: Cookies.get("employeeName")
			}, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});


			toast.success(response.data.message);
			setIsPunchedIn(false);
			setLoader(false);

		} catch (error) {
			console.error("Error punching out:", error);
		}
		fetchData();
	};


	const formatTime = (seconds) => {
		const hours = Math.floor(seconds / 3600);
		const minutes = Math.floor((seconds % 3600) / 60);
		return `${hours.toString().padStart(2, "0")}:${minutes
			.toString()
			.padStart(2, "0")}`;
	};

	// Calculate total working time outside the loop
	const totalWorkingTime = todayPunches.reduce(
		(acc, punch) => acc + (punch.totalWorkingTime || 0),
		0
	);

	const totalBreakTime = todayPunches.reduce(
		(acc, punch) => acc + (punch.breakTime || 0),
		0
	);



	function getCurrentDate() {
		let date = new Date();
		let options = {
			weekday: "long",
			year: "numeric",
			month: "long",
			day: "numeric",
		};
		return date.toLocaleDateString("en-US", options);
	}


	return (
		<>
			
			<EmployeeSidebar/>

			<div
				className="p-5 "
				style={{ marginLeft: "220px",marginTop:"80px",height:"80vh",overflowY:"scroll" }}
			>
				<div className="d-flex align-items-center ">
					
					<div className="p-1 mt-3 ml-2">
						<span style={{ fontSize: "17px", color: "#ff8315", paddingBottom: '0px', fontWeight: "500", fontFamily: "sans-serif" }}>Welcome , <br /></span>
						<div style={{ fontSize: "27px", fontWeight: "600", textTransform: "capitalize", fontFamily: "sans-serif" }}>
							{Cookies.get("employeeName")}
						</div>
						<p>{getCurrentDate()}</p>
					</div>
				</div>

				<div className="d-flex justify-content-center mb-4">
					<div
						className="card card_item d-flex flex-column justify-content-between text-center p-3 mt-4"
						style={{ borderRadius: "10px" }}
					>
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
							theme="light" />


						<h4 className="mb-3 employee_timeset ">
							Timesheet{" "}
							<span style={{ color: "grey" }}>{new Date().toDateString()}</span>
						</h4>

						<div style={{backgroundColor: "#dddddd52",
								width: "300px",
								borderRadius: "10px",
								margin:"10px 10px",
								color: "black",
								paddingTop: "15px",
								fontSize:"18px",
								fontWeight:"500"}}>
						<p>{todayPunches[0]?.punchIn &&
							`Punch In at  ${new Date(
								todayPunches[0].punchIn
							).toLocaleTimeString()}`}
						</p>



						</div>
						{isPunchedIn ? (
							<button
								onClick={handlePunchOut}
								className="punch align-self-center"
							>
								Punch Out
							</button>
						) : (
							<button
								onClick={handlePunchIn}
								className="punch align-self-center"
							>
								Punch In
							</button>
						)}
						<div className="d-flex justify-content-between ">
							<p className="border employee_working p-2 m-2 " style={{ borderRadius: "10px" }}>
								Working Time
								<br /> <span style={{color:"#ff8135"}}>{formatTime(totalWorkingTime)} HRS</span>
							</p>
							<p className="border employee_working p-2 m-2 " style={{ borderRadius: "10px" }}>
								Break Time
								<br /><span style={{color:"#ff8135"}}> {formatTime(totalBreakTime)} HRS</span>
							</p>
						</div>
					</div>
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
						<div
							className="card card_item timesheet-timeline mt-4 ml-3"
							style={{
								width: "350px",
								height: "335px",
								overflowY: "scroll",
								// padding: "20px",
								borderRadius: "10px",
								marginLeft: "20px",
							}}
						>
							<div className="sticky-top">
							<h4
								className=" text-center sticky-top Employee_activity mb-4"
								style={{ backgroundColor: "#ddd", padding: "15px" }}
							>
								Today Activity
							</h4>
							</div>
							<Timeline
								mode="left "
								className="ml-3 "
								style={{ paddingLeft: "10px" }}
							>
								{todayPunches.map((punch, index) => (
									<React.Fragment key={index}>
										{punch.lastPunchType && (
											<Timeline.Item
												dot={
													<div
														style={{
															backgroundColor: "#ddd",
															width: "10px",
															height: "10px",
															borderRadius: "50%",
														}}
													/>
												}
											>
												<p>
													{punch.punchIn &&
														`Punch In at  ${new Date(
															punch.punchIn
														).toLocaleTimeString()}`}
												</p>
											</Timeline.Item>
										)}
										{punch.lastPunchType && (
											<Timeline.Item
												dot={
													<div
														style={{
															backgroundColor: "#ddd",
															width: "15px",
															height: "15px",
															borderRadius: "50%",
														}}
													/>
												}
											>
												<p>
													{punch.punchOut &&
														`Punch Out at ${new Date(
															punch.punchOut
														).toLocaleTimeString()}`}
												</p>
											</Timeline.Item>
										)}
									</React.Fragment>
								))}
							</Timeline>
						</div>
					)}
				</div>





				<div className="">
					<div className="mt-3 changes">
						<div className=" row dash-sidebar ">
							<div className="col-lg-4">
								<section>
									<h5
										className="dash-title mb-3"
										style={{ textAlign: "center" }}
									>
										Projects
									</h5>
									<Link
										to="/app/projects/task-board"
										className="link_item"
										style={{ color: "#000" }}
									>
										<div className="card card_item" style={{ height: "155px" }}>
											<div className="card-body ">
												<div className="text-center">
													<div className="d-flex justify-content-between col-12 ">
														<span
															style={{ fontSize: "16px", fontWeight: "500" }}
														>
															Total Tasks
														</span>
														<span>--</span>
													</div>
													<div className="d-flex justify-content-between col-12 mt-3">
														<span
															style={{ fontSize: "16px", fontWeight: "500" }}
														>
															Pending Tasks
														</span>
														<span>--</span>
													</div>
													<div className="d-flex justify-content-between col-12 mt-3">
														<span
															style={{ fontSize: "16px", fontWeight: "500" }}
														>
															Total Projects
														</span>
														<span>--</span>
													</div>
												</div>
												{/* <div className="request-btn">
                          
                        </div> */}
											</div>
										</div>
									</Link>
								</section>
							</div>
							<div className="col-lg-4">
								<section>
									<h5
										className="dash-title mb-3"
										style={{ textAlign: "center" }}
									>
										Your Leave
									</h5>
									<Link
										to="/employee/leaves"
										className="link_item"
										style={{ color: "#000" }}
									>
										<div className="card card_item" style={{ height: "155px" }}>
											<div className="card-body">
												<div className="text-center">
													<div className="d-flex justify-content-between  col-12 mt-2">
														<span
															style={{ fontSize: "16px", fontWeight: "500" }}
														>
															Leave Taken
														</span>
														<span>--</span>
													</div>
													<div className="d-flex justify-content-between col-12 mt-3">
														<span
															style={{ fontSize: "16px", fontWeight: "500" }}
														>
															Remaining
														</span>
														<span>--</span>
													</div>
													<div className="d-flex justify-content-center  col-12 mt-3">
														<button className=" btn-grad1">
															Apply Leave
														</button>
													</div>
												</div>
												{/* <div className="request-btn">
                          
                        </div> */}
											</div>
										</div>
									</Link>
								</section>
							</div>
							<div className="col-lg-4">
								<section>
									<h5
										className="dash-title mb-3"
										style={{ textAlign: "center" }}
									>
										Your time off allowance
									</h5>
									<div className="card card_item" style={{ height: "155px" }}>
										<div className="card-body">
											<div className="text-centerr">
												<div className="d-flex justify-content-between col-12 mt-2">
													<span style={{ fontSize: "16px", fontWeight: "500" }}>
														Approved
													</span>
													<span>--</span>
												</div>
												<div className="d-flex justify-content-between col-12 mt-3">
													<span style={{ fontSize: "16px", fontWeight: "500" }}>
														Remaining
													</span>
													<span>--</span>
												</div>
												<div className="d-flex justify-content-center col-12 mt-3">
													<button className=" btn-grad1">
														Apply Time Off
													</button>
												</div>
											</div>
										</div>
									</div>
								</section>
							</div>

							{/* <section>
                      <h5 className="dash-title">Upcoming Holiday</h5>
                      <Link to="/app/employee/holidays">
                        <div className="card">
                          <div className="card-body">
                            <div className="time-list align-items-center">
                              <div className="dash-stats-list col-md-4 col-12">
                                <h5 className="holiday-title mb-0">
                                  Fri 20 May 2023 - Ramzan
                                </h5>
                              </div>
                              <div className="dash-stats-list col-md-4 col-12">
                                <h5 className="holiday-title mb-0">
                                  Mon 2nd August 2023 - Eid Al Fitr and Eid Al
                                  Adha
                                </h5>
                              </div>
                              <div className="dash-stats-list col-md-4 col-12">
                                <h5 className="holiday-title mb-0">
                                  Thu 28 October 2023 - Mawlid al-Nabi al-Sharif
                                </h5>
                              </div>
                            </div>
                            
                          </div>
                        </div>
                      </Link>
                    </section> */}
							{/* <section>
                      <h5>Upcoming Holidays</h5>
                      <div className="container lastCard">
                        <div className="row text-center mt-2">
                          <div className="col-md-4 col-12">
                            <p className="holiday-content">Fri 20 May 2023 - Ramzan</p>
                          </div>
                          <div className="col-md-4 col-12 holidayHR">
                            <p className="holiday-content">Fri 20 May 2023 - Ramzan</p>
                          </div>
                          <div className="col-md-4 col-12 holidayHR">
                            <p className="holiday-content">Fri 20 May 2023 - Ramzan</p>
                          </div>
                        </div>
                      </div>
                    </section> */}
						</div>
					</div>

				</div>
			</div>
		</>
	);
};

export default EmpDashboard;
