import React, { useState, useEffect } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import apiList from "../lib/apiList";
import { ThreeDots } from "react-loader-spinner";
import { ToastContainer, toast, Zoom } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import axios from "axios";
import "./Login.css";

const LoginPage = () => {
	const navigate = useNavigate();
	const [showPassword, setShowPassword] = useState(false);
	const [loading, setLoading] = useState(false);
	const [email, setemail] = useState("");
	const [password, setPassword] = useState("");

	const onSubmitBtn = (e) => {
		e.preventDefault();
		loginUser();
	};

	const handleKeyPress = (e) => {
		if (e.key === "Enter") {
			loginUser();
		}
	};

	const loginUser = () => {
		setLoading(true);
		const userData = {
			email: email,
			password: password,
		};

		if (email && password !== "") {
			axios
				.post(apiList.login, userData)
				.then((response) => {
					if (response.status === 200) {
						// Inside the successful response block
						const jwtToken = response.data.token;
						const empType = response.data.empType;
						const employeeId = response.data.payload.employeeId;
						const employeeName = response.data.fullName;

						
					
						Cookies.set("empType", empType);
						Cookies.set("employeeId", employeeId);
						Cookies.set("employeeName", employeeName);
						

						if (empType === "Admin") {
							Cookies.set("adminToken", jwtToken, { expires: 1 }); // Expires in 1 day (24 hours)
							navigate("/admin/dashboard");
						} else {
							Cookies.set("employeeToken", jwtToken, { expires: 1 }); // Expires in 1 day (24 hours)
							navigate("/employee/dashboard");
						}
						
					}
					
				})
				.catch((error) => {
					
					toast.error(error.response.data.message);
					console.error(error.response.data.message);
				})

				.finally(() => {
					setLoading(false);
				});
				
		
		} else {
			
			toast.warning("Please enter required details");
			setLoading(false);
		}
		
	};


	const isTokenValid = () => {
		const adminToken = Cookies.get("adminToken");
		const employeeToken = Cookies.get("employeeToken")

		// Check if the token exists and is not expired
		return adminToken || employeeToken  ? true : false;
	};

	useEffect(() => {
		if (isTokenValid()) {
			const empType = Cookies.get("empType");
			if (empType === "Admin") {
				navigate("/admin/dashboard");
			} if(empType === "Employee"){
					navigate("/employee/dashboard");
			
			}
		}
	}, []);

	const handleTogglePassword = () => {
		setShowPassword((prevShowPassword) => !prevShowPassword);
	};

	return (
		<div>
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
				theme="dark"
			/>
			<div className="container">
				<div className="row login_home">
					<div className="col-md-3"></div>

					<div className="col-md-6">
						<div className="text-center mb-4">
							<img
								src="./images/Eco Quest Technologies (1).png"
								className="img-fluid"
								style={{ width: "250px" }}
								alt="Eco Quest Technologies Logo"
							/>
						</div>
						<div className="col_6">
							{loading ? (
								<div
									style={{
										display: "flex",
										justifyContent: "center",
										alignItems: "center",
										width: "30vw",
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
								<form onSubmit={onSubmitBtn}>
									<h4 className="text-center">Login</h4>
									<p className="text-center">Access to our dashboard</p>
									<label>Email Address</label>
									<input
										type="text"
										placeholder="Enter your email"
										className="form-control"
										onChange={(e) => setemail(e.target.value)}
										value={email}
									/>
									<label>Password</label>
									<div className="password-input">
										<input
											type={showPassword ? "text" : "password"}
											placeholder="Enter your password"
											className="form-control"
											onChange={(e) => setPassword(e.target.value)}
											value={password}
											onKeyPress={handleKeyPress}
										/>
										<span onClick={handleTogglePassword} className="eye-icon">
											{showPassword ? <FiEyeOff /> : <FiEye />}
										</span>
									</div>
									<button type="submit" className="btn  w-100 mt-4">
										Login
									</button>
								</form>)}
						
						</div>
						<div className="col-md-3"></div>
					</div>
					<div className="col-md-3"></div>	
				</div>
			</div>
			
		</div>
	);
};

export default LoginPage;
