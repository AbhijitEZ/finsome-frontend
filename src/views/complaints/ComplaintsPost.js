import React from 'react'
import { CButton, CCol, CFormInput, CInputGroup, CRow } from '@coreui/react'
import { dateFormatHandler, serviceAuthManager } from 'src/util'
import LoadingContainer from 'src/components/LoadingContainer'
import CIcon from '@coreui/icons-react'
import { cilSearch } from '@coreui/icons'
import debounce from 'lodash.debounce'
import { useFuzzyHandlerHook } from 'src/components/hook'
import { RDTable } from 'src/components/RDTable'

const ComplaintsPost = () => {
  const [appImproves, setAppImprove] = React.useState([])
  const [loading, setLoading] = React.useState(true)
  const [currentSearchVal, setCurrentSearchVal] = React.useState('')
  const [filteredAppImp, setFilteredAppImp] = React.useState([])
  const { fuzzyHandler } = useFuzzyHandlerHook()

  const fetchAppImprovements = async () => {
    serviceAuthManager('/complaints/POST')
      .then((res) => {
        if (res.data?.data) {
          setAppImprove(res.data?.data)
        }
      })
      .finally(() => {
        setLoading(false)
      })
  }

  const handleSearchMechanism = () => {
    const searchData = fuzzyHandler(currentSearchVal, appImproves, [
      'reason',
      'description',
      'user_id.fullname',
    ])

    const finalSearchFilterData = searchData.map((search) => ({ ...search.obj }))
    setFilteredAppImp(finalSearchFilterData)
  }

  React.useEffect(() => {
    fetchAppImprovements()
  }, [])

  React.useEffect(() => {
    if (appImproves.length) {
      handleSearchMechanism()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [appImproves, currentSearchVal])

  const handleSearchInpChange = (evt) => {
    evt.preventDefault()
    setCurrentSearchVal(evt.target.elements.searchInput.value)
  }

  const handleSearchOnFormInpChange = (evt) => {
    evt.preventDefault()
    setCurrentSearchVal(evt.target.value)
  }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debounceFn = React.useCallback(debounce(handleSearchOnFormInpChange, 1000), [])

  const appImpData = React.useMemo(
    () => (filteredAppImp.length || currentSearchVal ? filteredAppImp : appImproves),
    [filteredAppImp, currentSearchVal, appImproves],
  )

  const columns = [
    {
      name: 'UserDetails',
      selector: (row) => (
        <div className="d-flex flex-column">
          <span className="font-weight-bold">{row.user_id?.fullname}</span>
          <span>phone: {row.user_id?.phone_number}</span>
        </div>
      ),
    },
    {
      name: 'Post ID',
      selector: (row) => row.post_complain_id || '-',
    },
    {
      name: 'reason',
      selector: (row) => row?.reason || '-',
    },
    {
      name: 'description',
      selector: (row) => row?.description || '-',
      grow: 2,
    },
    {
      name: 'Submitted At',
      selector: (row) => (row?.created_at ? dateFormatHandler(row?.created_at) : '-'),
    },
  ]

  return (
    <LoadingContainer loading={loading}>
      <CRow>
        <CCol xs></CCol>
        <CCol xs className="align-self-end">
          <form onSubmit={handleSearchInpChange} onChange={debounceFn}>
            <CInputGroup className="mb-3">
              <CFormInput
                placeholder="Search with reason or name or description"
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
            data={appImpData}
            headerTitle={'Complaints Post'}
            pagination
            striped
            keyField="_id"
          />
        </CCol>
      </CRow>
    </LoadingContainer>
  )
}

export default ComplaintsPost
