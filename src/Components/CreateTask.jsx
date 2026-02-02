import { yupResolver } from '@hookform/resolvers/yup'
import { Button, Drawer, useTheme } from '@mui/material'
import { Controller, useForm } from 'react-hook-form'
import * as yup from 'yup'
import { LoadingButton } from '@mui/lab'
import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { axiosGet } from 'src/Components/axiosCall'
import CustomTextField from 'src/@core/components/mui/text-field'
import CustomAutocomplete from 'src/@core/components/mui/autocomplete'
import { useIntl } from 'react-intl'
import { Icon } from '@iconify/react'

function CreateTask({ open, handleClose, setReRender, data }) {
  const theme = useTheme()
  const { locale, messages } = useIntl()

  const schema = yup.object().shape({
    name: yup.string().required(messages.required),
    role: yup.object().nullable().required(messages.required)
  })

  const {
    control,
    setValue,
    reset,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      name: '',
      role: ''
    }
  })

  const [loading, setLoading] = useState(false)
  const [roles, setRoles] = useState([])

  useEffect(() => {
    axiosGet('Role/GetRoles', locale).then(res => {
      if (res?.status) {
        setRoles(res.result.roles || [])
      }
    })
  }, [locale])

  useEffect(() => {
    if (!open) {
      reset({ name: '', role: null })

      return;
    }

    if (data && roles.length) {
      setValue('name', data.name)

      const selectedRole = roles.find(r => r.name === data.role)
      setValue('role', selectedRole || null)
    }
  }, [open, data, roles, reset, setValue])

  const onSubmit = formData => {
    setLoading(true)
    const loadingToast = toast.loading('Saving...')

    const isEdit = Boolean(data)

    const url = isEdit
      ? `${process.env.API_BASE_URL}/task-type-lookup/update/${data.id}`
      : `${process.env.API_BASE_URL}/task-type-lookup/add`

    fetch(url, {
      method: isEdit ? 'PUT' : 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept-Language': locale
      },
      body: JSON.stringify({
        name: formData.name,
        role: formData.role.name
      })
    })
      .then(async res => {
        if (!res.ok) {
          toast.error(isEdit ? messages.taskPage.updateTaskFailed : messages.taskPage.createTaskFailed)

          return null
        }

        const text = await res.text()
        
        return text ? JSON.parse(text) : { isSuccess: true }
      })
      .then(result => {
        if (!result) 
          
          return;

        if (result.isSuccess) {
          toast.success(
            isEdit
              ? messages.taskPage.updateTaskSuccess
              : messages.taskPage.createTaskSuccess
          )

          handleClose()
          setReRender(prev => prev + 1)
        }
      })
      .catch(() => {
        toast.error(messages.generalError || 'Unexpected error')
      })
      .finally(() => {
        setLoading(false)
        toast.dismiss(loadingToast)
      })
  }

  return (
    <Drawer
      open={open}
      anchor="right"
      onClose={handleClose}
      sx={{ '& .MuiDrawer-paper': { width: { xs: '90%', sm: 450 } } }}
    >
      <div className="h-full flex flex-col">
        <div className="flex justify-between items-center p-4">
          <h2 className="text-xl font-bold">
            {data ? messages.taskPage.editTask : messages.taskPage.createTask}
          </h2>
          <button onClick={handleClose}>
            <Icon icon="tabler:x" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-4 flex flex-col gap-4 flex-1">
          <Controller
            name="name"
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
            name="role"
            control={control}
            render={({ field }) => (
              <CustomAutocomplete
                options={roles}
                value={field.value}
                getOptionLabel={o => o?.name || ''}
                isOptionEqualToValue={(o, v) => o.id === v.id}
                onChange={(_, val) => field.onChange(val)}
                renderInput={params => (
                  <CustomTextField
                    {...params}
                    label={messages.rolePage.role}
                    error={Boolean(errors.role)}
                    helperText={errors.role?.message}
                  />
                )}
              />
            )}
          />

          <div
            className="mt-auto flex justify-end gap-2 pt-4 sticky bottom-0"
            style={{
              backgroundColor: theme.palette.mode === 'dark' ? '#2f324a' : '#feffff'
            }}
          >
            <LoadingButton loading={loading} variant="tonal" color="success" type="submit">
              {data ? messages.save : messages.create}
            </LoadingButton>

            <Button variant="tonal" color="error" onClick={handleClose}>
              {messages.cancel}
            </Button>
          </div>
        </form>
      </div>
    </Drawer>
  )
}

export default CreateTask
