import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import { useParams } from 'react-router-dom';
import CareerHistoryTable from './CareerHistoryTable';
import Axios from 'axios'; 
import DialogTitle from '@material-ui/core/DialogTitle';
import MenuItem from '@material-ui/core/MenuItem';
import InputLabel from '@material-ui/core/InputLabel';
import Input from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import Button from '@material-ui/core/Button';
import SaveIcon from '@material-ui/icons/Save';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';

const useStyles = makeStyles((theme) => ({
  root: {
    '& .MuiTextField-root': {
        margin: theme.spacing(1),
        width: '25ch',
        flexGrow: 1,
    }, 
  },

  formControl: {
    margin: theme.spacing(1),
    minWidth: 200,
  },

  paper: {
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  },
}));

export default function ViewCareerHistory(props) {
  const classes = useStyles();
  const params = useParams();  
  const [empData, setEmpData] = useState();
  const [employeeInfo, setEmployeeInfo] = useState();
  const [newPosition, setNewPosition] = useState();
  const [newDepartment, setNewDepartment] = useState();
  //const [position, setPosition] = useState();
  //const [department, setDepartment] = useState();
  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState();
  const [open, setOpen] = useState(false);
  const [positions, setPositions] = useState();
  const [departments, setDepartments] = useState();

  let eId = params.empId;
  console.log(eId);

  const handleClickOpen = () => {    
    setOpen(true);
  };

  const handleCancel = () => {
    setOpen(false);
  };

  const handlePositionChange = (event) => {
    setNewPosition(event.target.value);
  }
 
  const handleDepartmentChange = (event) => {
    setNewDepartment(event.target.value);
  }

  const handleStartDateChange = (event) => {
    setStartDate(event.target.value);
  }

  const handleEndDateChange = (event) => {
    setEndDate(event.target.value);
  }

  const handleSave = () => {
    let careerHistory = {
      eId: parseInt(eId),
      posId: newPosition,
      deptId: newDepartment,
      startDate: startDate,
      endDate: endDate
    }
    if(careerHistory){

      const postRequest = async() => {
      Axios.post('PostInfo/AddAnEmployeeCareerHistory', careerHistory)
      .then(response => setEmpData(empData.concat(response.data)))
      .catch(error => console.log(error)) 
    }

    postRequest();
  }
   // setEmpData([careerHistory, ...empData]);
   
    setOpen(false);    
  };

  useEffect(() => {    
    const getEmpCH = async () => {
      if(eId){
        const info = await Axios.get("EmployeeInfo/GetEmployeeCareerHistoryByTheirId?employeeId=" + eId);
        setEmpData(info.data);
      }
    };
    const getEmpInfo = async () => {
      if(eId){
        const info = await Axios.get("EmployeeInfo/Id/" + eId);
        setEmployeeInfo(info.data);
      }
    };  

    const getPosition = async () => {
      const info = await Axios.get("GetInfo/GetAllPositions");
      if(info.data != null){
        if(info.data.length > 0){
          setPositions(info.data);
        }
      }
    };
   
    const getDepartment = async () => {
      const info = await Axios.get("GetInfo/GetAllDepartments");
      if(info.data != null){
        if(info.data.length > 0){
          setDepartments(info.data);
        }
      }
    };

    getEmpCH();
    getEmpInfo();
    getPosition();
    getDepartment();
    console.log('view career history')
  }, [eId]);
  console.log(positions);
  console.log(departments);

  const showInfo = () => {
    if(employeeInfo != null) {
      return(
        <div>
         <h2>Career History for {employeeInfo.firstName} {employeeInfo.lastName} ({employeeInfo.regimentNumber})</h2>  
        </div>
      );
    }
  } 

  const showDialog = () => {
    if(positions != null && departments != null) {
      if(positions.length > 0 && departments.length > 0){
         return(
          <div className={classes.root}>
          <Grid container spacing={3}>
            <Grid container item xs={12} spacing={3}>
              <React.Fragment>
                 <Dialog open={open} onClose={handleCancel} aria-labelledby="form-dialog-title">

                    <DialogTitle id="form-dialog-title">Add Career History Record</DialogTitle>

                    <DialogContent>
                      <FormControl className={classes.formControl}>
                        <InputLabel shrink="true" id="position-label">Position</InputLabel>
                        <Select
                          labelId="position-label"
                          id="position"
                          value={newPosition}
                          onChange={handlePositionChange}
                          label="Position"
                          fullwidth
                          variant="outlined"
                          margin="normal"
                        >
                          <MenuItem  value=""><em>Select</em></MenuItem>
                          {positions.map((position) =>
                            <MenuItem key={position.id} value={position.id}>{position.name}</MenuItem>)}  
                        </Select>
                      </FormControl>
                     <br/>
                      {/* <TextField margin="dense" id="country" label="Country" type="text" fullWidth/> */}
                      <FormControl className={classes.formControl}>
                        <InputLabel shrink="true" id="department-label">Department</InputLabel>
                        <Select
                          labelId="department-label"
                          id="department"
                          value={newDepartment}
                          onChange={handleDepartmentChange}
                          label="Department"
                          fullwidth
                          variant="outlined"
                          margin="normal"
                        >
                         <MenuItem value=""><em>Select</em></MenuItem>
                            {departments.map((department) =>
                            <MenuItem key={department.id} value={department.id}>{department.name}</MenuItem>  
                          )}                         
                        </Select>
                      </FormControl>
                      <br/>
                      <FormControl className={classes.formControl}>
                        <InputLabel shrink="true" htmlFor="component-simple">Start Date</InputLabel>
                        <TextField margin="normal" id="startDate"  type="date" fullWidth variant="outlined" value={startDate} onChange={handleStartDateChange}/>
                      </FormControl>
                     <br/>
                      <FormControl className={classes.formControl}>
                        <InputLabel shrink="true" htmlFor="component-simple">End Date</InputLabel>
                        <TextField margin="normal" id="EndDate"  type="date" fullWidth variant="outlined" value={endDate} onChange={handleEndDateChange}/>
                      </FormControl>
                    
                    </DialogContent>

                    <DialogActions>
                    <div>
                      <Button onClick={handleCancel} variant="contained" color="primary">Cancel</Button>
                    </div>
                    <div>
                      <Button onClick={handleSave} variant="contained" color="primary" startIcon={<SaveIcon />}>Save Address</Button>
                    </div>
                    </DialogActions>
                  </Dialog>
                </React.Fragment>
               </Grid>
              </Grid>
             </div>  
        )}  
    }
  }

  

  return (
    <div className={classes.root}>
      <Grid container spacing={1}>
        <Grid item xs={6}>  
          {showInfo()}
        </Grid>
        <Grid container item xs={12} spacing={3}>
          <React.Fragment>
            <div>
              <Grid container spacing={3}>    
                <Grid item xs={12}>

                <Button variant="outlined" color="primary" onClick={handleClickOpen}>
                    Add Career History Record
                    {/* <Link to={'/add-address/' + empId}>Add Employee Address</Link> */}
                  </Button>
                </Grid>

              <Grid item xs={12}>
                <div>
                {showDialog()}
                </div>
              </Grid>

                </Grid>            
                <Grid item xs={12}>
                  <CareerHistoryTable data={empData}></CareerHistoryTable> 
                </Grid>
           
            </div>
          </React.Fragment>
        </Grid>
      </Grid>
    </div>
  );
}