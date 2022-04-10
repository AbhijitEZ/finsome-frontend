import React, { lazy } from 'react'
import LoadingContainer from 'src/components/LoadingContainer.js'
import { serviceAuthManager } from 'src/util.js'
const WidgetsDropdown = lazy(() => import('../widgets/WidgetsDropdown.js'))

const Dashboard = () => {
  const [loading, setLoading] = React.useState(true)
  const [dashData, setDashData] = React.useState({})

  const fetchDashData = async () => {
    serviceAuthManager('/dashboard')
      .then((res) => {
        if (res.data?.data) {
          setDashData(res.data?.data)
        }
      })
      .finally(() => {
        setLoading(false)
      })
  }

  React.useEffect(() => {
    fetchDashData()
  }, [])

  return (
    <LoadingContainer loading={loading}>
      <WidgetsDropdown dashData={dashData} />
    </LoadingContainer>
  )
}

export default Dashboard
