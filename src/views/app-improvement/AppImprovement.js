import React from 'react'
import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CFormInput,
  CInputGroup,
  CRow,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
} from '@coreui/react'
import { dateFormatHandler, serviceAuthManager } from 'src/util'
import LoadingContainer from 'src/components/LoadingContainer'
import CIcon from '@coreui/icons-react'
import { cilSearch } from '@coreui/icons'
import debounce from 'lodash.debounce'
import { useFuzzyHandlerHook } from 'src/components/hook'

const AppImprovement = () => {
  const [appImproves, setAppImprove] = React.useState([])
  const [loading, setLoading] = React.useState(true)
  const [currentSearchVal, setCurrentSearchVal] = React.useState('')
  const [filteredAppImp, setFilteredAppImp] = React.useState([])
  const { fuzzyHandler } = useFuzzyHandlerHook()

  const fetchAppImprovements = async () => {
    serviceAuthManager('/app-improvement-suggestions')
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
    if (!currentSearchVal) {
      setFilteredAppImp([])
      return
    }
    const searchData = fuzzyHandler(currentSearchVal, appImproves, [
      'fullname',
      'phone_number',
      'app_improvement_suggestion.description',
      'app_improvement_suggestion.name',
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

  return (
    <LoadingContainer loading={loading}>
      <CRow>
        <CCol xs></CCol>
        <CCol xs className="align-self-end">
          <form onSubmit={handleSearchInpChange} onChange={debounceFn}>
            <CInputGroup className="mb-3">
              <CFormInput
                placeholder="Search with phone number or name or comment or type"
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
        <CCol xs>
          <CCard className="mb-4">
            <CCardHeader>App Improvement Suggestion</CCardHeader>
            <CCardBody>
              <CTable align="middle" className="mb-0 border" hover responsive>
                <CTableHead color="light">
                  <CTableRow>
                    <CTableHeaderCell>Name</CTableHeaderCell>
                    <CTableHeaderCell>Type</CTableHeaderCell>
                    <CTableHeaderCell style={{ maxWidth: 500 }}>Comment</CTableHeaderCell>
                    <CTableHeaderCell>Submitted At</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {appImpData.map((item, index) => (
                    <CTableRow v-for="item in tableItems" key={index}>
                      <CTableDataCell>
                        <div>{item.fullname}</div>
                        <div className="small text-medium-emphasis">
                          <span>{item.phone_number}</span>
                        </div>
                      </CTableDataCell>

                      <CTableDataCell>
                        <div>{item?.app_improvement_suggestion?.name}</div>
                      </CTableDataCell>

                      <CTableDataCell>
                        <div className="clearfix" style={{ maxWidth: 500 }}>
                          <div className="float-start">
                            <span>{item?.app_improvement_suggestion?.description || '-'}</span>
                          </div>
                        </div>
                      </CTableDataCell>

                      <CTableDataCell>
                        <div>
                          {item?.app_improvement_suggestion?.timestamp
                            ? dateFormatHandler(item.app_improvement_suggestion.timestamp)
                            : '-'}
                        </div>
                      </CTableDataCell>
                    </CTableRow>
                  ))}
                </CTableBody>
              </CTable>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </LoadingContainer>
  )
}

export default AppImprovement
