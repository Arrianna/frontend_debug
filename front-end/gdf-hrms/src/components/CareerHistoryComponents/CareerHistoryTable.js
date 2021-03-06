import React, { useState, useEffect } from 'react';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import moment from 'moment';
import Axios from 'axios'; 
import Edit from '@material-ui/icons/Edit';
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
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';

const StyledTableCell = withStyles((theme) => ({
  head: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  body: {
    fontSize: 14,
  },
}))(TableCell);

const StyledTableRow = withStyles((theme) => ({
  root: {
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.action.hover,
    },
  },
}))(TableRow);

const useStyles = makeStyles({
  table: {
    minWidth: 700,
  },
});




export default function CareerHistoryTable(props) {
  const classes = useStyles();
  let data = props.data;
  const [newPosition, setNewPosition] = useState();
  const [newDepartment, setNewDepartment] = useState();
  //const [position, setPosition] = useState();
  //const [department, setDepartment] = useState();
  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState();
  const [open, setOpen] = useState(false);
  const [positions, setPositions] = useState();
  const [departments, setDepartments] = useState();
  const[eId, setEId] = useState();
  const [rowId, setRowId] = useState();
  setOpen(false);
  //console.log(data);



  const handleClickOpen = () => {    
    setOpen(true);
  };

  const handleCancel = () => {
    setOpen(false);
  };

  const handlePositionChange = (event) => {
    console.log('handle position changed')
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
    console.log('handle save')
    let careerHistory = {
      eId: parseInt(eId),
      posId: newPosition,
      deptId: newDepartment,
      startDate: startDate,
      endDate: endDate
    }
    if(careerHistory){

      const patchRequest = async() => {
      Axios.post('UpdateInfo/update/employeeCH/' + rowId, careerHistory)
     // .then(response => setEmpData(empData.concat(response.data)))
      .catch(error => console.log(error)) 
    }

    patchRequest();
  }
   // setEmpData([careerHistory, ...empData]);
   
    setOpen(false);    
  };

  useEffect(() => {    
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

    getPosition();
    getDepartment();
  }, []);

  const selectRow = (row)=>{
    console.log("row selected")
    setNewPosition(row.position);
    setNewDepartment(row.department);
    setStartDate(row.startDate);
    setEndDate(row.endDate);
    setEId(row.eId);
    setRowId(row.id);
    setOpen(true);
   
  }

  const showModal = () =>{
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
  
  


  const showResults = () => {
    if(data!= null) {
      if(data.length > 0) {  
        return (
          <TableContainer component={Paper}>
            <Table className={classes.table} aria-label="customized table">
              <TableHead>
                <TableRow>
                  <StyledTableCell align="center">Position</StyledTableCell>
                  <StyledTableCell align="center">Department</StyledTableCell>
                  <StyledTableCell align="center">Start Date</StyledTableCell>
                  <StyledTableCell align="center">End Date</StyledTableCell>
                  <StyledTableCell align="center">Action</StyledTableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {data.map((row) => {            
                  return(
                    <StyledTableRow key={row.id}>
                      <StyledTableCell align="center">{row.position}</StyledTableCell>
                      <StyledTableCell align="center">{row.department}</StyledTableCell>
                      <StyledTableCell align="center">{moment(row.startDate).format('DD-MM-YYYY')}</StyledTableCell>
                      <StyledTableCell align="center">{moment(row.endDate).format('DD-MM-YYYY')}</StyledTableCell>
                      <StyledTableCell align="center">
                          {/* <Edit className={classes.icon} onClick={() => selectRow(row)}/>*/}
                          </StyledTableCell>   
                    </StyledTableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        );
      }
    }
  }
  return (
    <div>
      {showResults()}
      {showModal()}
    </div>
  );
}
