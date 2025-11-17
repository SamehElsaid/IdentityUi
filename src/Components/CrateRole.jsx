import { yupResolver } from '@hookform/resolvers/yup'
import { Icon } from '@iconify/react'
import { Box, Button, Drawer, IconButton, MenuItem, useTheme } from '@mui/material'
import { Controller, useForm } from 'react-hook-form'
import * as yup from 'yup'
import CustomTextField from 'src/@core/components/mui/text-field'
import { LoadingButton } from '@mui/lab'
import { toast } from 'react-toastify'
import { useEffect, useState } from 'react'
import { axiosGet, axiosPost } from './axiosCall'
import { useIntl } from 'react-intl'

function CreateRole({ open, handleClose, setReRender }) {
  const theme = useTheme()
  const { locale, messages } = useIntl()

  const schema = yup.object().shape({
    name: yup.string().required(messages.required)
  })

  const [loading, setLoading] = useState(false)

  const defaultValues = {
    name: ''
  }

  const {
    control,
    setError,
    watch,
    setValue,
    reset,
    handleSubmit,
    trigger,
    getValues,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: defaultValues,
    mode: 'onChange'
  })

  console.log(errors)

  const onSubmit = data => {
    const sendData = {
      name: data.name
    }

    setLoading(true)
    const loadingToast = toast.loading('Uploading...')
    if (typeof open === 'object') {
      axiosGet(`Role/UpdateRole?roleId=${open.id}&newRoleName=${sendData.name}`, 'en')
        .then(res => {
          if (res.status) {
            toast.success(messages.rolePage.updateRoleSuccess)
            handleClose()
            setReRender(prev => prev + 1)
          }
        })
        .finally(() => {
          setLoading(false)
          toast.dismiss(loadingToast)
        })
        .finally(() => {
          setLoading(false)
          toast.dismiss(loadingToast)
        })
    } else {
      axiosGet(`Role/AddRole?roleName=${sendData.name}`, 'en')
        .then(res => {
          if (res.status) {
            toast.success(messages.rolePage.createRoleSuccess)
            handleClose()
            setReRender(prev => prev + 1)
          }
        })
        .finally(() => {
          setLoading(false)
          toast.dismiss(loadingToast)
        })
    }
  }

  useEffect(() => {
    if (!open) {
      reset()
      setLoading(false)
    } else {
      if (typeof open === 'object') {
        setValue('name', open.name)
        trigger('name')
      }
    }
  }, [open, reset])

  return (
    <Drawer
      open={open}
      anchor='right'
      variant='temporary'
      className='Drawer'
      onClose={handleClose}
      ModalProps={{ keepMounted: true }}
      sx={{ '& .MuiDrawer-paper': { width: { xs: '90%', sm: '500px' } } }}
    >
      <div className='h-full flex flex-col'>
        <div
          style={{ backgroundColor: theme.palette.mode === 'dark' ? '#2f324a' : '#feffff' }}
          className='flex justify-between items-center sticky top-0 p-4 z-10'
        >
          <h1 className='text-2xl font-bold'>
            {' '}
            {typeof open === 'object' ? messages.rolePage.editRole : messages.rolePage.createRole}
          </h1>
          <button
            onClick={handleClose}
            className='w-8 h-8 flex justify-center items-center bg-main-color rounded-full text-white text-2xl hover:bg-main-color/80 transition-all duration-300'
          >
            <Icon icon='tabler:x' />
          </button>
        </div>
        <form noValidate autoComplete='off' onSubmit={handleSubmit(onSubmit)} className='p-4  flex-1  flex flex-col'>
          <div className='mt-4'></div>
          <Controller
            name='name'
            control={control}
            rules={{ required: true }}
            render={({ field: { value, onChange } }) => (
              <Box sx={{ position: 'relative', width: '100%' }}>
                <CustomTextField
                  fullWidth
                  label={<span>{messages.userPage.name} <small style={{ color: 'red' }}>*</small></span>}
                  className='capitalize'
                  value={value}
                  onChange={onChange}
                  error={Boolean(errors.name)}
                  {...(errors.name && { helperText: errors.name.message })}
                />
              </Box>
            )}
          />

          <div
            className='mt-auto flex justify-end gap-2 pt-4 sticky bottom-0'
            style={{ backgroundColor: theme.palette.mode === 'dark' ? '#2f324a' : '#feffff' }}
          >
            <LoadingButton loading={loading} variant='tonal' color='success' type='submit'>
              {typeof open === 'object' ? messages.save : messages.create}
            </LoadingButton>
            <Button variant='tonal' color='error' onClick={handleClose}>
              {messages.cancel}
            </Button>
          </div>
        </form>
      </div>
    </Drawer>
  )
}

export default CreateRole
