import { Avatar, Button, Card, CardContent, Chip, Typography } from '@mui/material'
import { Box } from '@mui/system'
import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { axiosPost } from 'src/Components/axiosCall'
import { useIntl } from 'react-intl'
import PagnationTable from 'src/Components/TableEdit/PagnationTable'
import GetTimeinTable from 'src/Components/GetTimeinTable'
import CreateTask from 'src/Components/CreateTask'

function Tasks() {
  const { messages, locale } = useIntl()

  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 })
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState([])
  const [totalRows, setTotalRows] = useState(0)
  const [refresh, setRefresh] = useState(0)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    setLoading(true)
    const loadingToast = toast.loading(messages.userPage.loading)

    fetch(`${process.env.API_BASE_URL}/task-type-lookup/get`, {
      method: 'POST',
      headers: {
        'Accept-Language': locale,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({})
    })
      .then(res => res.json())
      .then(res => {
        if (res.isSuccess) {
          setData(res.data?.taskTypeLookups ?? [])
          setTotalRows(res.data?.totalCount ?? res.data?.taskTypeLookups?.length ?? 0)
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
      flex: 0.05,
      minWidth: 60,
      field: 'index',
      headerName: '#',
      renderCell: ({ row }) => row.index + 1
    },
    {
      flex: 0.4,
      minWidth: 200,
      field: 'name',
      headerName: messages.taskPage.taskName,
      renderCell: ({ row }) => (
        <Typography sx={{ fontWeight: 500 }}>
          {row.name}
        </Typography>
      )
    },
    {
      flex: 0.4,
      minWidth: 250,
      field: 'role',
      headerName: messages.rolePage.role,
      renderCell: ({ row }) => (
        <Typography sx={{ fontWeight: 500 }}>
          {row.role}
        </Typography>
      )
    },
    {
      flex: 0.2,
      minWidth: 180,
      field: 'createdAt',
      headerName: messages.userPage.createdAt,
      renderCell: ({ row }) => (
        <Typography variant="subtitle2">
          {new Date(row.createdAt).toLocaleString(locale)}
        </Typography>
      )
    }
  ]

  return (
    <div>
      <CreateTask open={open} handleClose={() => setOpen(false)} setReRender={setRefresh} />

      <Card className='mb-5 py-4'>
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
              {messages.taskPage.tasks}
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
            <PagnationTable
              Invitationscolumns={columns}
              data={data.map((ele, i) => ({
                id: ele.id,
                index: i + paginationModel.page * paginationModel.pageSize,
                name: ele.name,
                role: ele.role ?? '-',
                createdAt: ele.createdAt
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
    </div>
  )
}

export default Tasks
