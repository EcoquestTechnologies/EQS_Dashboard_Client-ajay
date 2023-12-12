import React, { useEffect, useState } from "react";
import axios from "axios";
import { Timeline } from "antd";
import { ToastContainer, toast } from "react-toastify";
import Cookies from "js-cookie";
import { ThreeDots } from "react-loader-spinner";
import apiList from "../lib/apiList";
import { Link, useNavigate, useParams } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import "react-vertical-timeline-component/style.min.css";

import AdminSidebar from "./AdminSidebar";

const EmpDayWiseActivity = () => {
  let navigate = useNavigate();
  let params = useParams();
  const { date, employeeId } = params;
  const [todayPunches, setTodayPunches] = useState([]);
  const [loader, setLoader] = useState(true);

  const token = Cookies.get("adminToken");

  const isTokenValid = () => {
    const jwtToken = Cookies.get("adminToken");

    // Check if the token exists and is not expired
    return jwtToken ? true : false;
  };

  useEffect(() => {
    if (!isTokenValid()) {
      navigate("/");
    }

    fetchData();
  }, [employeeId]);

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours.toString().padStart(2, "0")}:${minutes
        .toString()
        .padStart(2, "0")}`;
};

const totalWorkingTime = todayPunches.reduce(
    (acc, punch) => acc + (punch.totalWorkingTime || 0),
    0
);

const totalBreakTime = todayPunches.reduce(
    (acc, punch) => acc + (punch.breakTime || 0),
    0
);

  const fetchData = async () => {
    try {
      const response = await axios.get(
        `${apiList.datePunchesInAdmin}/${employeeId}/${date}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const punches = response.data.punches;

      setTodayPunches(punches);
      setLoader(false);
    } catch (error) {
      console.error("Error fetching punches:", error);
    }
  };

  const employeeName = todayPunches.length > 0 ? todayPunches[0].employeeName : '';
 

  return (
    <>
      <AdminSidebar />

      <div className="p-5 d-flex flex-column" style={{marginTop:"80px"}}>
        <div className="d-flex justify-content-center mb-4 pt-5">
          
          <div
            className="card card_item d-flex flex-column justify-content-between text-center p-3 mt-4"
            style={{ borderRadius: "10px" }}
          >
           
            <h4 className="mb-3 employee_timeset ">
              Timesheet <span style={{ color: "grey" }}>{date}</span>
            </h4>

            <div
              style={{
                backgroundColor: "#ddd",
                width: "300px",
                borderRadius: "10px",
                margin: "10px 10px",
                color: "black",
                paddingTop: "15px",
                fontSize: "18px",
                fontWeight: "500",
              }}
            >
              <p>
                {todayPunches[0]?.punchIn &&
                  `First Punch In at ${new Date(
                    todayPunches[0].punchIn
                  ).toLocaleTimeString()}`}
              </p>
            </div>

            <div className="d-flex justify-content-between ">
              <p
                className="border employee_working p-2 m-2 "
                style={{ borderRadius: "10px" }}
              >
                Working Time
                <br /> <span style={{color:"#ff8135"}}>{formatTime(totalWorkingTime)} HRS</span>
              </p>
              <p
                className="border employee_working p-2 m-2 "
                style={{ borderRadius: "10px" }}
              >
                Break Time
                <br /> <span style={{color:"#ff8135"}}>{formatTime(totalBreakTime)} HRS</span>
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
                height={50}
                width={50}
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
                height: "290px",
                overflowY: "scroll",
                borderRadius: "10px",
                marginLeft: "20px",
              }}
            >
              <h4
                className="text-center sticky-top Employee_activity mb-4"
                style={{ backgroundColor: "#fff", padding: "7px", fontSize:18 }}
              >
                Day Activity / Emp Id : {employeeId && employeeId }
              </h4>
              <Timeline mode="left " className="ml-3 " style={{ paddingLeft: "10px" }}>
                {todayPunches?.length > 0 ? (todayPunches?.map((punch, index) => (
                  <React.Fragment key={index}>
                    {punch.punchIn && (
                      <Timeline.Item >
                        {`Punch In at ${new Date(
                          punch.punchIn 
                        ).toLocaleTimeString()}`}
                      </Timeline.Item>
                    )}
                    {punch.punchOut && (
                      <Timeline.Item>
                        {`Punch Out at ${new Date(
                          punch.punchOut
                        ).toLocaleTimeString()}`}
                      </Timeline.Item>
                    )}
                  </React.Fragment>
                ))):(<div
                   
                  >
                    <h5>No Records Found for {date}</h5>
                  </div>)}
              </Timeline>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default EmpDayWiseActivity;
