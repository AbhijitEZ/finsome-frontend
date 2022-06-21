import React from 'react'
import { CButton, CCol, CFormInput, CInputGroup, CRow } from '@coreui/react'
import { serviceAuthManager } from 'src/util'
import { RDTable } from 'src/components/RDTable'
import LoadingContainer from 'src/components/LoadingContainer'
import CIcon from '@coreui/icons-react'
import { cilNotes, cilSearch, cilTrash } from '@coreui/icons'
import { useFuzzyHandlerHook } from 'src/components/hook'
import debounce from 'lodash.debounce'
import isEmpty from 'lodash.isempty'
import { toastMessage } from 'src/helper/util'
import AppModal from 'src/components/AppModal'
import CommentsListing from './CommentsListing'

const Posts = () => {
  const [stockCrypto, setStockCrypto] = React.useState([])
  const [cryptoFilter, setFilteredCrypto] = React.useState([])
  const [loading, setLoading] = React.useState(true)
  const [currentSearchVal, setCurrentSearchVal] = React.useState('')
  const [viewModalCheck, setViewModalCheck] = React.useState(false)
  const [postDetail, setPostDetail] = React.useState({})
  const [viewModalComment, setViewModalComment] = React.useState(false)

  const { fuzzyHandler } = useFuzzyHandlerHook()

  const fetchStock = async () => {
    serviceAuthManager('/post/home?has_all_data=true', 'get', {}, true)
      .then((res) => {
        if (res.data?.data) {
          console.log(
            res.data?.data?.result.filter((data) => data.post_vids.length),
            'DATA',
          )
          setStockCrypto(res.data?.data?.result ?? [])
        }
      })
      .finally(() => {
        setLoading(false)
      })
  }

  React.useEffect(() => {
    fetchStock()
  }, [])

  React.useEffect(() => {
    if (stockCrypto.length) {
      handleSearchMechanism()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stockCrypto, currentSearchVal])

  const handleSearchMechanism = () => {
    if (!currentSearchVal) {
      setFilteredCrypto(stockCrypto)
      return
    }
    const searchData = fuzzyHandler(currentSearchVal, stockCrypto, [
      'caption',
      'stock_type',
      'user.fullname',
    ])

    const finalSearchFilterData = searchData.map((search) => ({ ...search.obj }))
    setFilteredCrypto(finalSearchFilterData)
  }

  const handleSearchOnFormInpChange = (evt) => {
    evt.preventDefault()
    setCurrentSearchVal(evt.target.value)
  }

  const triggerViewModal = (data) => {
    setPostDetail(data)
    setViewModalCheck(true)
  }
  const triggerCommentModal = () => {
    setViewModalCheck(false)
    setViewModalComment(true)
  }

  const handleDeletePost = (id) => {
    serviceAuthManager(`/post/delete/${id}`, 'delete', {}, true)
      .then(() => {
        toastMessage('success', 'Deleted the stock successfully')
        fetchStock()
      })
      .catch((err) => {
        toastMessage(
          'error',
          err?.response?.data?.message || 'Error while deleting the particular stock',
        )
      })
  }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debounceFn = React.useCallback(debounce(handleSearchOnFormInpChange, 1000), [])

  const handleSearchInpChange = (evt) => {
    evt.preventDefault()
    setCurrentSearchVal(evt.target.elements.searchInput.value)
  }

  const contactData = React.useMemo(
    () => (cryptoFilter.length || currentSearchVal ? cryptoFilter : stockCrypto),
    [cryptoFilter, stockCrypto, currentSearchVal],
  )

  const columns = [
    {
      name: 'Caption',
      selector: (row) => (
        <div className="addwrap-col">
          <span>{row.caption ?? '-'}</span>
        </div>
      ),
    },
    {
      name: 'User Name',
      selector: (row) => row.user?.fullname ?? '-',
      width: '175px',
    },
    {
      name: 'Analysis Type',
      selector: (row) => row.analysis_type ?? '-',
      width: '125px',
    },
    {
      name: 'Trade Type',
      selector: (row) => row.trade_type ?? '-',
      width: '125px',
    },
    {
      name: 'Stock Type',
      selector: (row) => row.stock_type ?? '-',
      width: '125px',
    },
    {
      name: 'No of Comments',
      selector: (row) => row.total_comments ?? '-',
      width: '175px',
    },
    {
      name: 'No of likes',
      selector: (row) => row.total_likes ?? '-',
      width: '125px',
    },
    {
      name: 'Activity',
      selector: (row) => (
        <CRow className="w-100 activity-tab-cell flex-wrap overflow-visible">
          <CCol xs={3}>
            <CButton
              type="button"
              size="sm"
              color="secondary"
              variant="outline"
              onClick={() => triggerViewModal(row)}
            >
              <CIcon icon={cilNotes} />
            </CButton>
          </CCol>
          <CCol xs={3}>
            <CButton
              type="button"
              size="sm"
              color="danger"
              variant="outline"
              onClick={() => handleDeletePost(row._id)}
            >
              <CIcon icon={cilTrash} />
            </CButton>
          </CCol>
        </CRow>
      ),
    },
  ]

  return (
    <LoadingContainer loading={loading}>
      <CRow>
        <CCol xs className="align-self-end">
          <form onSubmit={handleSearchInpChange} onChange={debounceFn}>
            <CInputGroup className="mb-3">
              <CFormInput
                placeholder="Search with name or caption or stock type"
                aria-label="Example text with button addon"
                aria-describedby="search-addon"
                name="searchInput"
              />
              <CButton type="submit" color="secondary" variant="outline" id="search-addon">
                <CIcon icon={cilSearch} />
              </CButton>
            </CInputGroup>
          </form>
        </CCol>
      </CRow>
      <CRow>
        <CCol xs={12}>
          <RDTable
            columns={columns}
            data={contactData}
            headerTitle={'Posts'}
            pagination
            striped
            keyField="_id"
          />
        </CCol>
      </CRow>

      {/* User Detail Modal */}
      <AppModal
        visible={viewModalCheck}
        scrollable
        setVisible={setViewModalCheck}
        title="Post Details"
        size={'lg'}
      >
        {!isEmpty(postDetail) ? (
          <form>
            <div className="row align-items-center mb-2">
              <div className="col-3 text-right">
                <label htmlFor="">Fullname</label>
              </div>
              <div className="col-8">
                <input
                  type="text"
                  className="form-control"
                  placeholder="-"
                  value={postDetail.user?.fullname ?? ''}
                  readOnly
                />
              </div>
            </div>
            <div className="row align-items-center mb-2">
              <div className="col-3 text-right">
                <label htmlFor="">Stock Type</label>
              </div>
              <div className="col-8">
                <input
                  type="text"
                  className="form-control"
                  placeholder="-"
                  value={postDetail?.stock_type ?? ''}
                  readOnly
                />
              </div>
            </div>
            <div className="row align-items-center mb-2">
              <div className="col-3 text-right">
                <label htmlFor="">Analysis Type</label>
              </div>
              <div className="col-8">
                <input
                  type="text"
                  className="form-control"
                  placeholder="-"
                  value={postDetail?.analysis_type ?? ''}
                  readOnly
                />
              </div>
            </div>
            <div className="row align-items-center mb-2">
              <div className="col-3 text-right">
                <label htmlFor="">Trade Type</label>
              </div>
              <div className="col-8">
                <input
                  type="text"
                  className="form-control"
                  placeholder="-"
                  value={postDetail?.trade_type ?? ''}
                  readOnly
                />
              </div>
            </div>
            <div className="row align-items-center mb-2">
              <div className="col-3 text-right">
                <label htmlFor="">Caption</label>
              </div>
              <div className="col-8">
                <textarea
                  className="form-control"
                  placeholder="-"
                  value={postDetail?.caption ?? ''}
                  style={{ minHeight: 150 }}
                  readOnly
                />
              </div>
            </div>
            <div className="row align-items-center mb-2">
              <div className="col-3 text-right">
                <label htmlFor="">Total Comments</label>
              </div>
              <div className="col-8">
                <input
                  type="text"
                  className="form-control"
                  placeholder="-"
                  value={postDetail?.total_comments ?? 0}
                  readOnly
                />
              </div>
            </div>
            <div className="row align-items-center mb-2">
              <div className="col-3 text-right">
                <label htmlFor="">Total Likes</label>
              </div>
              <div className="col-8">
                <input
                  type="text"
                  className="form-control"
                  placeholder="-"
                  value={postDetail?.total_likes ?? 0}
                  readOnly
                />
              </div>
            </div>
            <div className="row align-items-center mb-2">
              <div className="col-3 text-right">
                <label htmlFor="">Stock Recommended Type</label>
              </div>
              <div className="col-8">
                <input
                  type="text"
                  className="form-control"
                  placeholder="-"
                  value={postDetail?.stock_recommended_type ?? ''}
                  readOnly
                />
              </div>
            </div>
            <div className="row align-items-center mb-2">
              <div className="col-3 text-right">
                <label htmlFor="">Buy Recommend Amount</label>
              </div>
              <div className="col-8">
                <input
                  type="text"
                  className="form-control"
                  placeholder="-"
                  value={postDetail?.buy_recommend_amount ?? ''}
                  readOnly
                />
              </div>
            </div>

            <div className="row align-items-center mb-2">
              <div className="col-3 text-right">
                <label htmlFor="">Sell Recommend Amount</label>
              </div>
              <div className="col-8">
                <input
                  type="text"
                  className="form-control"
                  placeholder="-"
                  value={postDetail?.sell_recommend_amount ?? ''}
                  readOnly
                />
              </div>
            </div>
            <div className="row align-items-center mb-2">
              <div className="col-3 text-right">
                <label htmlFor="">Is Recommended</label>
              </div>
              <div className="col-8">
                <input
                  type="text"
                  className="form-control"
                  placeholder="-"
                  value={postDetail?.is_recommended ?? ''}
                  readOnly
                />
              </div>
            </div>
            <div className="row align-items-center mb-2">
              <div className="col-3 text-right">
                <label htmlFor="">Security Ids</label>
              </div>
              <div className="col-8">
                <textarea
                  type="text"
                  className="form-control"
                  placeholder="-"
                  value={postDetail?.security?.length ? JSON.stringify(postDetail?.security) : ''}
                  style={{ minHeight: 85 }}
                  readOnly
                />
              </div>
            </div>
            <hr />
            <div className="row align-items-center mb-2">
              <div className="col-3 text-right">
                <label htmlFor="">PostImages</label>
              </div>
              <div className="col-8">
                <ul className="post-assets-view-container">
                  {postDetail?.post_images?.length
                    ? postDetail?.post_images?.map((image) => (
                        <li key={image}>
                          <img src={image} alt="profile_image" />
                        </li>
                      ))
                    : '-'}
                </ul>
              </div>
            </div>
            <hr />
            <div className="row align-items-center mb-2">
              <div className="col-3 text-right">
                <label htmlFor="">PostVideos</label>
              </div>
              <div className="col-8">
                <ul className="post-assets-view-container">
                  {postDetail?.post_vids?.length
                    ? postDetail?.post_vids?.map((vids) => (
                        <li key={vids}>
                          <video width="320" height="240" controls>
                            <source src={vids} />
                            Your browser does not support the video tag.
                          </video>
                        </li>
                      ))
                    : '-'}
                </ul>
              </div>
            </div>
            <hr />
            <CButton color="primary" type="button" onClick={triggerCommentModal}>
              Check comments
            </CButton>
          </form>
        ) : null}
      </AppModal>
      {viewModalComment ? (
        <CommentsListing
          viewModalComment
          setViewModalComment={setViewModalComment}
          id={postDetail?._id}
        />
      ) : null}
    </LoadingContainer>
  )
}

export default Posts
