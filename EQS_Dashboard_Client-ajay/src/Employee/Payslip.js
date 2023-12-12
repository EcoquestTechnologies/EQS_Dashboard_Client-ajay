import React, { useState, useEffect } from "react";
import { Form, Select, Button, Card, Pagination } from "antd";
import { VerticalAlignBottomOutlined } from "@ant-design/icons";
import { saveAs } from "file-saver";
import { jsPDF } from "jspdf";
import EmployeeNavbar from "./EmployeeNavbar";
import EmployeeSidebar from "./EmployeeSidebar";
import { FormControl, MenuItem, InputLabel } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { ThreeDots } from "react-loader-spinner";
import Cookies from "js-cookie";
import axios from "axios";
import apiList from "../lib/apiList";

const useStyles = makeStyles({
  filter: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    margin: 16,
  },
});



const handleSubmit = (values) => {
  console.log("Searching for payslips with values:", values);
};



const Payslip = () => {
  const classes = useStyles();
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];


  //   console.log(employee);
  const [form] = Form.useForm();

  const getMonthNumber = (monthName) => {
    const monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    return monthNames.indexOf(monthName) + 1;
  };

  const getMonthText = (monthNumber) => {
    const monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    return monthNames[monthNumber - 1];
  };


  const currentDate = new Date();
  const defaultMonthName = currentDate.toLocaleString("default", {
    month: "long",
  });
  const defaultMonth = getMonthNumber(defaultMonthName);
  const [month, setMonth] = useState(defaultMonth);
  const [year, setYear] = useState(new Date().getFullYear());
  const [loader, setLoader] = useState(true);

  console.log("month anme", monthNames[month - 1]);
  console.log("month number", month);
  console.log("year", year);


  const generateYearOptions = (numYears) => {
    const currentYear = new Date().getFullYear();
    const years = Array.from(
      { length: numYears + 1 },
      (_, i) => currentYear - i
    );
    return years;
  };

  // Function to handle the change of month filter
  const handleMonthChange = (selectedMonth) => {
    setMonth(getMonthNumber(selectedMonth));
    console.log(getMonthNumber(selectedMonth));
  };

  const handleYearChange = (selectedYear) => {
    setYear(selectedYear);
  };

  const handleDownload = async (record, index) => {
    console.log(index);
    // console.log("Downloading payslip with record:", record);
    // const doc = new jsPDF();
    // doc.text(`Payslip for ${record.month} ${record.year}`, 10, 10);
    // doc.text(`Name: John Doe`, 10, 20);
    // doc.text(`Salary: $5000`, 10, 30);
    // doc.text(`Tax: $500`, 10, 40);
    // doc.text(`Net: $4500`, 10, 50);
    // saveAs(doc.output("blob"), record.payslip);
    const payslipToDownload = payslipsArray[index];
    console.log("Downloading payslip:", payslipToDownload);

    // Fetch the payslip URL and trigger download
    if (payslipToDownload.url) {
      const response = await fetch(payslipToDownload.url);
      const blob = await response.blob();
      saveAs(blob, `${getMonthText(payslipToDownload.month)}-${payslipToDownload.year}.pdf`);
    }
  };

  // Effect hook to filter the data on initial render
  useEffect(() => {
    const currentDate = new Date();
    setMonth(currentDate.getMonth() + 1);
    setYear(currentDate.getFullYear());
  }, []);

  const employeeId = Cookies.get('employeeId');
  const employeeName = Cookies.get('employeeName');
  const [payslipsArray, setPaysslipsarray] = useState("")
  const token = Cookies.get('employeeToken')

  const handlePayslips = async () => {
    setLoader(true);
    try {

        const response = await axios.get(`${apiList.employeePayslip}/${employeeId}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        setPaysslipsarray(response.data)
        setLoader(false);
        console.log(response.data);
    } catch (error) {
            console.error("Error searching for data:", error);

    }
  };


  const handleSearch = async () => {
    setLoader(true)
    try {
      const filteredPayslips = payslipsArray.filter(payslip => {
        // Convert payslip year and month to numbers for comparison
        const payslipYear = parseInt(payslip.year);
        const payslipMonth = parseInt(payslip.month);

        return payslipYear === year && payslipMonth === month;
      });

      if (filteredPayslips.length > 0) {
        const payslipToDownload = filteredPayslips[0];
        console.log("Downloading payslip:", payslipToDownload);

        // Fetch the payslip URL and trigger download
        if (payslipToDownload.url) {
          const response = await fetch(payslipToDownload.url);
          const blob = await response.blob();
          saveAs(blob, `${payslipToDownload.month}-${payslipToDownload.year}.pdf`);
        }
        setLoader(false);

      }
    } catch (error) {
      // Handle errors if necessary
      console.log(error);
    }
  };




  useEffect(() => {
    handlePayslips();
  }, [])


const pageSize = 4; // Number of cards per page
const [currentPage, setCurrentPage] = useState(1);

const handlePageChange = (page) => {
  setCurrentPage(page);
};

const startIndex = (currentPage - 1) * pageSize;
const endIndex = startIndex + pageSize;

  return (
    <>

      <EmployeeSidebar />




      <div
        style={{
          backgroundColor: "#fff",
          marginLeft: "210px", marginTop: "80px", height: '90vh', overflowY: "scroll"
        }}
      >
        <div className="container"> <h2 className="attendence  mt-5" style={{ marginLeft: "100px"}}>PAYSLIPS</h2></div>
        <Form
          form={form}
          onFinish={handleSubmit}
          className=""
          style={{
            width: 690,
            margin: "auto",
            // backgroundColor: "#ffffff",
            padding: 10,
            // boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          }}
        >
          <div className="row" style={{boxShadow: "0 2px 8px rgba(0,0,0,0.1)",borderRadius:"10px", paddingTop:"20px"}}>
            <div className="col-md-6 ">

              <FormControl>
                {/* <InputLabel>Select Month</InputLabel> */}
                <label>Select Month</label>
                <Select
                  style={{
                    width: "300px",

                  }}
                  value={monthNames[month - 1]}
                  onChange={(e) => handleMonthChange(e)}
                  className={classes.select}
                  InputProps={{
                    disableUnderline: true, // Remove the underline
                  }}
                >
                  <MenuItem value="January">January</MenuItem>
                  <MenuItem value="February">February</MenuItem>
                  <MenuItem value="March">March</MenuItem>
                  <MenuItem value="April">April</MenuItem>
                  <MenuItem value="May">May</MenuItem>
                  <MenuItem value="June">June</MenuItem>
                  <MenuItem value="July">July</MenuItem>
                  <MenuItem value="August">August</MenuItem>
                  <MenuItem value="September">September</MenuItem>
                  <MenuItem value="October">October</MenuItem>
                  <MenuItem value="November">November</MenuItem>
                  <MenuItem value="December">December</MenuItem>
                </Select>
              </FormControl>
            </div>
            <div className="col-md-6">
            
              <FormControl>
                <label>Select Year</label>
                <Select
                  style={{
                    width: "300px"
                  }}
                  value={year}
                  onChange={handleYearChange}
                  className={classes.select}
                  InputProps={{
                    disableUnderline: true, // Remove the underline
                  }}
                >
                  {generateYearOptions(3).map((option) => (
                    <MenuItem key={option} value={option}>
                      {option}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </div>

            <Form.Item className="col-md-2" style={{
              margin: "auto", marginTop: "30px",
              marginBottom:"30px"
            }}>
              <div className="text-center" onClick={handleSearch}>
                <Button
                  type="primary"
                  htmlType="submit"
                  style={{
                    backgroundColor: "#ff8135",
                    height: "40px",
                    fontSize: "17px"
                  }}
                >
                  Search
                </Button>
              </div>

            </Form.Item>
          </div>

        </Form>
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
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              flexWrap: "wrap",
            }}
          >
            {payslipsArray && payslipsArray.slice(startIndex, endIndex).map((record, index) => (
              <Card
                key={record.payslip}
                title={`${getMonthText(record.month)} ${record.year}`}
                style={{ width: 200, margin: 20, textAlign: "center" }}
                className="card_item employee_month_card "
              >
                <Button
                  onClick={() => handleDownload(record, index)}
                  style={{
                    backgroundColor: "#ff8135",
                    color: "#fff",
                    textAlign: "center",
                    height: "40px",
                    fontSize: "17px",
                  }}
                  className="button"
                >
                  <VerticalAlignBottomOutlined />
                  Download
                </Button>
              </Card>
            ))}



          </div>
        )}
       <Pagination
            current={currentPage}
            onChange={handlePageChange}
            defaultPageSize={pageSize}
            total={payslipsArray ? payslipsArray.length-1 : 0}
            style={{ width: 800, margin: "auto", textAlign: "center" }}
          />
      </div>



    </>
  );


};

export default Payslip;
