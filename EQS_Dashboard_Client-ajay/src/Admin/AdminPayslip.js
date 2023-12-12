import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography, Button, IconButton, TablePagination } from "@material-ui/core";
import { orange  } from "@material-ui/core/colors";
import CloudUploadIcon from "@material-ui/icons/CloudUpload";
import AdminSidebar from "./AdminSidebar";
import axios from "axios";
import apiList from "../lib/apiList";
import { ThreeDots } from "react-loader-spinner";
import { format } from "date-fns";
import { Menu, MenuItem } from "@material-ui/core";
import { ToastContainer, toast, Zoom } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';


import Cookies from 'js-cookie';
// import { s3 } from "../Utils/aws";
import AWS from "aws-sdk";

import {
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
	Select,
	InputLabel,
  FormControl,
	TextareaAutosize,
} from "@material-ui/core";
import { useForm, Controller } from "react-hook-form";

import {

	Drawer,
	List,
	ListItem,
	ListItemText,

} from "@material-ui/core";



// Custom styles for the components
const useStyles = makeStyles({
  header: {
    // backgroundColor: orange[500],
    color: "#000",
    padding: 16,
  },
  filter: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    margin: 16,
  },
  table: {
    minWidth: 650,
    border: '1px solid #ddd',
  },
  cell: {
    border: '1px solid #ddd', // Add border to each cell
  },
  upload: {
    color: orange[500],
  },
});





const AdminPayslip = () => {
  const classes = useStyles();

  // State variables for the filters
  const [employee, setEmployee] = useState("");
  // const [month, setMonth] = useState(new Date().getMonth() + 1);
  // const [year, setYear] = useState(new Date().getFullYear());
  const [allEmployees, setAllEmpEmployees] = useState([]);
  const [loader, setLoader] = useState(true);

  const [open, setOpen] = useState(false)
  const [isEdit, setIsEdit] = useState(false);
  const { control, handleSubmit, reset, formState } = useForm();



  const handleClose = () => {
		setOpen(false);
	};
  // State variable for the filtered data
  const [data, setData] = useState([]);

  // State variables for the pagination
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);


  const [indexValue, setIndexValue] = useState("")


  const handleEmployeeChange = (e) => {
    setEmployee(e.target.value);
  };

 

  // Function to handle the click of search button
  const handleSearch = () => {
    // filterData();
  };

  // Function to handle the change of page
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  // Function to handle the change of rows per page
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Function to handle the click of upload button
  const handleUpload = (e) => {
 
   let index = indexValue;
    // Get the file input element by its id
    let fileInput = document.getElementById(`file-input-${index}`);
    // Trigger the click event on the file input element
    fileInput.click();
  };

  // Function to handle the change of file input
  // const handleFileChange = (index, e) => {
  //   // Get the selected file from the event
  //   let file = e.target.files[0];
  //   // Check if the file is a PDF
  //   if (file && file.type === "application/pdf") {
  //     // Create a URL for the file
  //     let url = URL.createObjectURL(file);
  //     // Update the payslip property of the employee object in the data array
  //     setData((prevData) => {
  //       let newData = [...prevData];
  //       newData[index].payslip = url;
  //       return newData;
  //     });
  //   } else {
  //     // Alert the user that the file is not a PDF
  //     alert("Please select a PDF file");
  //   }
  // };


  

const token = Cookies.get('adminToken');


const fetchEmployees = async () => {
  setLoader(true);
    try {
        const response = await axios.get(apiList.allEmployees,{
          headers: {
              Authorization: `Bearer ${token}`,
          },
      });
        setLoader(false);
        setAllEmpEmployees(response.data);
        let filteredData = [];
    for (let emp of response.data) {
      // Check if the employee name matches the filter or the filter is empty
      // if (emp.name.toLowerCase().includes(employee.toLowerCase()) || employee === "") {
        // Push the employee object to the filtered data
        filteredData.push(emp);
      // }
    }
    // Set the data state variable to the filtered data
    setData(filteredData);
        
    } catch (error) {
        console.error("Error fetching employees:", error);
    }
};


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

const currentDate = new Date();
const defaultMonthName = currentDate.toLocaleString("default", {
  month: "long",
});

const defaultMonth = getMonthNumber(defaultMonthName);
  const [month, setMonth] = useState(defaultMonth);
  const [year, setYear] = useState(new Date().getFullYear());

  const generateYearOptions = (numYears) => {
    const currentYear = new Date().getFullYear();
    const years = Array.from(
      { length: numYears + 1 },
      (_, i) => currentYear - i
    );
    return years;
  };


  // Function to handle the change of month filter
  const handleMonthChange = (e) => {
    setMonth(getMonthNumber(e.target.value));
  };
  console.log(month);
  const handleYearChange = (e) => {
    setYear(e.target.value);
  };


  // Effect hook to filter the data on initial render
  useEffect(() => {
    const currentDate = new Date();
    setMonth(currentDate.getMonth() + 1);
    setYear(currentDate.getFullYear());

    fetchEmployees();

  }, []);

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


  // Function to render the table header
  const renderTableHeader = () => {
    // Return the table header with the employee details and payslip columns
    return (
      <TableHead  style={{ backgroundColor: "#000" }}>
        <TableRow >
          <TableCell  style={{color:"#fff"}} className={classes.cell}>Name</TableCell>
          <TableCell  style={{color:"#fff"}} className={classes.cell}>Employee ID</TableCell>
          <TableCell  style={{color:"#fff"}} className={classes.cell}>Email</TableCell>
          <TableCell  style={{color:"#fff"}} className={classes.cell}>Join Date</TableCell>
          <TableCell  style={{color:"#fff"}} className={classes.cell}>Department</TableCell>
          <TableCell  style={{color:"#fff"}} className={classes.cell}>Payslip</TableCell>
        </TableRow>
      </TableHead>
    );
  };

  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadedFileName, setUploadedFileName] = useState('');
  const handleBox = (index)=>{
    setOpen(true);
    setIndexValue(index);
    setUploadingUser(allEmployees[index])
  }

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
};
AWS.config.update({
  accessKeyId: 'AKIA2JIXP62KJPQ5HVYK',
  secretAccessKey: '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',
  region: 'ap-south-1',
  // Bucket: 'sunil-resume-upload',
  // dirName: 'resumeupload',
});

const s3 = new AWS.S3({
  params:{
    Bucket: 'sunil-resume-upload',
    dirName: 'resumeupload'
  }
});
const handleFileUpload = async (e) => {
  // Configure AWS SDK with your credentials and region here
  
  e.preventDefault();
  console.log(selectedFile);
  if (selectedFile) {
    console.log(selectedFile);
      const params = {
          Key: selectedFile.name,
          Body: selectedFile,
      };
      try {
        console.log(params);

          const data = await s3.upload(params).promise();
          console.log(params, data);

          console.log('File uploaded successfully: ', data.Location);
          
          // Store the URL (data.Location) in your database here.
          // Make an API request to your backend to save the URL.
         

          // Assuming you have an API endpoint to store the URL
          const response = await axios.post(apiList.uploadPayslip, {
            employeeId : uploadingUser.employeeId,
            year : year,

            month : month,

            url: data.Location
          });

          console.log('File uploaded', response.data);
          toast.success("file uploaded successfully")
          window.location.reload();
      } catch (error) {
        if (error.response && error.response.status === 400) {
          // Assuming that the server responds with a 400 status code for validation errors
          toast.error("pay slip for the month already exists");
          window.location.reload();
      } else {
          console.error("Error Uploading payslip:", error);
      }
      }
  }
}

  const renderLeaveForm = () => (
		<Dialog open={open} onClose={handleClose}>
			<form>
				<DialogTitle>{"Select month and year"}</DialogTitle>
				<DialogContent>


        <FormControl className={classes.filter}>
              <InputLabel>Select Month</InputLabel>
              <Select
              style={{width:"300px"}}
                value={monthNames[month - 1]}
                onChange={handleMonthChange}
                className={classes.select}
                
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

            <FormControl className={classes.filter}>
              <InputLabel>Select Year</InputLabel>
              <Select
                 style={{width:"300px"}}
                value={year}
                onChange={handleYearChange}
                className={classes.select}
               
              >
                {generateYearOptions(3).map((option) => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>


            
              {/* <IconButton className={classes.upload} onClick={() => handleUpload(index)}> */}


              <div style={{textAlign:'end'}}>

              <IconButton className={classes.upload} onClick={handleUpload} >
              <input
                type="file"
                id={`file-input-${indexValue}`}
                style={{ display: "none" }}
                // onChange={(e) => handleFileChange(indexValue, e)}
                onChange={handleFileChange}
              />
               <CloudUploadIcon />
              </IconButton> <button onClick={handleFileUpload} className="btn" style={{backgroundColor:"orange", color:'#fff'}}>Submit</button>
              </div>

            
            

					
				

					
				
				</DialogContent>
				<DialogActions>
					{/* <Button
						type="submit"
						style={{ backgroundColor: "#ff8135", color: "#fff" }}
						disabled={!formState.isValid || formState.isSubmitting}
					>
						{isEdit ? "Update" : "Submit"}
					</Button> */}
				</DialogActions>
			</form>
		</Dialog>
	);

  // Function to render the table body based on the filtered data and pagination
  const renderTableBody = () => {
    // Return the table body with the employee details and upload button for each row
    return (
      <TableBody>
        {data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, index) => (
          <TableRow key={index}>
            <TableCell component="th" scope="row" >
            <span style={{ fontWeight: "500" }}>{`${row.firstName} ${row.lastName}`}</span>
            </TableCell>
            <TableCell className={classes.cell}>{row.employeeId}</TableCell>
            <TableCell className={classes.cell}>{row.email}</TableCell>
            <TableCell className={classes.cell}>  {format(new Date(row.joiningDate), "dd-MM-yyyy")}
</TableCell>
            <TableCell className={classes.cell}>{row.department}</TableCell>
            <TableCell>
              {/* <IconButton className={classes.upload} onClick={() => handleUpload(index)}> */}
              <IconButton className={classes.upload} onClick={()=>handleBox(index)} >

                <CloudUploadIcon />
              </IconButton>
              {open && renderLeaveForm()}

              {/* <input
                type="file"
                id={`file-input-${index}`}
                style={{ display: "none" }}
                onChange={(e) => handleFileChange(index, e)}
              /> */}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    );
  };


  const [uploadingUser , setUploadingUser] = useState("");

  

  console.log(allEmployees[indexValue]);
  // function uploadDocumentToS3(e) {
  //   e?.preventDefault();
  //   const params = {
  //     Bucket: "kali-veeresh",
  //     Key: `payslips/${uploadingUser?.employeeId}-${
  //       +monthSelect + 1
  //     }-${yearSelect}.pdf`,
  //     Body: selectFile,
  //   };
  //   s3.upload(params, async (err, data) => {
  //     if (err) {
  //       console.error("S3 upload error:", err);
  //     } else {
  //       console.log("S3 upload success:", data.Location);
  //       await fetchService({
  //         url: URLS.UPLOAD_PAYSLIP,
  //         data: {
  //           payslip_path: `payslips/${uploadingUser?.employee_id}-${
  //             +monthSelect + 1
  //           }-${yearSelect}.pdf`,
  //           month: +monthSelect + 1,
  //           year: yearSelect,
  //           employee_id: uploadingUser?.employee_id,
  //         },
  //         method: "post",
  //       })
  //         .then(() => {
  //           getPayRollsAdmin(searchInput, monthSelect, yearSelect);
  //           closeUpload();
  //         })
  //         .catch((err) => {
  //           console.log(err, " error");
  //         })
  //         .finally(() => {
  //           setTimeout(() => {
  //             Loader.hideLoader();
  //           }, 500);
  //         });
  //     }
  //   });
  // }


  // Return the JSX for the page
  return (
    <>
    <AdminSidebar/>
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
    <div  className="p-5 " style={{marginTop:"80px",marginLeft:"210px",height:'85vh',overflowY:'scroll'}}>
      <>
        <h1 className="container attendence">
          Employee Payslips

        </h1>

      

<div className="container mb-5">
  <div className="row">
    <div className="col-md-3">
    <TextField label="Employee Name" value={employee} onChange={handleEmployeeChange} style={{width:'100%'}}/>
    </div>
    <div className="col-md-3">
    <TextField label="Month" type="number" value={month} onChange={handleMonthChange} style={{width:'100%'}}/>
    </div>
    <div className="col-md-3">
    <TextField label="Year" type="number" value={year} onChange={handleYearChange} style={{width:'100%'}}/>
    </div>
    <div className="col-md-3 m-auto">
    <Button variant="contained" color="primary" onClick={handleSearch} style={{backgroundColor:"#ff8135",width:"100%",height:'45px',marginTop:'17px'}}>
            Search
          </Button>
    </div>
  </div>
</div>

       {loader ?(<div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              width: "75vw",
            }}
          >
            <ThreeDots
              height={60}
              width={60}
              radius={10}
              color="#ff8135"
              ariaLabel="loading"
            />
</div>):(
         <TableContainer className="container admin_paysliptable">
         <Table className={classes.table}>
           {renderTableHeader()}
           {renderTableBody()}
         </Table>
       </TableContainer>
       )}

        <TablePagination
          component="div"
          count={data.length}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </>
    </div>
    </>
  );
};

export default AdminPayslip;
