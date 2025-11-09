import {
  Avatar,
  Button,
  Card,
  CardContent,
  Typography,
  Box,
  Divider
} from '@mui/material'
import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { axiosGet } from 'src/Components/axiosCall'
import { useIntl } from 'react-intl'
import { LoadingButton } from '@mui/lab'
import IconifyIcon from 'src/Components/icon'

function Profile() {
  const { messages, locale } = useIntl()
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState(null)

  useEffect(() => {
    setLoading(true)
    const loadingToast = toast.loading(messages.userPage.loading)

    axiosGet('User/GetProfile', locale)
      .then(res => {
        if (res.status && res.result) {
          setUser(res.result)
        } 
        else {
            setUser({
                firstName: 'Eriny',
                lastName: 'Adel',
                email: 'static@data.com',
                roleName: 'My Role',
                createdAt: new Date().toISOString()
            })
        }
      })
      .catch(() => {
        toast.error(messages.userPage.failedToLoadProfile)
      })
      .finally(() => {
        setLoading(false)
        toast.dismiss(loadingToast)
      })
  }, [locale])

  return (
    <Box sx={{ p: 5 }}>
      <Typography variant='h4' sx={{ mb: 4, fontWeight: 'bold', color: 'primary.main' }}>
        {messages.myProfile}
      </Typography>

      <Card sx={{ p: 4 }}>
        {loading ? (
          <Typography variant='body1'>{messages.userPage.loading}</Typography>
        ) : user ? (
          <Box className='flex flex-col sm:flex-row gap-4 items-center'>
            <Avatar
              alt={user.firstName}
              sx={{ width: 100, height: 100, bgcolor: 'primary.main', fontSize: '2rem' }}
            >
              {user.firstName ? user.firstName[0].toUpperCase() : '?'}
            </Avatar>

            <Box className='flex flex-col gap-2 w-full'>
              <Typography variant='h6'>{user.firstName} {user.lastName}</Typography>
              <Typography variant='body1' color='text.secondary'>
                {messages.email}: {user.email}
              </Typography>
              <Typography variant='body2' color='text.secondary'>
                {messages.rolePage.role}: {user.roleName}
              </Typography>
              <Typography variant='body2' color='text.secondary'>
                {messages.clientPage.createdAt}: {new Date(user.createdAt).toLocaleString(locale)}
              </Typography>

              <Divider sx={{ my: 2 }} />

              <Button
                variant='contained'
                color='primary'
                startIcon={<IconifyIcon icon='tabler:edit' />}
              >
                {messages.userPage.editProfile}
              </Button>
            </Box>
          </Box>
        ) : (
          <Typography color='error'>{messages.userPage.noUserFound}</Typography>
        )}
      </Card>
    </Box>
  )
}

export default Profile
