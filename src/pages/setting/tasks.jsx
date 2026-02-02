import { Avatar, Button, Card, CardContent, IconButton, Tooltip, Typography } from '@mui/material'
import { Box } from '@mui/system'
import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { useIntl } from 'react-intl'
import { axiosGet } from 'src/Components/axiosCall'
import PagnationTable from 'src/Components/TableEdit/PagnationTable'
import IconifyIcon from 'src/Components/icon'
import DeletePopUp from 'src/Components/DeletePopUp'
import CreateTask from 'src/Components/CreateTask'

function Tasks() {
  const { messages, locale } = useIntl()

  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 })
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState([])
  const [totalRows, setTotalRows] = useState(0)
  const [refresh, setRefresh] = useState(0)
  const [open, setOpen] = useState(false)
  const [currentTask, setCurrentTask] = useState(null)
  const [deleteTaskId, setDeleteTaskId] = useState(null)
  const [loadingDelete, setLoadingDelete] = useState(false)

  const [roleNameMap, setRoleNameMap] = useState({})

  const fetchRoleNameById = async roleId => {
    if (!roleId) 
      
      return

    if (roleNameMap[roleId] || !roleId.includes('-')) 
      
      return

    try {
      const res = await axiosGet(`Role/GetRoleName/${roleId}`, locale)
      const roleName = res?.result

      if (roleName) {
        setRoleNameMap(prev => ({
          ...prev,
          [roleId]: roleName
        }))
      }
    } catch (err) {
      console.error('Failed to fetch role name', err)
    }
  }

  useEffect(() => {
    setLoading(true)
    const loadingToast = toast.loading(messages.userPage.loading)

    fetch(`${process.env.API_BASE_URL}/task-type-lookup/get`, {
      method: 'POST',
      headers: {
        'Accept-Language': locale,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        pageNumber: 0,
        pageSize: 0
      })
    })
      .then(res => res.json())
      .then(res => {
        if (res.isSuccess) {
          const list = res.data?.taskTypeLookups ?? []

          setData(list)
          setTotalRows(list.length)

          list.forEach(task => {
            fetchRoleNameById(task.role)
          })
        } else {
          setData([])
          setTotalRows(0)
        }
      })
      .catch(err => {
        console.error(err)
        setData([])
        setTotalRows(0)
      })
      .finally(() => {
        setLoading(false)
        toast.dismiss(loadingToast)
      })
  }, [locale, refresh])

  const columns = [
    {
      field: 'index',
      headerName: '#',
      minWidth: 60,
      renderCell: ({ row }) => row.index + 1
    },
    {
      field: 'name',
      headerName: messages.taskPage.taskName,
      flex: 1,
      renderCell: ({ row }) => (
        <Typography sx={{ fontWeight: 500 }}>{row.name}</Typography>
      )
    },
    {
      field: 'role',
      headerName: messages.rolePage.role,
      flex: 1,
      renderCell: ({ row }) => (
        <Typography sx={{ fontWeight: 500 }}>
          {roleNameMap[row.role] || row.role || '—'}
        </Typography>
      )
    },
    {
      field: 'createdAt',
      headerName: messages.userPage.createdAt,
      minWidth: 180,
      renderCell: ({ row }) => (
        <Typography variant="subtitle2">
          {new Date(row.createdAt).toLocaleString(locale)}
        </Typography>
      )
    },
    {
      flex: 0.1,
      minWidth: 120,
      field: 'action',
      sortable: false,
      headerName: messages.actions,
      renderCell: params => (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Tooltip title={messages.edit}>
            <IconButton
              size="small"
              onClick={() => {
                setCurrentTask(params.row)
                setOpen(true)
              }}
            >
              <IconifyIcon icon="lsicon:setting-filled" />
            </IconButton>
          </Tooltip>
          <Tooltip title={messages.delete}>
            <IconButton
              size="small"
              color="error"
              onClick={() => setDeleteTaskId(params.row.id)}
            >
              <IconifyIcon icon="tabler:trash" />
            </IconButton>
          </Tooltip>
        </Box>
      )
    }
  ]

  /* Client-side pagination */
  const pagedData = data.slice(
    paginationModel.page * paginationModel.pageSize,
    paginationModel.page * paginationModel.pageSize + paginationModel.pageSize
  )

  return (
    <div>
      <CreateTask
        open={open}
        handleClose={() => {
          setOpen(false)
          setCurrentTask(null)
        }}
        setReRender={setRefresh}
        data={currentTask}
      />

      <Card className="mb-5 py-4">
        <CardContent sx={{ py: '0 !important' }}>
          <div className="flex gap-2 items-center">
            <Typography variant="h5" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
              {messages.taskPage.tasks}
            </Typography>
            <Avatar sx={{ width: 30, height: 30 }}>{totalRows}</Avatar>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end mb-5">
        <Button
          variant="contained"
          color="success"
          onClick={() => {
            setCurrentTask(null)
            setOpen(true)
          }}
        >
          {messages.create}
        </Button>
      </div>

      <Box sx={{ mb: 4 }}>
        <Card sx={{ py: '3.5rem' }}>
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
        </Card>
      </Box>

      <DeletePopUp
        open={Boolean(deleteTaskId)}
        setOpen={() => setDeleteTaskId(null)}
        loadingButton={loadingDelete}
        handleDelete={async () => {
          setLoadingDelete(true)
          try {
            const res = await fetch(
              `${process.env.API_BASE_URL}/task-type-lookup/delete/${deleteTaskId}`,
              {
                method: 'DELETE',
                headers: {
                  'Accept-Language': locale
                }
              }
            )

            const result = await res.json()

            if (result.isSuccess) {
              toast.success(messages.deletedSuccessfully)
              setRefresh(prev => prev + 1)
            }
          } catch (err) {
            console.error(err)
          } finally {
            setLoadingDelete(false)
            setDeleteTaskId(null)
          }
        }}
      />
    </div>
  )
}

export default Tasks
