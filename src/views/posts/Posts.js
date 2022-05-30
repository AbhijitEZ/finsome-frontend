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
//import { toastMessage } from 'src/helper/util'
import AppModal from 'src/components/AppModal'

const Posts = () => {
  const [stockCrypto, setStockCrypto] = React.useState([])
  const [cryptoFilter, setFilteredCrypto] = React.useState([])
  const [loading, setLoading] = React.useState(true)
  const [currentSearchVal, setCurrentSearchVal] = React.useState('')
  const [viewModalCheck, setViewModalCheck] = React.useState(false)
  const [postDetail, setPostDetail] = React.useState({})

  const { fuzzyHandler } = useFuzzyHandlerHook()

  const fetchStock = async () => {
    serviceAuthManager('/post/home?has_all_data=true', 'get', {}, true)
      .then((res) => {
        if (res.data?.data) {
          console.log(
            res.data?.data?.result.filter((data) => data.security.length),
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

  const handleDeletePost = (id) => {
    // serviceAuthManager(`/stock/OTHER/${id}`, 'delete')
    //   .then(() => {
    //     toastMessage('success', 'Deleted the stock successfully')
    //     fetchStock()
    //   })
    //   .catch((err) => {
    //     toastMessage(
    //       'error',
    //       err?.response?.data?.message || 'Error while deleting the particular stock',
    //     )
    //   })
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
      selector: (row) => row.caption ?? '-',
    },
    {
      name: 'Fullname',
      selector: (row) => row.user?.fullname ?? '-',
    },
    {
      name: 'Stock Type',
      selector: (row) => row.stock_type ?? '-',
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
        // <CRow className="w-100 activity-tab-cell flex-wrap overflow-visible">
        //   <CCol xs={3}>
        //     <CButton
        //       type="button"
        //       size="sm"
        //       color="danger"
        //       variant="outline"
        //       onClick={() => handleDeletePost(row._id)}
        //     >
        //       <CIcon icon={cilTrash} />
        //     </CButton>
        //   </CCol>
        // </CRow>
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
      >
        {!isEmpty(postDetail) ? (
          <form>
            {/* <div className="d-flex">
              <CAvatar size="xl" className="user-profile-img" src={postDetail.user} />
            </div> */}
            <div className="row align-items-center mb-2">
              <div className="col-3">
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
              <div className="col-3">
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
              <div className="col-3">
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
              <div className="col-3">
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
              <div className="col-3">
                <label htmlFor="">Caption</label>
              </div>
              <div className="col-8">
                <textarea
                  className="form-control"
                  placeholder="-"
                  value={postDetail?.caption ?? ''}
                  readOnly
                />
              </div>
            </div>
            <div className="row align-items-center mb-2">
              <div className="col-3">
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
              <div className="col-3">
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
              <div className="col-3">
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
              <div className="col-3">
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
              <div className="col-3">
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
              <div className="col-3">
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
              <div className="col-3">
                <label htmlFor="">Security Ids</label>
              </div>
              <div className="col-8">
                <textarea
                  type="text"
                  className="form-control"
                  placeholder="-"
                  value={postDetail?.security?.length ? JSON.stringify(postDetail?.security) : ''}
                  readOnly
                />
              </div>
            </div>
          </form>
        ) : null}
      </AppModal>
    </LoadingContainer>
  )
}

export default Posts
