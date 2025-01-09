import { Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'

const StatusSymbol = ({meetingCurrentData}) => {
  
    const [response,setResponse] =useState({ color:'', statusText:''})
    useEffect(()=>{
        if(meetingCurrentData?.length>0){
        setResponse({...response,color:"error",statusText:"Ongoing"})
        }else{
          setResponse({...response,color:"primary",statusText:"Available"})
        }
    },[meetingCurrentData])

  return (
    <>
    <Typography variant="body1" color={response.color}>
    {response.statusText}
      </Typography>
    </>
  )
}

export default StatusSymbol