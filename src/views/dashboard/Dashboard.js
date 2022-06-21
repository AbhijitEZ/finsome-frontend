import React, { lazy } from 'react'
import { useHistory } from 'react-router-dom'
import LoadingContainer from 'src/components/LoadingContainer.js'
import { serviceAuthManager } from 'src/util.js'
const WidgetsDropdown = lazy(() => import('../widgets/WidgetsDropdown.js'))

const Dashboard = () => {
  const [loading, setLoading] = React.useState(true)
  const [dashData, setDashData] = React.useState({})
  const history = useHistory()

  const fetchDashData = async () => {
    serviceAuthManager('/dashboard')
      .then((res) => {
        if (res.data?.data) {
          setDashData(res.data?.data)
        }
      })
      .catch((error) => {
        if (error?.response?.status === 401) {
          localStorage.removeItem('id_token')
          history.replace('/login')
        }
      })
      .finally(() => {
        setLoading(false)
      })
  }

  React.useEffect(() => {
    fetchDashData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <LoadingContainer loading={loading}>
      <WidgetsDropdown dashData={dashData} />
    </LoadingContainer>
  )
}

export default Dashboard
