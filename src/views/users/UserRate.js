/* eslint-disable react/prop-types */
import React from 'react'
import AppModal from 'src/components/AppModal'
import { serviceAuthManager } from 'src/util'
import LoadingContainer from 'src/components/LoadingContainer'
import { RDTable } from 'src/components/RDTable'
import { CButton, CCol, CRow } from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilTrash } from '@coreui/icons'
import { toastMessage } from 'src/helper/util'

const UserRate = ({ viewModalRate, setViewModalRate, id }) => {
  const [userRateData, setRateData] = React.useState([])
  const [loading, setLoading] = React.useState(true)
  const fetchStock = async () => {
    serviceAuthManager(`/user/rate/${id}?has_all_data=true`, 'get', {}, true)
      .then((res) => {
        if (res.data?.data) {
          console.log('User Rate: ', res.data?.data)
          const allUserRate = []
          res.data?.data?.result?.forEach((com) => {
            allUserRate.push({
              _id: com._id,
              comment: com.comment,
              rate: com.rate,
              created_at: com.created_at,
              updated_at_tz: com.updated_at_tz,
              user: com.user_detail,
            })
          })
          setRateData(allUserRate ?? [])
        }
      })
      .finally(() => {
        setLoading(false)
      })
  }

  React.useEffect(() => {
    fetchStock()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleRateDelete = (comid) => {
    toastMessage('error', 'Pending')

    // serviceAuthManager(`/post/comment/${id}/${comid}`, 'delete', {}, true)
    //   .then(() => {
    //     toastMessage('success', 'Deleted the comment successfully')
    //     fetchStock()
    //   })
    //   .catch((err) => {
    //     toastMessage(
    //       'error',
    //       err?.response?.data?.message || 'Error while deleting the particular comment',
    //     )
    //   })
  }

  const columns = [
    {
      name: 'User Details',
      selector: (row) => (
        <div className="d-flex">
          <span className="font-weight-bold">{row.user?.fullname || 'N/A'}</span>
        </div>
      ),
      grow: 2,
    },
    {
      name: 'Comment',
      selector: (row) => row.comment,
      grow: 2,
    },
    {
      name: 'Rate',
      selector: (row) => row.rate,
    },
    {
      name: 'Created At',
      selector: (row) => (row.created_at ? row.created_at : '-'),
    },
    {
      name: 'Updated At',
      selector: (row) => (row.updated_at_tz ? row.updated_at_tz : '-'),
    },
    {
      name: 'Activity',
      selector: (row) => (
        <CRow className="w-100 activity-tab-cell flex-wrap overflow-visible">
          <CCol>
            <CButton
              type="button"
              size="sm"
              color="danger"
              variant="outline"
              onClick={() => handleRateDelete(row._id)}
            >
              <CIcon icon={cilTrash} />
            </CButton>
          </CCol>
        </CRow>
      ),
    },
  ]

  return (
    <AppModal
      visible={viewModalRate}
      scrollable
      setVisible={setViewModalRate}
      title="User Rate"
      size="lg"
    >
      <LoadingContainer loading={loading}>
        <RDTable
          columns={columns}
          data={userRateData}
          headerTitle={'User Rate'}
          pagination
          striped
          keyField="_id"
        />
      </LoadingContainer>
    </AppModal>
  )
}

export default UserRate
