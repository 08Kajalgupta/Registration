import React,{useState,useEffect} from "react"
import MaterialTable from "material-table"
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close';
import Slide from '@material-ui/core/Slide';
import Grid from "@material-ui/core/Grid"
import TextField from "@material-ui/core/TextField"
import IconButton from '@material-ui/core/IconButton';
import Avatar from '@material-ui/core/Avatar'
import swal from "sweetalert"
import {isBlank} from "./Checks"
import swalhtml from "@sweetalert/with-react"
import renderHTML from "react-render-html"
import {ServerURL,postData,postDataAndImage,getData} from "./FetchNodeServices"
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import LibraryAddSharpIcon from '@material-ui/icons/LibraryAddSharp';
import RefreshIcon from '@material-ui/icons/Refresh';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';

const useStyles = makeStyles((theme) => ({
  appBar: {
    position: 'relative',
  },
  title: {
    marginLeft: theme.spacing(2),
    flex: 1,
  },
  root: {
      height:'auto',
      width:'auto',
      display:'flex',
      justifyContent:'center',
      alignItems:'center'
    
           
  },

  subdiv:{
      padding:30,
      width:800,
      marginTop:60,
      display:'flex',
      justifyContent:'center',
      alignItems:'center',
      borderRadius:15,
      
  },

  input: {
      display: 'none',
    },

}));

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function Registration(props)
{ 
  const [list,setList]=useState([])
  const classes = useStyles();

const [registrationid,setRegistrationId]=useState('')
const [name,setName]=useState('')
const [mobile,setMobile]=useState('')
const [emailId,setEmailId]=useState('')
const [jobType,setJobType]=useState('')
const [dob,setDob]=useState('')
const [state,setState]=useState('')
const [city,setCity]=useState('')
const [stateList,setStateList]=useState([])
const [cityList,setCityList]=useState([])
const [Icon,setIcon]=useState({bytes:'',file:'/noimage.png'})
const [IconSaveCancel,setIconSaveCancel]=useState(false)
const [getRowData,setRowData]=useState([])
const [msg,setMsg]=useState('')    

const handleMobileNo=(event)=>{
  if(event.target.value.length===10)
  {
    setMsg(false)
    setMobile(event.target.value)
  }
  else
  {
    setMsg("Mobile number length must be of 10 Digits")
  }

}

  const fetchAllRegistration = async () => {
          var result = await getData("registration/displayall");
          setList(result);
        };

 ///////////////////////////////////////State and city fetch/////////////////////////////////////////////

const fetchAllStates=async()=>{
  var result=await getData('state/displayAll');
  setStateList(result);
}

const handleStateChange=async(event)=>{
  setState(event.target.value)
  FillStatebyCity(event.target.value)
}

const FillStatebyCity=async(sid)=>{
  var body={stateid:sid}
  var result = await  postData("state/displaycitybystateid",body)
    setCityList(result)

}

useEffect(function(){
  fetchAllStates();
},[])

const fillStates=()=>{
  return stateList.map((items)=>{
    return(
      <MenuItem value={items.stateid}>{items.statename}</MenuItem>
    )

    })
}

const fillCities=()=>{
  return cityList.map((items)=>{
    return(
      <MenuItem value={items.cityid}>{items.cityname}</MenuItem>
    )

    })
}

 /////////////////////////////////////////////////////////////////////////////////////
        
const handleIcon=(event)=>{
  setIcon({bytes:event.target.files[0],
      file:URL.createObjectURL(event.target.files[0])})
    }

    const handleEditIcon=(event)=>{
      setIcon({bytes:event.target.files[0],
          file:URL.createObjectURL(event.target.files[0])})
          setIconSaveCancel(true)
        }

const handleDelete = async (registrationid) => {
  var body = {registrationid:registrationid}
  var result = await postData("registration/deletedata",body)
  if (result){
    swal({
        title: "Data Deleted Successfully ",
        icon: "success",
        dangerMode: true,
      })
      setOpen(false)
      fetchAllRegistration()
}
else{
  swal({
    title: "Fail To Delete Record ",
    icon: "success",
    dangerMode: true,
  })
  }
}

const handleWarning=(rowData)=>{
  setRegistrationId(rowData.registrationid)
  swal({
      title: "Are you sure?",
      text: "Once deleted, you will not be able to recover this record",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    })
    .then((willDelete) => {
      if (willDelete) {
        handleDelete(registrationid)
        
      } 
    });
 }


const handleCancelIcon=()=>{
  
  setIcon({bytes:"",file:`${ServerURL}/images/${getRowData.icon}`})
  setIconSaveCancel(false)
}

const handleClickSaveIcon=async()=>{
 
  var formData= new FormData()
  formData.append("registrationid",registrationid)
  formData.append("icon",Icon.bytes)

  var config = {headers:{"content-type":"multipart/form-data"}}
  var result = await postDataAndImage('registration/editpicture',formData,config)
  if(result){
      swal({
          title: "Picture Updated Successfully",
          icon: "success",
          dangerMode: true,
        });
        setIconSaveCancel(false)
      
}
}

const handleEdit=async()=>{
  var error=false
  var msg="<div>"
  if(isBlank(name))
  {error=true
      msg+="<font  fontFamily= 'Georgia,Times,Times New Roman,serif' color='#e74c3c'><b>Name Should Not Be Blank..</b></font><br>"}

      if(isBlank(mobile))
  {error=true
      msg+="<font  fontFamily= 'Georgia,Times,Times New Roman,serif' color='#e74c3c'><b>Mobile No. Should Not Be Blank..</b></font><br>"}

      if(isBlank(emailId))
  {error=true
      msg+="<font  fontFamily= 'Georgia,Times,Times New Roman,serif' color='#e74c3c'><b>Email Id Should Not Be Blank..</b></font><br>"}
      if(isBlank(jobType))
      {error=true
       msg+="<font  fontFamily= 'Georgia,Times,Times New Roman,serif' color='#e74c3c'><b>Job Type Should Not Be Blank..</b></font><br>"}
     if(isBlank(dob))
        {error=true
        msg+="<font  fontFamily= 'Georgia,Times,Times New Roman,serif' color='#e74c3c'><b>DOB Should Not Be Blank..</b></font><br>"}
        if(isBlank(state))
        {error=true
        msg+="<font  fontFamily= 'Georgia,Times,Times New Roman,serif' color='#e74c3c'><b>State Should Not Be Blank..</b></font><br>"}
        if(isBlank(city))
        {error=true
         msg+="<font  fontFamily= 'Georgia,Times,Times New Roman,serif' color='#e74c3c'><b>City Should Not Be Blank..</b></font><br>"}
                
  if(error)
  {
      swalhtml(renderHTML(msg))
  }
  else{
  var body={'name':name,'mobile':mobile,'emailid':emailId,'jobtype':jobType,'dob':dob,'state':state,'city':city,'registrationid':registrationid};
  var result = await postData("registration/editdata", body);
  if (result) {
    swal({
      title: "Record Updated Successfully",
      icon: "success",
      dangerMode: true,
    });
  }}

}
////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////
//////////////////////Edit Dialoge/////////////////////////


const [open, setOpen] = React.useState(false);
const handleClickOpen = (rowData) => {
  setRowData(rowData)
  setOpen(true);
  setRegistrationId(rowData.registrationid)
  setName(rowData.name);
  setMobile(rowData.mobile);
  setEmailId(rowData.emailid);
  setJobType(rowData.jobtype);
  setDob(rowData.dob);
  setState(rowData.state);
  setCity(rowData.city);
  FillStatebyCity(rowData.state)
  setIcon({ bytes: "", file: `${ServerURL}/images/${rowData.icon}` });
  
  
};

const handleClose = () => {
  setOpen(false);
  fetchAllRegistration();
};

const showEditDialog=()=>{
  return (
    <div>
      <Dialog fullScreen open={open} onClose={handleClose} TransitionComponent={Transition}>
        <AppBar className={classes.appBar}>
          <Toolbar>
            <IconButton edge="start" color="inherit" onClick={handleClose} aria-label="close">
              <CloseIcon />
            </IconButton>
            <Typography variant="h6" className={classes.title}>
              Edit/Delete Record
            </Typography>
            <Button autoFocus color="inherit" onClick={()=>handleEdit()}>
              Update
            </Button>
            <Button autoFocus color="inherit" onClick={()=>handleWarning(getRowData)}>
              Delete
            </Button>
          </Toolbar>
        </AppBar>
        {editFormView()}
      </Dialog>
    </div>
  );


}


const editFormView=()=>{
  return(<div className={classes.root}>
    <div className={classes.subdiv} style={{padding:30,outline:'10px solid #dfe6e9'}}>    
        <Grid container spacing={2}>
            {/* Heading(Registration Interface) */}
            <Grid item xs={12} style={{display:'flex',marginBottom:25,justifyContent:'center',alignItems:'center',width:'50%',fontSize:22,fontWeight:700,fontFamily:'Georgia,Times,Times New Roman,serif', letterSpacing:1, padding:10}}>
                    Registration
            </Grid>

           <Grid item xs={12} sm={2}>
           <span style={{fontSize:16, fontWeight:500}}>Fullname</span>
            </Grid>

            
            <Grid item xs={12} xs={4}>
              <TextField value={name} onChange={(event)=>setName(event.target.value)} variant="outlined" fullWidth/>
            </Grid>

          {/* Upload Button */}
         <Grid item xs={12} sm={2}>
         <span style={{fontSize:16, fontWeight:500}}>Profile Pic</span>
          </Grid>
            <Grid item xs={12} sm={1}>
          <input
        onChange={(event)=>handleEditIcon(event)}
        accept="image/*"
        className={classes.input}
        id="contained-button-file"
        type="file"
        
      />
      <label htmlFor="contained-button-file">
        <Button variant="contained"  color="default" component="span" startIcon={<CloudUploadIcon />}>
          Upload
        </Button>
      </label>
            </Grid>

                    {/* Image Frame */}
                    <Grid item xs={12} sm={3} style={{display:'flex',justifyContent:'center',alignItems:'center'}}>
                        <Avatar variant="rounded" src={Icon.file} style={{width:60, height:60}}/>
                        {IconSaveCancel ? (
                <span>
                  <Button
                    onClick={() => handleClickSaveIcon()}
                    color="secondary"
                  >
                    Save
                  </Button>{" "}
                  <Button color="secondary" onClick={() => handleCancelIcon()}>
                    Cancel
                  </Button>
                </span>
              ) : (
                <></>
              )}
                    </Grid>

                    <Grid item xs={12} sm={2}>
                    <span style={{fontSize:16, fontWeight:500}}>Mobile</span>
                   </Grid>

                   <Grid item xs={12} sm={1}>
                     <TextField defaultValue="+" variant="outlined"/>
                   </Grid>

                    <Grid item xs={12} sm={3}>
                    <TextField value={mobile} onChange={(event)=>setMobile(event.target.value)} variant="outlined"/>
                    </Grid>
                    
                    <Grid item xs={12} sm={2}>
                    <span style={{fontSize:16, fontWeight:500}}>Email Id</span>
                   </Grid>

                    <Grid item xs={12} sm={4}>
                    <TextField value={emailId} onChange={(event)=>setEmailId(event.target.value)} variant="outlined" fullWidth/>
                    </Grid>

                    <Grid item xs={12} sm={2}>
                    <span style={{fontSize:16, fontWeight:500}}>Job Type</span>
                    </Grid>

                    <Grid item xs={12} sm={3} >
            <FormControl className={classes.formControl} variant="outlined" fullWidth>
        <InputLabel id="demo-simple-select-outlined-city`"></InputLabel>
        <Select
          labelId="demo-simple-select-outlined-city"
          id="demo-simple-select-outlined-city"
          value={jobType}
          onChange={(event)=>setJobType(event.target.value)}
        >
          <MenuItem value='Full Time'>FT</MenuItem>
          <MenuItem value='Part Time'>PT</MenuItem>
          <MenuItem value='Consultant'>Consultant</MenuItem>
        </Select>
      </FormControl>
          </Grid>
           
          <Grid item xs={12} sm={1}>
          </Grid>

                    <Grid item xs={12} sm={2}>
                    <span style={{fontSize:16, fontWeight:500}}>DOB</span>
                    </Grid>

                    <Grid item xs={12} sm={4}> 
          <TextField
        id="date"
        type="date"
        fullWidth
        required
        value={dob}
        onChange={(event)=>setDob(event.target.value)}
        variant="outlined"
       // defaultValue="2017-05-24"
        className={classes.textField}
        InputLabelProps={{
          shrink: true,
        }}
      />
      </Grid>

                    <Grid item xs={12} sm={2}>
                    <span style={{fontSize:16, fontWeight:500}}>Pref. Location</span>
                   </Grid>

                   <Grid item xs={12} sm={3}>
            <FormControl className={classes.formControl} variant="outlined" fullWidth>
        <InputLabel id="demo-simple-select-outlined-state`">State</InputLabel>
        <Select
          labelId="demo-simple-select-outlined-state"
          id="demo-simple-select-outlined-state"
          value={state}
          onChange={(event)=>handleStateChange(event)}
        >
          {fillStates()}
        </Select>
      </FormControl>
          </Grid>

         <Grid item xs={12} sm={3} >
            <FormControl className={classes.formControl} variant="outlined" fullWidth>
        <InputLabel id="demo-simple-select-outlined-city`">City</InputLabel>
        <Select
          labelId="demo-simple-select-outlined-city"
          id="demo-simple-select-outlined-city"
          value={city}
          onChange={(event)=>setCity(event.target.value)}
        >
         {fillCities()}
        </Select>
      </FormControl>
          </Grid>
                   
        </Grid>
        </div>
</div>

)
}

////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////
const handleResetClick=()=>{
  setName('')
  setIcon({bytes:'',file:'/noimage.png'})
  setMobile('')
  setEmailId('')
  setJobType('')
  setDob('')
  setState('')
  setCity('')
}

const handleSubmitClick=async()=>{
 var error=false
  var msg="<div>"
  if(isBlank(name))
  {error=true
        msg+="<font  fontFamily= 'Georgia,Times,Times New Roman,serif' color='#e74c3c'><b>Name Should Not Be Blank..</b></font><br>"
      }
  if(isBlank(Icon.bytes))
      {error=true
          msg+="<font  fontFamily= 'Georgia,Times,Times New Roman,serif' color='#e74c3c'><b>Please select icon for registration..</b></font><br>"
      } 
  if(isBlank(mobile))
      {error=true
         msg+="<font  fontFamily= 'Georgia,Times,Times New Roman,serif' color='#e74c3c'><b>Mobile No. Should Not Be Blank..</b></font><br>"
      }
         
  if(isBlank(emailId))
     {error=true
         msg+="<font  fontFamily= 'Georgia,Times,Times New Roman,serif' color='#e74c3c'><b>Email Id Should Not Be Blank..</b></font><br>"
        }
    
  if(isBlank(jobType))
     {error=true
        msg+="<font  fontFamily= 'Georgia,Times,Times New Roman,serif' color='#e74c3c'><b>Job Type Should Not Be Blank..</b></font><br>"
      }
  if(isBlank(dob))
     {error=true
        msg+="<font  fontFamily= 'Georgia,Times,Times New Roman,serif' color='#e74c3c'><b>DOB Should Not Be Blank..</b></font><br>"
      }
  if(isBlank(state))
     {error=true
        msg+="<font  fontFamily= 'Georgia,Times,Times New Roman,serif' color='#e74c3c'><b>State Should Not Be Blank..</b></font><br>"
      }
  if(isBlank(city))
     {error=true
        msg+="<font  fontFamily= 'Georgia,Times,Times New Roman,serif' color='#e74c3c'><b>City Should Not Be Blank..</b></font><br>"
      }
  if(error)
  {
      swalhtml(renderHTML(msg))
  }
  else{
    var formData=new FormData()
    formData.append("name",name)
    formData.append("mobile",mobile)
    formData.append("emailid",emailId)
    formData.append("jobtype",jobType)
    formData.append("dob",dob)
    formData.append("state",state)
    formData.append("city",city)
    
    formData.append("icon",Icon.bytes)
  
    var config={headers:{"content-type":"multipart/form-data"}}
    var result= await postDataAndImage('registration/addregistration',formData,config)
    if(result)
    {
      swal({
        title: "You are Registered Successfully",
        icon: "success",
        dangerMode: true,
      })
    }
    }
}
 const addcategory=()=>{
  return(<div className={classes.root}>
    <div className={classes.subdiv} style={{padding:30,outline:'10px solid #dfe6e9'}}>    
        <Grid container spacing={2}>
            {/* Heading(Category Interface) */}
            <Grid item xs={12} style={{display:'flex',marginBottom:25,justifyContent:'center',alignItems:'center',width:'50%',fontSize:22,fontWeight:700,fontFamily:'Georgia,Times,Times New Roman,serif', letterSpacing:1, padding:10}}>
                  Registration
            </Grid>

            {/* Text(Upload Category Icon) */}
            <Grid item sx={12} sm={2}>
            <span style={{fontSize:16, fontWeight:500}}>Fullname</span>
            </Grid>

            <Grid item xs={12} xs={4}>
              <TextField onChange={(event)=>setName(event.target.value)} variant="outlined" fullWidth/>
            </Grid>

         {/* Upload Button */}
         <Grid item xs={12} sm={2}>
         <span style={{fontSize:16, fontWeight:500}}>Profile Pic</span>
          </Grid>
            <Grid item xs={12} sm={2}>
          <input
          onChange={(event)=>handleIcon(event)}
        accept="image/*"
        className={classes.input}
        id="contained-button-file"
        multiple
        type="file"
        
      />
      <label htmlFor="contained-button-file">
        <Button variant="contained"  color="default" component="span" startIcon={<CloudUploadIcon />}>
          Upload
        </Button>
      </label>
            </Grid>

                    {/* Image Frame */}
                    <Grid item xs={12} sm={2} style={{display:'flex',justifyContent:'center',alignItems:'center'}}>
                        <Avatar variant="rounded" src={Icon.file} style={{width:60, height:60}}/>
                    </Grid>

                    <Grid item xs={12} sm={2}>
                    <span style={{fontSize:16, fontWeight:500}}>Mobile</span>
                   </Grid>

                    <Grid item xs={12} sm={1}>
                     <TextField defaultValue="+" readonly='true' variant="outlined"/>
                   </Grid>

                    <Grid item xs={12} sm={3}>
                    <TextField onChange={(event)=>handleMobileNo(event)} variant="outlined" fullWidth error={msg} />
                       <div style={{fontSize:9,fontWeight:'bold',color:'red'}}>
                        {msg} 
                       </div>
                    </Grid>

                    <Grid item xs={12} sm={2}>
                    <span style={{fontSize:16, fontWeight:500}}>Email Id</span>
                   </Grid>

                    <Grid item xs={12} sm={4}>
                    <TextField onChange={(event)=>setEmailId(event.target.value)} variant="outlined" fullWidth/>
                    </Grid>

                    <Grid item xs={12} sm={2}>
                    <span style={{fontSize:16, fontWeight:500}}>Job Type</span>
                    </Grid>

             <Grid item xs={12} sm={3} >
            <FormControl className={classes.formControl}  variant="outlined" fullWidth>
        <InputLabel id="demo-simple-select-outlined-city`"></InputLabel>
        <Select
          labelId="demo-simple-select-outlined-city"
          id="demo-simple-select-outlined-city"
          //value={CategoryName}
          onChange={(event)=>setJobType(event.target.value)}
        >
          <MenuItem value='Full Time'>FT</MenuItem>
          <MenuItem value='Part Time'>PT</MenuItem>
          <MenuItem value='Consultant'>Consultant</MenuItem>
        </Select>
      </FormControl>
          </Grid>
          
          <Grid item xs={12} sm={1}>
          </Grid>
                    <Grid item xs={12} sm={1}>
                    <span style={{fontSize:16, fontWeight:500}}>DOB</span>
                    </Grid>
                    <Grid item xs={12} sm={1}>
                   </Grid>

          <Grid item xs={12} sm={4}> 
          <TextField
        id="date"
        type="date"
        fullWidth
        onChange={(event)=>setDob(event.target.value)}
        variant="outlined"
       // defaultValue="2017-05-24"
        className={classes.textField}
        InputLabelProps={{
          shrink: true,
        }}
      />
      </Grid>


                    <Grid item xs={12} sm={2}>
                    <span style={{fontSize:16, fontWeight:500}}>Pref. Location</span>
                   </Grid>

            <Grid item xs={12} sm={3}>
            <FormControl className={classes.formControl}  variant="outlined" fullWidth>
        <InputLabel id="demo-simple-select-outlined-state`">State</InputLabel>
        <Select
          labelId="demo-simple-select-outlined-state"
          id="demo-simple-select-outlined-state"
          //value={CategoryName}
          onChange={(event)=>handleStateChange(event)}
        >
          {fillStates()}
        </Select>
      </FormControl>
          </Grid>

         <Grid item xs={12} sm={3} >
         <FormControl className={classes.formControl}  variant="outlined" fullWidth>
        <InputLabel id="demo-simple-select-outlined-city`">City</InputLabel>
        <Select
          labelId="demo-simple-select-outlined-city"
          id="demo-simple-select-outlined-city"
          onChange={(event)=>setCity(event.target.value)}
        >
         {fillCities()}
        </Select>
      </FormControl>
          </Grid>



                    <Grid item xs={12} sm={6} style={{display:'flex',justifyContent:'center',alignItems:'center'}}>
                        <Button style={{width:200}} onClick={()=>handleSubmitClick()}  variant="contained" color="primary">Save</Button>
                    </Grid>
                    <Grid item xs={12} sm={6} style={{display:'flex',justifyContent:'center',alignItems:'center'}}>
                        <Button type="reset" style={{width:200}} onClick={()=>handleResetClick()} variant="contained" color="primary">Reset</Button>
                    </Grid>
        </Grid>
        </div>

    
</div>

)
}


const [openCategoryDialog, setOpenCategoryDialog] = React.useState(false);

const handleOpenInterface = () => {
  handleResetClick();
  setOpenCategoryDialog(true);
  // fetchAllCategory();
};


const handleCloseInterface = () => {
  setOpenCategoryDialog(false);
  fetchAllRegistration();
};

const showCategoryDialog = () => {
  return (
    <div>
      <Dialog
        fullScreen
        open={openCategoryDialog}
        onClose={handleCloseInterface}
        TransitionComponent={Transition}
      >
        <AppBar className={classes.appBar}>
          <Toolbar>
            <IconButton
              edge="start"
              color="inherit"
              onClick={handleCloseInterface}
              aria-label="close"
            >
              <CloseIcon />
            </IconButton>
            <Typography variant="h6" className={classes.title}>
             Add Registration
            </Typography>
           
          </Toolbar>
        </AppBar>
        {addcategory()}
      </Dialog>
    </div>
  );
};


// //////////////////////////////////////////////////////////////////////////////////




useEffect(function(){
    fetchAllRegistration()
},[])

function displayAll() {
    return (
      <div>
      <MaterialTable
       title=""
        columns={[
        
          { title: 'Name', field: 'name' },
          { title: 'Email', field: 'emailid' },
            { title: 'Mobile', field: 'mobile' },
            { title: 'DOB', field: 'dob' },
            { title: 'Job Type', field: 'jobtype' },
        ]}
        data={ list } 
        
        options={{
          search: true,
          searchFieldVariant:'outlined',
          searchFieldAlignment:'left',
          actionsColumnIndex:-1,
          searchFieldStyle:{borderRadius:'20px',border:'1px solid #a4b0be',width:'85%',height:40},
          headerStyle:{fontWeight:700,padding:5,fontSize:17},
        }}
        actions={[
          {
            icon: () =>  <span><RefreshIcon color="primary"/></span>,
           onClick: () => {
             fetchAllRegistration();
           },
           isFreeAction: true,
           tooltip: 'Refresh',
         },

            {
              icon:  () =>  <span><Button variant='contained' color='default'><LibraryAddSharpIcon/>ADD</Button></span>,
              onClick: () => {
                handleOpenInterface();
              },
              isFreeAction: true,
              tooltip: 'Add',
              
          },
          
          {
            icon: 'edit',
            onClick: (event, rowData) => {
              handleClickOpen(rowData);
            },
            tooltip: 'Edit',
            
          },

          {
            icon: 'delete',
            //tootltip: 'Edit Tailor',
            onClick: (event, rowData) => {
              handleWarning(rowData)
           
            },
            tooltip:'Delete',
            
          },
         
        ]}
        
         
          
      />
      {showEditDialog()}
      {showCategoryDialog()}
      </div>
    )
  }
  return (<div style={{display:'flex',justifyContent:'center',alignItem:'center'}}>
     <div  style={{width:1000,marginTop:40,padding:3,display:'flex',backgroundColor:"#FFF",justifyContent:'center',alignContent:'center',alignItem:'center',flexDirection:'column'}}>
  <div style={{justifyContent:'center', display:'flex',alignItems:'center'}}>
    <div style={{fontSize: 22,fontWeight:700,fontFamily:'Georgia,Times,Times New Roman,serif', letterSpacing:2, padding:20}}>Registration List</div>
    </div>
    
      {displayAll()}
      
      
      </div>
      </div>)
      }