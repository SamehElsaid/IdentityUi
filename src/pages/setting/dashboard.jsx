import Grid from '@mui/material/Grid'
import CardStatsVertical from 'src/@core/components/card-statistics/card-stats-vertical'
import EcommerceStatistics from 'src/@core/components/EcommerceStatistics'
import ApexChartWrapper from 'src/@core/styles/libs/react-apexcharts'
import ApexDonutChart from 'src/Components/dashboard/ApexDonutChart'
import ApexLineChart from 'src/Components/dashboard/ApexLineChart'
import ApexScatterChart from 'src/Components/dashboard/ApexScatterChart'
import CrmEarningReportsWithTabs from 'src/Components/dashboard/CrmEarningReportsWithTabs'
import CrmRevenueGrowth from 'src/Components/dashboard/CrmRevenueGrowth'
import CrmSalesWithAreaChart from 'src/Components/dashboard/CrmSalesWithAreaChart'
import CrmSalesWithRadarChart from 'src/Components/dashboard/CrmSalesWithRadarChart'
import CrmSessions from 'src/Components/dashboard/CrmSessions'

const Dashboard = () => {
  return (
    <ApexChartWrapper>
      <Grid container spacing={6}>
        <Grid item xs={6} sm={4} lg={2}>
          <CrmSalesWithAreaChart />
        </Grid>
        <Grid item xs={6} sm={4} lg={2}>
          <CrmSessions />
        </Grid>
        <Grid item xs={12} md={8}>
          <EcommerceStatistics />
        </Grid>
        <Grid item xs={6} sm={4} lg={2}>
          <CardStatsVertical
            stats='1.28k'
            chipText='-12.2%'
            chipColor='default'
            avatarColor='error'
            title='Total Profit'
            subtitle='Last week'
            avatarIcon='tabler:currency-dollar'
          />
        </Grid>
        <Grid item xs={6} sm={4} lg={2}>
          <CardStatsVertical
            stats='1.28k'
            chipText='-12.2%'
            chipColor='default'
            avatarColor='error'
            title='Total Profit'
            subtitle='Last week'
            avatarIcon='tabler:currency-dollar'
          />
        </Grid>
        <Grid item xs={6} sm={4} lg={2}>
          <CardStatsVertical
            stats='1.28k'
            chipText='-12.2%'
            chipColor='default'
            avatarColor='error'
            title='Total Profit'
            subtitle='Last week'
            avatarIcon='tabler:currency-dollar'
          />
        </Grid>
        <Grid item xs={6} sm={4} lg={2}>
          <CardStatsVertical
            stats='24.67k'
            chipText='+25.2%'
            avatarColor='info'
            chipColor='default'
            title='Total Sales'
            subtitle='Last week'
            avatarIcon='tabler:chart-bar'
          />
        </Grid>
        <Grid item xs={12} sm={8} lg={4}>
          <CrmRevenueGrowth />
        </Grid>
        <Grid item xs={12} lg={6}>
          <CrmEarningReportsWithTabs />
        </Grid>{' '}
        <Grid item xs={12} md={3}>
          <ApexDonutChart />
        </Grid>
        <Grid item xs={12} md={3} lg={3}>
          <CrmSalesWithRadarChart />
        </Grid>
        <Grid item xs={12} md={6}>
          <ApexScatterChart />
        </Grid>
        <Grid item xs={12} md={6}>
          <ApexLineChart />
        </Grid>
      </Grid>
    </ApexChartWrapper>
  )
}

export default Dashboard
