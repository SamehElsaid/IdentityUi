import {
  Avatar,
  Button,
  Card,
  CardContent,
  Chip,
  IconButton,
  InputAdornment,
  MenuItem,
  Tooltip,
  Typography
} from '@mui/material'
import { Box } from '@mui/system'
import { useEffect, useRef, useState } from 'react'
import { toast } from 'react-toastify'
import { axiosGet, axiosPost } from 'src/Components/axiosCall'
import CustomTextField from 'src/@core/components/mui/text-field'
import { useIntl } from 'react-intl'
import { LoadingButton } from '@mui/lab'
import PagnationTable from 'src/Components/TableEdit/PagnationTable'
import IconifyIcon from 'src/Components/icon'
import { Icon } from '@iconify/react'
import GetTimeinTable from 'src/Components/GetTimeinTable'
import CreateClient from 'src/Components/CreateClient'

function Clients() {
  const { messages, locale } = useIntl()
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 })
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState([])
  const [totalRows, setTotalRows] = useState(0)
  const [startSearch, setStartSearch] = useState(false)
  const [refresh, setRefresh] = useState(0)
  const [activeOpen, setActiveOpen] = useState(false)
  const [open, setOpen] = useState(false)

  const searchData = useRef({
    search: '',
    id: '',
    clientId: '',
    kind: ''
  })

  useEffect(() => {
    setLoading(true)
    const loadingToast = toast.loading(messages.userPage.loading)

    const body = {
      pageNo: paginationModel.page + 1,
      pageSize: paginationModel.pageSize
    }
    if (searchData.current.search) {
      body.displayName = searchData.current.search
    }
    if (searchData.current.id) {
      body.id = searchData.current.id
    }
    if (searchData.current.kind) {
      body.isActive = searchData.current.kind === 'active' ? true : false
    }
    if (searchData.current.clientId) {
      body.clientId = searchData.current.clientId
    }
    axiosPost(`Client/ClientsWithAssignedRolesList`, locale, body)
      .then(res => {
        console.log(res)
        if (res.status) {
          setData(res.result.clients)
          setTotalRows(res.result.totalRecords)
        }
        else {
          setData([])
          setTotalRows(0)
        }
      })
      .finally(() => {
        setLoading(false)
        toast.dismiss(loadingToast)
      })
  }, [locale, paginationModel.page, paginationModel.pageSize, startSearch, refresh])

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
      flex: 0.1,
      minWidth: 100,
      field: 'action',
      sortable: false,
      headerName: messages.actions,
      renderCell: params => (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Tooltip title={!params.row.isActive ? messages.activeUser : messages.inactiveUser}>
            <IconButton
              size='small'
              color={!params.row.isActive ? 'success' : 'warning'}
              onClick={() => {
                setActiveOpen(params.row.id)
                if (activeOpen !== params.row.id) {
                  toast.info(!params.row.isActive ? messages.areYouSureActive : messages.areYouSureInactive, {
                    position: locale === 'ar' ? 'bottom-left' : 'bottom-right',
                    autoClose: 4000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: 'colored',
                    icon: <Icon icon='tabler:trash' />,
                    iconColor: 'red',
                    iconSize: 20,
                    iconPosition: 'left',
                    onClick: () => {
                      const loadingToast = toast.loading(
                        !params.row.isActive ? messages.activeUser + '...' : messages.inactiveUser + '...'
                      )
                      axiosGet(
                        `Client/${params.row.isActive ? 'DactivateClient' : 'ActivateClient'}/?clientId=${
                          params.row.id
                        }`,
                        'en'
                      )
                        .then(res => {
                          if (res.status) {
                            toast.success(
                              !params.row.isActive ? messages.activeClientSuccess : messages.inactiveClientSuccess
                            )
                            setData(
                              data.map(item =>
                                item.id === params.row.id ? { ...item, isActive: !params.row.isActive } : item
                              )
                            )
                          }
                        })
                        .finally(() => {
                          toast.dismiss(loadingToast)
                          setActiveOpen(false)
                        })
                    },
                    onClose: () => {
                      setActiveOpen(false)
                    }
                  })
                }
              }}
            >
              <IconifyIcon icon='ant-design:user-switch-outlined' />
            </IconButton>
          </Tooltip>
          <Tooltip title={messages.edit}>
            <IconButton
              size='small'
              color='default'
              onClick={() => {
                setOpen(params.row)
              }}
            >
              <IconifyIcon icon='ant-design:edit-outlined' />
            </IconButton>
          </Tooltip>
        </Box>
      )
    },
    {
      flex: 0.2,
      minWidth: 100,
      field: 'isActive',
      disableColumnMenu: true,
      headerName: messages.userPage.status,
      renderCell: ({ row }) => {
        const color = ['error', 'success']
        const type = [false, true]

        return (
          <Typography variant='subtitle2' className='capitalize' sx={{ fontWeight: 500, color: 'text.secondary' }}>
            <Chip
              variant='outlined'
              size='small'
              label={
                type.includes(row.isActive)
                  ? type[type.indexOf(row.isActive)]
                    ? messages.active
                    : messages.inactive
                  : ''
              }
              color={color[type.indexOf(row.isActive)]}
            />
          </Typography>
        )
      }
    },
    {
      flex: 0.9,
      minWidth: 300,
      field: 'name.firstName',
      disableColumnMenu: true,
      headerName: messages.clientPage.clientInfo,
      renderCell: ({ row }) => {
        return (
          <div className='flex gap-2 items-center'>
            <div className=''>
              <Typography variant='subtitle2' className='capitalize' sx={{ fontWeight: 500, color: 'text.secondary' }}>
                {row.displayName}
              </Typography>
              <Typography variant='subtitle2' className='capitalize' sx={{ fontWeight: 500, color: 'text.secondary' }}>
                {row.consentType}
              </Typography>

              <Typography variant='subtitle2' sx={{ fontWeight: 500, color: 'text.secondary' }}>
                #{row.id}
              </Typography>
            </div>
          </div>
        )
      }
    },

    {
      flex: 0.2,
      minWidth: 300,
      field: 'clientId',
      disableColumnMenu: true,
      headerName: messages.clientPage.clientId,
      renderCell: ({ row }) => {
        return (
          <Typography variant='subtitle2' sx={{ fontWeight: 500 }}>
            {row.clientId}
          </Typography>
        )
      }
    },

    {
      flex: 0.3,
      minWidth: 200,
      field: 'assignedRoles',
      disableColumnMenu: true,
      headerName: messages.clientPage.assignedRoles,
      renderCell: ({ row }) => {
        const maxVisible = 5
        const users = row.assignedRoles || []

        return (
          <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 0.5 }}>
            {users.slice(0, maxVisible).map((user, idx) => (
              <Chip
                key={user.id || idx}
                size='small'
                label={user.name}
                sx={{ fontSize: '0.75rem', height: 24 }}
              />
            ))}
            {users.length > maxVisible && (
              <Tooltip
                title={users
                  .slice(maxVisible)
                  .map(u => u.name)
                  .join(', ')}
              >
                <Chip
                  size='small'
                  label={`+${users.length - maxVisible} more`}
                  sx={{ fontSize: '0.75rem', height: 24, cursor: 'pointer' }}
                />
              </Tooltip>
            )}
          </Box>
        )
      }
    },

    {
      flex: 0.2,
      minWidth: 300,
      field: 'clientSecret',
      disableColumnMenu: true,
      headerName: messages.clientPage.clientSecret,
      renderCell: ({ row }) => {
        return (
          <Typography
            variant='subtitle2'
            sx={{ fontWeight: 500 }}
            className='full break-words whitespace-normal w-full'
          >
            {row.clientSecret}
          </Typography>
        )
      }
    },
    {
      flex: 0.2,
      minWidth: 300,
      field: 'createdById',
      disableColumnMenu: true,
      headerName: messages.clientPage.createdById,
      renderCell: ({ row }) => {
        return (
          <Typography
            variant='subtitle2'
            sx={{ fontWeight: 500 }}
            className='full break-words whitespace-normal w-full'
          >
            #{row.createdById}
          </Typography>
        )
      }
    },
    {
      flex: 0.2,
      minWidth: 300,
      field: 'postLogoutRedirectUris',
      disableColumnMenu: true,
      headerName: messages.clientPage.postLogoutRedirectUris,
      renderCell: ({ row }) => {
        const urls = row.postLogoutRedirectUris

        return (
          <Typography
            component='a'
            href={urls}
            target='_blank'
            variant='subtitle2'
            className='!text-blue-500 underline'
            sx={{ fontWeight: 500 }}
          >
            {urls}
          </Typography>
        )
      }
    },
    {
      flex: 0.2,
      minWidth: 300,
      field: 'redirectUris',
      disableColumnMenu: true,
      headerName: messages.clientPage.redirectUris,
      renderCell: ({ row }) => {
        const urls = row.redirectUris

        return (
          <Typography
            component='a'
            href={urls}
            target='_blank'
            variant='subtitle2'
            className='!text-blue-500 underline'
            sx={{ fontWeight: 500 }}
          >
            {urls}
          </Typography>
        )
      }
    },

    {
      flex: 0.2,
      minWidth: 150,
      field: 'createdAt',
      disableColumnMenu: true,
      headerName: messages.userPage.createdAt,
      renderCell: ({ row }) => {
        return (
          <Typography variant='subtitle2' className='capitalize' sx={{ fontWeight: 500, color: 'text.secondary' }}>
            <GetTimeinTable data={row.createdAt} />
          </Typography>
        )
      }
    }
  ]

  const formRef = useRef(null)
  const [_, setReRender] = useState(0)

  const handleClose = () => {
    setOpen(false)
  }

  return (
    <div>
      <CreateClient handleClose={handleClose} open={open} setReRender={setRefresh} />
      <Card className='w-[100%]  mb-5 py-4 '>
        <CardContent
          className='h-full flex flex-col sm:flex-row justify-between items-center gap-4'
          sx={{
            display: 'flex',
            textAlign: 'center',
            alignItems: 'center',
            justifyContent: 'space-between',
            py: '0 !important'
          }}
        >
          <div className='flex gap-2 justify-center items-center '>
            <Typography variant='h5' sx={{ color: 'primary.main', fontWeight: 'bold' }}>
              {messages.clientPage.Clients}
            </Typography>
            <Avatar skin='light' sx={{ width: 30, height: 30 }}>
              {totalRows}
            </Avatar>
          </div>
        </CardContent>
      </Card>{' '}
      <div className='flex justify-end mb-5'>
        <Button variant='contained' color='success' onClick={() => setOpen(true)}>
          {messages.create}
        </Button>
      </div>
      <Box sx={{ mb: 4 }}>
        <Card className='flex gap-3 flex-wrap md:px-[36px] px-0' sx={{ mb: 6, width: '100%', py: '3.5rem' }}>
          <div className='w-full'>
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
              className='px-5 ~~ mb-5 ||'
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
                  label={messages.clientPage.clientId}
                  defaultValue={searchData.current.clientId}
                  onInput={e => {
                    searchData.current.clientId = e.target.value
                  }}
                />
              </div>
              <div className='flex md:flex-row flex-col w-full gap-5 mt-5 '>
                {' '}
                <CustomTextField
                  select
                  label={messages.userPage.status}
                  fullWidth
                  className='capitalize'
                  value={searchData.current.kind ? searchData.current.kind : 'all'}
                  onChange={e => {
                    searchData.current.kind = e.target.value === 'all' ? '' : e.target.value
                    setReRender(prev => prev + 1)
                  }}
                >
                  <MenuItem value='all' checked selected>
                    {messages.all}
                  </MenuItem>
                  <MenuItem value='active'>{messages.active}</MenuItem>
                  <MenuItem value='inactive'>{messages.inactive}</MenuItem>
                </CustomTextField>
                <div className=' md:flex hidden w-full '></div>
                <div className='md:flex hidden  w-full'></div>
              </div>

              <div className='flex gap-2 justify-end mt-5'>
                <LoadingButton loading={loading} variant='contained' type='submit' name='search' color='success'>
                  {messages.filter}
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
                    {messages.clearFilter}
                  </LoadingButton>
                )}
              </div>
            </form>

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
        </Card>
      </Box>
    </div>
  )
}

export default Clients
