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

const CommentsListing = ({ viewModalComment, setViewModalComment, id }) => {
  const [commentData, setCommentsData] = React.useState([])
  const [loading, setLoading] = React.useState(true)

  const fetchStock = async () => {
    serviceAuthManager('/post/comment?has_all_data=true&id=' + id, 'get', {}, true)
      .then((res) => {
        if (res.data?.data) {
          console.log('COMMENTS: ', res.data?.data)
          const allComments = []
          res.data?.data?.result?.forEach((com) => {
            allComments.push({
              _id: com._id,
              parent_id: com.parent_id,
              message: com.message,
              created_at: com.created_at,
              created_at_tz: com.created_at_tz,
              user: com.user,
            })

            if (com.reply.length) {
              com.reply.forEach((reply) => {
                allComments.push({
                  _id: reply._id,
                  parent_id: com._id,
                  message: reply.message,
                  created_at: reply.created_at,
                  created_at_tz: reply.created_at_tz,
                  user: reply.reply_user,
                })
              })
            }
          })
          setCommentsData(allComments ?? [])
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

  const handleCommentDelete = (comid) => {
    serviceAuthManager(`/post/comment/${id}/${comid}`, 'delete', {}, true)
      .then(() => {
        toastMessage('success', 'Deleted the comment successfully')
        fetchStock()
      })
      .catch((err) => {
        toastMessage(
          'error',
          err?.response?.data?.message || 'Error while deleting the particular comment',
        )
      })
  }

  const columns = [
    {
      name: 'User Details',
      selector: (row) => (
        <div className="d-flex">
          <span className="font-weight-bold">{row.user?.fullname || 'N/A'}</span>
        </div>
      ),
    },
    {
      name: 'Message',
      selector: (row) => row.message,
      grow: 2,
    },
    {
      name: 'Is reply',
      selector: (row) => (row.parent_id ? 'yes' : 'no'),
    },
    {
      name: 'Created At',
      selector: (row) => (row.created_at_tz ? row.created_at_tz : '-'),
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
              onClick={() => handleCommentDelete(row._id)}
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
      visible={viewModalComment}
      scrollable
      setVisible={setViewModalComment}
      title="Comments"
      size="lg"
    >
      <LoadingContainer loading={loading}>
        <RDTable
          columns={columns}
          data={commentData}
          headerTitle={'Comments'}
          pagination
          striped
          keyField="_id"
        />
      </LoadingContainer>
    </AppModal>
  )
}

export default CommentsListing
