import React from 'react'
import { CButton, CCol, CFormInput, CInputGroup, CRow } from '@coreui/react'
import { dateFormatHandler, serviceAuthManager } from 'src/util'
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
          console.log(res.data?.data?.result, 'DATA')
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
      name: 'Post ID',
      selector: (row) => {
        return row._id
        // var index = contactData.indexOf(row)
        // return index + 1
      },
    },
    {
      name: 'User Name',
      selector: (row) => row.user?.fullname ?? '-',
    },
    {
      name: 'Post Type',
      selector: (row) => row.stock_type ?? '-',
      width: '125px',
    },
    {
      name: 'Analysis Type',
      selector: (row) => row.analysis_type ?? '-',
      width: '125px',
    },
    {
      name: 'Market Name',
      selector: (row) => {
        if (!row.security.length) {
          return '-'
        }

        var country = []
        row.security.forEach((element) => {
          if (element?.country_data != null) {
            var eleLength = country.filter((e) => e === element?.country_data?.name.toUpperCase())
            if (eleLength.length === 0) {
              country.push(element?.country_data?.name.toUpperCase())
            }
          }
        })
        return country.length > 0 ? country.join(', ') : '-'
      },
      width: '125px',
    },
    {
      name: 'Trade Type',
      selector: (row) => row.trade_type ?? '-',
      width: '125px',
    },
    {
      name: 'Stock Names',
      selector: (row) => {
        if (!row.security.length) {
          return '-'
        }

        const data = row.security.map((element) => element.name).join(', ')
        return data
      },
    },
    // {
    //   name: 'Comments',
    //   selector: (row) => row.total_comments ?? '-',
    //   width: '120px',
    // },
    // {
    //   name: 'likes',
    //   selector: (row) => row.total_likes ?? '-',
    //   width: '100px',
    // },
    {
      name: 'Date',
      selector: (row) => dateFormatHandler(row.created_at, true) ?? '-',
      width: '180px',
    },
    {
      name: 'Activity',
      width: '180px',
      selector: (row) => (
        <CRow className="w-100 activity-tab-cell flex-wrap overflow-visible">
          <CCol xs={4}>
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
          <CCol xs={4}>
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
            <div className="row">
              <div className="col-md-3 mb-3">
                <div className="form-group">
                  <label style={{ fontWeight: '500' }}>Fullname</label>
                  <input
                    type="text"
                    className="form-control px-0 py-0"
                    placeholder="-"
                    value={postDetail.user?.fullname ?? ''}
                    readOnly
                  />
                </div>
              </div>

              <div className="col-md-3 mb-3">
                <div className="form-group">
                  <label style={{ fontWeight: '500' }}>Post Type</label>
                  <input
                    type="text"
                    className="form-control px-0 py-0"
                    placeholder="-"
                    value={postDetail.stock_type ?? ''}
                    readOnly
                  />
                </div>
              </div>

              <div className="col-md-3 mb-3">
                <div className="form-group">
                  <label style={{ fontWeight: '500' }}>Analysis Type</label>
                  <input
                    type="text"
                    className="form-control px-0 py-0"
                    placeholder="-"
                    value={postDetail.analysis_type ?? ''}
                    readOnly
                  />
                </div>
              </div>

              <div className="col-md-3 mb-3">
                <div className="form-group">
                  <label style={{ fontWeight: '500' }}>Trade Type</label>
                  <input
                    type="text"
                    className="form-control px-0 py-0"
                    placeholder="-"
                    value={postDetail.trade_type ?? ''}
                    readOnly
                  />
                </div>
              </div>

              <div className="col-md-4 mb-3">
                <div className="form-group">
                  <label style={{ fontWeight: '500' }}>Total Comments</label>
                  <input
                    type="text"
                    className="form-control px-0 py-0"
                    placeholder="-"
                    value={postDetail.total_comments ?? ''}
                    readOnly
                  />
                </div>
              </div>

              <div className="col-md-4 mb-3">
                <div className="form-group">
                  <label style={{ fontWeight: '500' }}>Total Likes</label>
                  <input
                    type="text"
                    className="form-control px-0 py-0"
                    placeholder="-"
                    value={postDetail.total_likes ?? ''}
                    readOnly
                  />
                </div>
              </div>

              <div className="col-md-4 mb-3">
                <div className="form-group">
                  <label style={{ fontWeight: '500' }}>Stock Recommended Type</label>
                  <input
                    type="text"
                    className="form-control px-0 py-0"
                    placeholder="-"
                    value={postDetail.stock_recommended_type ?? ''}
                    readOnly
                  />
                </div>
              </div>

              <div className="col-md-4 mb-3">
                <div className="form-group">
                  <label style={{ fontWeight: '500' }}>Buy Recommend Amount</label>
                  <input
                    type="text"
                    className="form-control px-0 py-0"
                    placeholder="-"
                    value={postDetail.buy_recommend_amount ?? ''}
                    readOnly
                  />
                </div>
              </div>

              <div className="col-md-4 mb-3">
                <div className="form-group">
                  <label style={{ fontWeight: '500' }}>Sell Recommend Amount</label>
                  <input
                    type="text"
                    className="form-control px-0 py-0"
                    placeholder="-"
                    value={postDetail.sell_recommend_amount ?? ''}
                    readOnly
                  />
                </div>
              </div>

              <div className="col-md-3 mb-3">
                <div className="form-group">
                  <label style={{ fontWeight: '500' }}>Is Recommended</label>
                  <input
                    type="text"
                    className="form-control px-0 py-0"
                    placeholder="-"
                    value={
                      postDetail?.is_recommended != null
                        ? postDetail?.is_recommended
                          ? 'Yes'
                          : 'No'
                        : ''
                    }
                    readOnly
                  />
                </div>
              </div>

              <div className="col-md-3 mb-3">
                <div className="form-group">
                  <label style={{ fontWeight: '500' }}>Stock Names</label>
                  <div>
                    {postDetail?.security?.length
                      ? postDetail?.security.map((e) => e.name).join(', ')
                      : '-'}
                  </div>
                </div>
              </div>

              <div className="col-md-6 mb-3">
                <div className="form-group">
                  <label style={{ fontWeight: '500' }}>Caption</label>
                  <div>{postDetail?.caption ?? ''}</div>
                </div>
              </div>
            </div>

            <h5 className="mt-4">Post Images</h5>
            <div className="row mt-2">
              {postDetail?.post_images?.length ? (
                postDetail?.post_images?.map((image) => (
                  <div key={image} className="col-md-4">
                    <img src={image} alt="profile_image" width="100%" />
                  </div>
                ))
              ) : (
                <div className="col-md-4">-</div>
              )}
            </div>

            <h5 className="mt-4">Post Videos</h5>
            <div className="row mt-2 ">
              {postDetail?.post_vids?.length ? (
                postDetail?.post_vids?.map((vids) => (
                  <div key={vids} className="col-md-4">
                    <video width="320" height="240" controls>
                      <source src={vids} />
                      Your browser does not support the video tag.
                    </video>
                  </div>
                ))
              ) : (
                <div className="col-md-4">-</div>
              )}
            </div>
            <CButton
              color="success"
              className="btn-sm text-white mt-2"
              type="button"
              onClick={triggerCommentModal}
            >
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
