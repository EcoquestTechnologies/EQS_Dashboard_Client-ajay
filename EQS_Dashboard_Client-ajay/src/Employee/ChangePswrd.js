import React, { useState } from "react";
import { Form, Input, Button, message } from "antd";
import EmployeeSidebar from "./EmployeeSidebar";
import EmployeeNavbar from "./EmployeeNavbar";
import axios from "axios";
import Cookies from "js-cookie";
import apiList from "../lib/apiList";

const ChangePassword = () => {
	const [form] = Form.useForm();
	const employeeId = Cookies.get('employeeId'); // Assuming you have stored employeeId in cookies
	const token = Cookies.get('employeeToken');

	const handleSubmit = async (values) => {
		try {
			const response = await axios.put(`${apiList.changepassword}/${employeeId}`, values, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});
			message.success(response.data);
		} catch (error) {
			console.error("Error updating password:", error);
			message.error("Failed to update password. Please try again.");
		}
	};
	

	return (
		<>
			
			<EmployeeSidebar />
			<div className="" style={{marginLeft:"200px", marginTop:"80px",height:"90vh",overflowY:"scroll",display:"flex"}}>
				{/* <div className="text-center" style={{ paddingTop: "130px" }}>
					<img
						src="https://res.cloudinary.com/dhpkv1tec/image/upload/v1700651070/natural%20places/Eco_Quest_Technologies_Icon_nsbxr4.png"
						className="img-fluid nav_logo1"
						alt="img"
					/>
				</div> */}

			
			<div style={{ width: 600, margin: "auto" }}>

				<h2 className="attendance py-3 text-center" style={{ color: "#000" }}>
					CHANGE PASSWORD
				</h2>
				<Form
					form={form}
					onFinish={handleSubmit}
					style={{ width: 700, margin: "auto" }}
					className="card card_item1 employee_password pt-4 px-5"
				>
					{/* <label>Old Password <sup>*</sup></label>
				<Form.Item
					name="oldPassword"
					// label="Old password"
					rules={[
						{ required: true, message: "Please input your old password!" },
					]}
				>
					<Input.Password />
				</Form.Item> */}
					<label style={{fontSize:"17px", fontWeight:"500"}}>
						New Password <sup>*</sup>
					</label>
					<Form.Item
						name="newPassword"
						// label="New password"
						rules={[
							{ required: true, message: "Please input your new password!" },
						]}
					>
						<Input.Password className="p-2" />
					</Form.Item>
					<label style={{fontSize:"17px", fontWeight:"500"}}>
						Confirm Password <sup>*</sup>
					</label>
					<Form.Item
						name="confirmPassword"
						// label="Confirm password"
						dependencies={["newPassword"]}
						rules={[
							{ required: true, message: "Please confirm your new password!" },
						
						]}
					>
						<Input.Password className="p-2" />
					</Form.Item>


				
					

					

				
					

					<Form.Item>
						<div className="text-center">
							<Button
								type="primary"
								htmlType="submit"
								style={{
									backgroundColor: "#ff8135",
									height: "40px",
									fontSize: "17px",
								}}
								
							>
								Update Password
							</Button>
						</div>
					</Form.Item>
				</Form>
			</div>
			</div>
		</>

	);
};

export default ChangePassword;
