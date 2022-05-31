/* eslint-disable react/prop-types */
import React from 'react'
import AppModal from 'src/components/AppModal'
import { serviceAuthManager } from 'src/util'
import LoadingContainer from 'src/components/LoadingContainer'

const CommentsListing = ({ viewModalComment, setViewModalComment, id }) => {
  const [commentData, setCommentsData] = React.useState([])
  const [loading, setLoading] = React.useState(true)

  const fetchStock = async () => {
    serviceAuthManager('/post/comment?has_all_data=true&id=' + id, 'get', {}, true)
      .then((res) => {
        if (res.data?.data) {
          setCommentsData(res.data?.data?.result ?? [])
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

  return (
    <AppModal
      visible={viewModalComment}
      scrollable
      setVisible={setViewModalComment}
      title="Comments"
    >
      <LoadingContainer loading={loading}>
        <pre>{JSON.stringify(commentData, null, 2)}</pre>
      </LoadingContainer>
    </AppModal>
  )
}

export default CommentsListing
