import { Avatar, Button, Card, CardContent, Chip, IconButton, InputAdornment, MenuItem, Tooltip, Typography
} from '@mui/material'
import { Box } from '@mui/system'
import { useEffect, useRef, useState } from 'react'
import { toast } from 'react-toastify'
import { axiosGet, axiosPost } from 'src/Components/axiosCall'
import { useIntl } from 'react-intl'
import PagnationTable from 'src/Components/TableEdit/PagnationTable'
import IconifyIcon from 'src/Components/icon'
import CreateRole from 'src/Components/CrateRole'
import AssignUsers from 'src/Components/AssignUsers'
import DeletePopUp from 'src/Components/DeletePopUp';
import ConfirmRoleStatusPopup from 'src/Components/ConfirmRoleStatusPopup';

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

  const [roleStatusOpen, setRoleStatusOpen] = useState(false);
  const [currentRole, setCurrentRole] = useState({ id: null, isActive: false });
  const [loadingRoleStatus, setLoadingRoleStatus] = useState(false);

  const [deleteRoleId, setDeleteRoleId] = useState(null);
  const [loadingDelete, setLoadingDelete] = useState(false);

  useEffect(() => {
    setLoading(true)
    const loadingToast = toast.loading(messages.userPage.loading)

    axiosGet(
      `Role/GetRolesWithAssignedUsers`, locale)
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
  }, [locale, refresh])

  /* CLIENT-SIDE PAGINATION */
  const pagedData = data.slice(
    paginationModel.page * paginationModel.pageSize,
    paginationModel.page * paginationModel.pageSize + paginationModel.pageSize
  )

  const handleRoleStatusConfirm = async (roleId, newStatus) => {
    setLoadingRoleStatus(true)
    try {
      const res = await axiosPost('Role/UpdateRoleStatus', 'en', {
        roleId,
        isActive: newStatus
      })
      if (res.status) {
        toast.success(messages.rolePage.updateRoleSuccess)
        setData(
          data.map(item => (item.id === roleId ? { ...item, isActive: newStatus } : item))
        )
      }
    } catch (err) {
      console.error(err)
    } finally {
      setLoadingRoleStatus(false)
      setRoleStatusOpen(false)
    }
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
        const maxVisible = 3;
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
              <Tooltip title={users.slice(maxVisible).join(', ')}>
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
                setCurrentRole({ id: params.row.id, isActive: params.row.isActive })
                setRoleStatusOpen(true)
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
      <AssignUsers handleClose={handleAssignClose} setOpen={setAssignOpen} open={assignOpen} />

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
            <PagnationTable
              Invitationscolumns={columns}
              data={pagedData.map((row, i) => ({
                ...row,
                index: i + paginationModel.page * paginationModel.pageSize
              }))}
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

      <ConfirmRoleStatusPopup
        open={roleStatusOpen}
        onClose={() => setRoleStatusOpen(false)}
        roleId={currentRole.id}
        isActive={currentRole.isActive}
        handleConfirm={handleRoleStatusConfirm}
        loading={loadingRoleStatus}
      />
    </div>
  )
}

export default Roles
