import { yupResolver } from '@hookform/resolvers/yup'
import { Icon } from '@iconify/react'
import { Box, Button, Chip, Drawer, IconButton, MenuItem, useTheme } from '@mui/material'
import { Controller, useForm } from 'react-hook-form'
import * as yup from 'yup'
import CustomTextField from 'src/@core/components/mui/text-field'
import { LoadingButton } from '@mui/lab'
import { toast } from 'react-toastify'
import { useEffect, useState } from 'react'
import { axiosGet, axiosPost } from './axiosCall'
import { useIntl } from 'react-intl'
import CustomAutocomplete from 'src/@core/components/mui/autocomplete'

function CreateClient({ open, handleClose, setReRender }) {
  const theme = useTheme()
  const { locale, messages } = useIntl()

  const schema = yup.object().shape({
    displayName: yup.string().required(messages.required),
    clientId: yup.string().required(messages.required),
    clientSecret: yup.string().required(messages.required),
    redirectUris: yup.string().required(messages.required).url(messages.invalidUrl),
    postLogoutRedirectUris: yup.string().required(messages.required).url(messages.invalidUrl),
    roles: yup.array()
  })

  const [loading, setLoading] = useState(false)

  const defaultValues = {
    displayName: '',
    clientId: '',
    clientSecret: '',
    redirectUris: '',
    postLogoutRedirectUris: '',
    roles: []
  }

  console.log(schema)

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

  const onSubmit = data => {
    const sendData = {
      displayName: data.displayName,
      clientId: data.clientId,
      clientSecret: data.clientSecret,
      redirectUris: data.redirectUris,
      postLogoutRedirectUris: data.postLogoutRedirectUris,
      roles: data.roles.map(role => role.name)
    }

    setLoading(true)
    const loadingToast = toast.loading('Uploading...')
    if (typeof open === 'object') {
      if (data.roles.length === 0) {
        delete sendData.roles
      }
      sendData.id = open.id

      axiosPost(`Client/Edit`, 'en', sendData)
        .then(res => {
          if (res.status) {
            toast.success(messages.clientPage.updateClientSuccess)
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
      axiosPost(`Client/Register`, 'en', sendData)
        .then(res => {
          if (res.status) {
            toast.success(messages.clientPage.createClientSuccess)
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
        console.log("open")
        console.log(open)
        setValue('displayName', open.displayName)
        setValue('clientId', open.clientId)
        setValue('clientSecret', open.clientSecret)
        setValue('redirectUris', open.redirectUris)
        setValue('postLogoutRedirectUris', open.postLogoutRedirectUris)
        setValue('roles', open.assignedRoles)
        trigger('displayName')
        trigger('clientId')
        trigger('clientSecret')
        trigger('redirectUris')
        trigger('postLogoutRedirectUris')
        trigger('roles')
      }
    }
  }, [open, reset, setValue, trigger])

  const [roles, setRoles] = useState([])

  useEffect(() => {
    setLoading(true)
    const loadingToast = toast.loading(messages.userPage.loading)

    axiosGet(`Role/GetRoles/?pageNo=${1}&pageSize${200}`, locale)
      .then(res => {
        if (res.status) {
          setRoles(res.result.roles)
        }
      })
      .finally(() => {
        setLoading(false)
        toast.dismiss(loadingToast)
      })
  }, [locale, messages])

  console.log(getValues())

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
            {typeof open === 'object' ? messages.clientPage.editClient : messages.clientPage.createClient}
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
            name='displayName'
            control={control}
            rules={{ required: true }}
            render={({ field: { value, onChange } }) => (
              <Box sx={{ position: 'relative', width: '100%' }}>
                <CustomTextField
                  fullWidth
                  label={messages.clientPage.displayName}
                  className='capitalize'
                  value={value}
                  onChange={onChange}
                  error={Boolean(errors.displayName)}
                  {...(errors.displayName && { helperText: errors.displayName.message })}
                />
              </Box>
            )}
          />
          <Controller
            name='roles'
            control={control}
            rules={{ required: true }}
            render={({ field: { value, onChange } }) => {
              // Filter out selected roles from the dropdown list
              const availableRoles = roles.filter(
                role => !value.some(selected => selected.id === role.id)
              )

              return (
                <Box sx={{ position: 'relative', width: '100%', marginTop: 4 }}>
                  <CustomAutocomplete
                    multiple
                    value={value}
                    options={availableRoles}
                    label={messages.clientPage.roles}
                    id='autocomplete-fixed-option'
                    getOptionLabel={option => option.name || ''}
                    renderInput={params => (
                      <CustomTextField {...params} label={messages.clientPage.roles} />
                    )}
                    onChange={(event, newValue) => {
                      const uniqueValues = Array.from(
                        new Set(newValue.map(item => JSON.stringify(item)))
                      ).map(item => JSON.parse(item))
                      onChange(uniqueValues)
                    }}
                    renderTags={(tagValue, getTagProps) =>
                      tagValue.map((option, index) => (
                        <Chip
                          label={option.name}
                          color='primary'
                          {...getTagProps({ index })}
                          key={index}
                        />
                      ))
                    }
                  />
                </Box>
              )
            }}
          />

          <Controller
            name='clientId'
            control={control}
            rules={{ required: true }}
            render={({ field: { value, onChange } }) => (
              <Box sx={{ position: 'relative', width: '100%', marginTop: 4 }}>
                <CustomTextField
                  fullWidth
                  label={messages.clientPage.clientId}
                  className='capitalize'
                  value={value}
                  onChange={onChange}
                  error={Boolean(errors.clientId)}
                  {...(errors.clientId && { helperText: errors.clientId.message })}
                />
              </Box>
            )}
          />
          <Controller
            name='clientSecret'
            control={control}
            rules={{ required: true }}
            render={({ field: { value, onChange } }) => (
              <Box sx={{ position: 'relative', width: '100%', marginTop: 4 }}>
                <CustomTextField
                  fullWidth
                  label={messages.clientPage.clientSecret}
                  className='capitalize'
                  value={value}
                  onChange={onChange}
                  error={Boolean(errors.clientSecret)}
                  {...(errors.clientSecret && { helperText: errors.clientSecret.message })}
                />
              </Box>
            )}
          />
          <Controller
            name='redirectUris'
            control={control}
            rules={{ required: true }}
            render={({ field: { value, onChange } }) => (
              <Box sx={{ position: 'relative', width: '100%', marginTop: 4 }}>
                <CustomTextField
                  fullWidth
                  label={messages.clientPage.redirectUris}
                  className='capitalize'
                  value={value}
                  onChange={onChange}
                  error={Boolean(errors.redirectUris)}
                  {...(errors.redirectUris && { helperText: errors.redirectUris.message })}
                />
              </Box>
            )}
          />
          <Controller
            name='postLogoutRedirectUris'
            control={control}
            rules={{ required: true }}
            render={({ field: { value, onChange } }) => (
              <Box sx={{ position: 'relative', width: '100%', marginTop: 4 }}>
                <CustomTextField
                  fullWidth
                  label={messages.clientPage.postLogoutRedirectUris}
                  className='capitalize'
                  value={value}
                  onChange={onChange}
                  error={Boolean(errors.postLogoutRedirectUris)}
                  {...(errors.postLogoutRedirectUris && { helperText: errors.postLogoutRedirectUris.message })}
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

export default CreateClient
