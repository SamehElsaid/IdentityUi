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
import ImageLoad from 'src/Components/ImageLoad'
import { Icon } from '@iconify/react'
import CreateRole from 'src/Components/CrateRole'
import AssignUsers from 'src/Components/AssignUsers'
import DeletePopUp from 'src/Components/DeletePopUp';

function Roles() {
  const { messages, locale } = useIntl()
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 })
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState([])
  const [totalRows, setTotalRows] = useState(0)
  const [startSearch, setStartSearch] = useState(false)
  const [refresh, setRefresh] = useState(0)
  const [activeOpen, setActiveOpen] = useState(false)
  const [blockOpen, setBlockOpen] = useState(false)

  const searchData = useRef({
    search: '',
    id: '',
    email: '',
    kind: ''
  })

  const [deleteRoleId, setDeleteRoleId] = useState(null);
  const [loadingDelete, setLoadingDelete] = useState(false);

  useEffect(() => {
    setLoading(true)
    const loadingToast = toast.loading(messages.userPage.loading)

    axiosGet(`Role/GetRolesWithAssignedUsers/?pageNo=${paginationModel.page + 1}&pageSize${paginationModel.pageSize}`, locale)
      .then(res => {
        console.log(res)
        if (res.status) {
          setData(res.result.roles)
          setTotalRows(res.result.totalRecords)
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
      flex: 0.9,
      minWidth: 300,
      field: 'name.name',
      disableColumnMenu: true,
      headerName: messages.rolePage.name,
      renderCell: ({ row }) => {
        return (
          <div className='flex gap-2 items-center'>
            <div className=''>
              <Typography variant='subtitle2' className='capitalize' sx={{ fontWeight: 500, color: 'text.secondary' }}>
                {row.name}
              </Typography>
            </div>
          </div>
        )
      }
    },
    {
      flex: 0.05,
      minWidth: 150,
      field: 'assignToUsers',
      disableColumnMenu: true,

      headerName: messages.rolePage.assignToUsers,
      renderCell: ({ row }) => (
        <Typography
          variant='subtitle2'
          className='flex gap-2 items-center w-full justify-center'
          sx={{ fontWeight: 500, color: 'text.secondary' }}
        >
          {/* {`${row.assignToUsers}`}   */}
          <Button
            disabled={!row.isActive}
            variant='contained'
            size='small'
            color='success'
            onClick={() => {
              setAssignOpen(row)
            }}
          >
            <IconifyIcon icon='mdi:plus' />
            {messages.add}
          </Button>
        </Typography>
      )
    },

    {
      flex: 0.3,
      minWidth: 200,
      field: 'assignedUsers',
      disableColumnMenu: true,
      headerName: messages.rolePage.assignedUsers,
      renderCell: ({ row }) => {
        const maxVisible = 5;
        const users = row.assignedUsers || [];

        return (
          <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 0.5 }}>
            {users.slice(0, maxVisible).map((user, idx) => (
              <Chip
                key={idx}
                size='small'
                label={user}
                sx={{ fontSize: '0.75rem', height: 24 }}
              />
            ))}
            {users.length > maxVisible && (
              <Tooltip title={users.join(', ')}>
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
      minWidth: 150,
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
      flex: 0.1,
      minWidth: 120,
      field: 'action',
      sortable: false,
      headerName: messages.actions,
      renderCell: params => (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Tooltip title={!params.row.isActive ? messages.rolePage.activeRole : messages.rolePage.inactiveRole}>
            <IconButton
              size='small'
              color={!params.row.isActive ? 'success' : 'warning'}
              onClick={() => {
                setActiveOpen(params.row.id)
                if (activeOpen !== params.row.id) {
                  toast.info(
                    !params.row.isActive
                      ? messages.rolePage.areYouSureActiveRole
                      : messages.rolePage.areYouSureInactiveRole,
                    {
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
                        axiosPost(`Role/UpdateRoleStatus`, 'en', {
                          roleId: params.row.id,
                          isActive: !params.row.isActive
                        })
                          .then(res => {
                            console.log(res)
                            if (res.status) {
                              toast.success(messages.rolePage.updateRoleSuccess)
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
                    }
                  )
                }
              }}
            >
              <IconifyIcon icon={params.row.isActive ? 'heroicons:lock-open' : 'heroicons:lock-closed'} />
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
              <IconifyIcon icon='lsicon:setting-filled' />
            </IconButton>
          </Tooltip>
          <Tooltip title={messages.delete}>
            <IconButton
              size='small'
              color='error'
              onClick={() => setDeleteRoleId(params.row.id)}
            >
              <IconifyIcon icon='tabler:trash' />
            </IconButton>
          </Tooltip>
        </Box>
      )
    }
  ]

  const [open, setOpen] = useState(false)
  const [assignOpen, setAssignOpen] = useState(false)

  const handleAssignClose = () => {
    setAssignOpen(false)
  }

  const handleClose = () => {
    setOpen(false)
  }

  return (
    <div>
      <CreateRole handleClose={handleClose} open={open} setReRender={setRefresh} />
      <AssignUsers handleClose={handleAssignClose} setOpen={setAssignOpen} setRefresh={setRefresh} open={assignOpen} />
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
              {messages.rolePage.roles}
            </Typography>
            <Avatar skin='light' sx={{ width: 30, height: 30 }}>
              {totalRows}
            </Avatar>
          </div>
        </CardContent>
      </Card>
      <div className='flex justify-end mb-5'>
        <Button variant='contained' color='success' onClick={() => setOpen(true)}>
          {messages.create}
        </Button>
      </div>
      <Box sx={{ mb: 4 }}>
        <Card className='flex gap-3 flex-wrap md:px-[36px] px-0' sx={{ mb: 6, width: '100%', py: '3.5rem' }}>
          <div className='w-full'>
            {/* <form
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
                  type='email'
                  label={messages.email}
                  defaultValue={searchData.current.email}
                  onInput={e => {
                    searchData.current.email = e.target.value
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
            </form> */}

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
      <DeletePopUp
        open={Boolean(deleteRoleId)}
        setOpen={() => setDeleteRoleId(null)}
        loadingButton={loadingDelete}
        handleDelete={async () => {
          setLoadingDelete(true);
          try {
            const res = await axiosGet(`Role/DeleteRole?id=${deleteRoleId}`, 'en');
            if (res.status) {
              toast.success(messages.deletedSuccessfully);
              setRefresh(prev => prev + 1);
            }
          } catch (err) {
            console.error(err);
          } finally {
            setLoadingDelete(false);
            setDeleteRoleId(null);
          }
        }}
      />
    </div>
  )
}

export default Roles
