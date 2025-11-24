import React from 'react'
import TextField from '@mui/material/TextField'
import Box from '@mui/material/Box'
import { useSelector } from 'react-redux'

const ThreeInputs = () => {
  const profile = useSelector(rx => rx.auth.data)
  
  return (
    <Box
      component='form'
      sx={{ display: 'flex', flexDirection: 'column', gap: 2, maxWidth: 300, margin: 'auto' }}
      noValidate
      autoComplete='off'
    >
      <TextField label='Name' variant='outlined' value={profile.name ?? ''} fullWidth disabled />
      <TextField label='Email' variant='outlined' value={profile.email ?? ''} fullWidth disabled />
      <TextField label='Role' variant='outlined' value={profile.role ?? ''} fullWidth disabled />
    </Box>
  )
}

export default ThreeInputs
