import { Icon } from '@iconify/react'
import { LoadingButton } from '@mui/lab'
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  Grid,
  IconButton,
  InputAdornment,
  Radio,
  RadioGroup,
  Typography
} from '@mui/material'
import { styled } from '@mui/material/styles'
import { useEffect, useRef, useState } from 'react'
import { useIntl } from 'react-intl'
import { toast } from 'react-toastify'
import CustomTextField from 'src/@core/components/mui/text-field'
import PagnationTable from './TableEdit/PagnationTable'
import { axiosPost } from './axiosCall'
import ImageLoad from './ImageLoad'

const CustomCloseButton = styled(IconButton)(() => ({
  top: 0,
  right: 0,
  color: 'white',
  position: 'absolute',
  boxShadow: '20px',
  transform: 'translate(10px, -10px)',
  borderRadius: '10px',
  backgroundColor: `#00cfe8!important`,
  transition: 'transform 0.25s ease-in-out, box-shadow 0.25s ease-in-out',
  '&:hover': {
    transform: 'translate(7px, -5px)'
  }
}))

export default function AssignUsers({ open, setOpen, setRefresh }) {
  const { locale, messages } = useIntl()
  const [loadingBtn, setLoadingBtn] = useState(false)
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 })
  const [loading, setLoading] = useState(false)
  const [startSearch, setStartSearch] = useState(false)
  const [data, setData] = useState([])
  const [totalRows, setTotalRows] = useState(0)
  const [value, setValue] = useState('')
  const searchData = useRef({
    search: '',
    id: '',
    email: ''
  })

  const close = () => {
    setOpen(false)
    setValue('')
    setPaginationModel({ page: 0, pageSize: 10 })
    setStartSearch(false)
    setData([])
    setTotalRows(0)
    Object.keys(searchData.current).forEach(key => {
      searchData.current[key] = ''
    })
  }

  useEffect(() => {
    if (!open) return
    setLoading(true)
    const loadingToast = toast.loading(messages.userPage.loading)
    const body = {
      pageNo: paginationModel.page + 1,
      pageSize: paginationModel.pageSize
    }
    if (searchData.current.search) {
      body.firstName = searchData.current.search
    }
    if (searchData.current.id) {
      body.id = searchData.current.id
    }
    if (searchData.current.kind) {
      body.isActive = searchData.current.kind === 'active' ? true : false
    }
    if (searchData.current.email) {
      body.email = searchData.current.email
    }
    axiosPost(`User/UsersList`, locale, body)
      .then(res => {
        console.log(res)
        if (res.status) {
          setData(res.result.users)
          setTotalRows(res.result.totalRecords)
        }
      })
      .finally(() => {
        setLoading(false)
        toast.dismiss(loadingToast)
      })
  }, [locale, paginationModel.page, paginationModel.pageSize, startSearch, open])

  const handleChange = event => {
    setValue(event.target.value)
  }

  const columns = [
    {
      flex: 0.05,
      minWidth: 60,
      field: 'index',
      disableColumnMenu: true,

      headerName: '#',
      renderCell: ({ row }) => (
        <Typography variant='subtitle2' sx={{ fontWeight: 500, color: 'text.secondary' }}>
          {`${row.index + 1}`}
        </Typography>
      )
    },
    {
      flex: 0.05,
      minWidth: 60,
      field: 'select',
      disableColumnMenu: true,

      headerName: '#',
      renderCell: ({ row }) => (
        <RadioGroup row aria-label='controlled' name='controlled' value={value} onChange={handleChange}>
          <FormControlLabel value={row.id} control={<Radio />} />
        </RadioGroup>
      )
    },

    {
      flex: 0.9,
      minWidth: 300,
      field: 'name.firstName',
      disableColumnMenu: true,
      headerName: messages.userPage.userInfo,
      renderCell: ({ row }) => {
        return (
          <div className='flex gap-2 items-center'>
            <ImageLoad
              src={row.image}
              notFound={row.image ? false : true}
              id={row.index}
              isFirstWord={!row.image ? row.firstName : false}
              alt={row.name}
              stop={row.image ? false : true}
              className='!w-[40px] !h-[40px] object-cover rounded-full'
            />

            <div className=''>
              <Typography variant='subtitle2' className='capitalize' sx={{ fontWeight: 500, color: 'text.secondary' }}>
                {row.firstName} {row.second_name}
              </Typography>
              <Typography variant='subtitle2' sx={{ fontWeight: 500, color: 'text.secondary' }}>
                {row.email}
              </Typography>
              {row.phone && (
                <Typography variant='subtitle2' sx={{ fontWeight: 500, color: 'text.secondary' }}>
                  {row.phone}
                </Typography>
              )}

              <Typography variant='subtitle2' sx={{ fontWeight: 500, color: 'text.secondary' }}>
                #{row.id}
              </Typography>
            </div>
          </div>
        )
      }
    }
  ]
  const onSubmit = data => {
    setLoadingBtn(true)
    axiosPost(`Role/AssignUserToRolesAsync`, locale, {
      userId: value,
      roles: [open.name]
    })
      .then(res => {
        console.log(res)
        if (res.status) {
          toast.success(messages.rolePage.assignToUsersSuccess)
          close()
        }
      })
      .finally(() => {
        setLoadingBtn(false)
      })
    // const formData = new FormData()
  }

  const formRef = useRef(null)

  return (
    <Dialog
      sx={{ '& .MuiDialog-paper': { overflow: 'visible' } }}
      fullWidth
      maxWidth='lg'
      scroll='body'
      open={Boolean(open)}
      onClose={close}
    >
      <DialogTitle
        component='div'
        sx={{
          textAlign: 'center',
          px: theme => [`${theme.spacing(5)} !important`, `${theme.spacing(15)} !important`],
          pt: theme => [`${theme.spacing(8)} !important`, `${theme.spacing(12.5)} !important`]
        }}
      >
        <Typography variant='h3' sx={{ mb: 2 }}>
          {locale === 'ar' ? 'اضافة مستخدمين' : 'Assign Users'}
        </Typography>
      </DialogTitle>
      <DialogContent>
        <Grid sx={{ mb: 8 }}>
          <CustomCloseButton onClick={close}>
            <Icon icon='tabler:x' fontSize='1.25rem' />
          </CustomCloseButton>
        </Grid>
        <Box className='flex flex-col items-center'>
          <form
            ref={formRef}
            onSubmit={e => {
              e.preventDefault()

              const noData = []

              Object.keys(searchData.current).forEach(key => {
                if (searchData.current[key] !== '') {
                  noData.push(true)
                }
              })

              if (noData.includes(true)) {
                setStartSearch(true)
                setPaginationModel({ page: 0, pageSize: 10 })
                setRefresh(prev => prev + 1)
              } else {
                toast.info(messages.userPage.mustEnterSearchData)
              }
            }}
            className='px-5 ~~ mb-5 || w-full'
          >
            <div className='flex md:flex-row flex-col w-full gap-5 '>
              <CustomTextField
                name='search'
                className='w-full'
                fullWidth
                label={messages.userPage.name}
                defaultValue={searchData.current.search}
                onInput={e => {
                  searchData.current.search = e.target.value
                }}
              />
              <CustomTextField
                name='id'
                className='w-full'
                fullWidth
                label={messages.userPage.userId}
                defaultValue={searchData.current.id}
                InputProps={{
                  startAdornment: <InputAdornment position='end'>#</InputAdornment>
                }}
                onInput={e => {
                  const value = e.target.value.replace('#', '')
                  e.target.value = value
                  searchData.current.id = value
                }}
              />

              <CustomTextField
                name='search'
                className='w-full'
                fullWidth
                type='email'
                label={messages.email}
                defaultValue={searchData.current.email}
                onInput={e => {
                  searchData.current.email = e.target.value
                }}
              />
            </div>

            <div className='flex gap-2 justify-end mt-5'>
              <LoadingButton loading={loading} variant='contained' type='submit' name='search' color='success'>
                {messages.search}
              </LoadingButton>
              {startSearch && (
                <LoadingButton
                  loading={loading}
                  onClick={() => {
                    Object.keys(searchData.current).forEach(key => {
                      searchData.current[key] = ''
                    })
                    setStartSearch(false)
                    setPaginationModel({ page: 0, pageSize: 10 })
                    setRefresh(prev => prev + 1)
                    formRef.current.reset()
                  }}
                  variant='contained'
                  type='button'
                  color='error'
                >
                  {messages.clear}
                </LoadingButton>
              )}
            </div>
          </form>
          <div className='mt-4 w-full'>
            <PagnationTable
              Invitationscolumns={columns}
              data={data?.map((ele, i) => {
                const fData = { ...ele }
                fData.index = i + paginationModel.page * paginationModel.pageSize

                return fData
              })}
              totalRows={totalRows}
              getRowId={row => row.id}
              loading={loading}
              locale={locale}
              paginationModel={paginationModel}
              setPaginationModel={setPaginationModel}
            />
          </div>
        </Box>
      </DialogContent>
      <DialogActions
        sx={{
          justifyContent: 'center',
          mt: 4,
          px: theme => [`${theme.spacing(5)} !important`, `${theme.spacing(15)} !important`],
          pb: theme => [`${theme.spacing(8)} !important`, `${theme.spacing(12.5)} !important`]
        }}
      >
        <LoadingButton loading={loadingBtn} variant='contained' type='submit' onClick={onSubmit} color='success'>
          {locale === 'ar' ? ' اضافة' : 'Add'}
        </LoadingButton>
        <Button variant='tonal' color='secondary' onClick={close}>
          {locale === 'ar' ? 'الغاء' : 'Cancel'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
