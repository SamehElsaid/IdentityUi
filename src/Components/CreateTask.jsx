import { yupResolver } from '@hookform/resolvers/yup'
import { Box, Button, Chip, Drawer, useTheme } from '@mui/material'
import { Controller, useForm } from 'react-hook-form'
import * as yup from 'yup'
import { LoadingButton } from '@mui/lab'
import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { axiosGet, axiosPost } from 'src/Components/axiosCall'
import CustomTextField from 'src/@core/components/mui/text-field'
import CustomAutocomplete from 'src/@core/components/mui/autocomplete'
import { useIntl } from 'react-intl'
import { Icon } from '@iconify/react'

function CreateTask({ open, handleClose, setReRender }) {
  const theme = useTheme()
  const { locale, messages } = useIntl()
  const [paginationModel, setPaginationModel] = useState({ pageNo: 0, pageSize: 10 })

  const schema = yup.object().shape({
    name: yup.string().required(messages.required),
    role: yup.object().required(messages.required)
  })

  const {
    control,
    reset,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: { name: '', role: '' }
  })

  const [loading, setLoading] = useState(false)
  const [roles, setRoles] = useState([])

  useEffect(() => {
    axiosPost(
      `Role/GetRoles`, 
      locale,
      {
        pageNo: paginationModel.pageNo + 1,
        PageSize: paginationModel.pageSize
      }
    )
      .then(res => {
        if (res.status) setRoles(res.result.roles)
      })
  }, [locale])

  const onSubmit = data => {
    setLoading(true)
    const loadingToast = toast.loading('Saving...')

    fetch(`${process.env.API_BASE_URL}/task-type-lookup/add`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept-Language': locale
        },
        body: JSON.stringify({
          name: data.name,
          role: data.role.name
        })
      }
    )
      .then(res => res.json())
      .then(res => {
        if (res.isSuccess) {
          toast.success(messages.taskPage.createTaskSuccess)
          handleClose()
          setReRender(prev => prev + 1)
        }
      })
      .catch(err => console.error(err))
      .finally(() => {
        setLoading(false)
        toast.dismiss(loadingToast)
      })
  }

  useEffect(() => {
    if (!open) reset()
  }, [open, reset])

  return (
    <Drawer
      open={open}
      anchor='right'
      onClose={handleClose}
      sx={{ '& .MuiDrawer-paper': { width: { xs: '90%', sm: '450px' } } }}
    >
      <div className='h-full flex flex-col'>
        <div className='flex justify-between items-center p-4'>
          <h2 className='text-xl font-bold'>{messages.taskPage.createTask}</h2>
          <button onClick={handleClose}>
            <Icon icon='tabler:x' />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className='p-4 flex flex-col gap-4 flex-1'>
          <Controller
            name='name'
            control={control}
            render={({ field }) => (
              <CustomTextField
                {...field}
                fullWidth
                label={messages.taskPage.taskName}
                error={Boolean(errors.name)}
                helperText={errors.name?.message}
              />
            )}
          />

          <Controller
            name='role'
            control={control}
            render={({ field }) => (
              <CustomAutocomplete
                options={roles}
                value={field.value}
                getOptionLabel={o => o.name}
                onChange={(_, val) => field.onChange(val)}
                renderInput={params => (
                  <CustomTextField
                    {...params}
                    label={messages.rolePage.roles}
                    error={Boolean(errors.role)}
                    helperText={errors.role?.message}
                  />
                )}
              />
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

export default CreateTask
