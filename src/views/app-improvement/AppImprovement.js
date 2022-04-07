import React from 'react'
import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CFormInput,
  CFormSelect,
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
  const [appTypes, setAppTypes] = React.useState([])
  const [loading, setLoading] = React.useState(true)
  const [currentSearchVal, setCurrentSearchVal] = React.useState('')
  const [typeSelect, setTypeSelect] = React.useState('')
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

  const fetchAppImproveTypes = async () => {
    serviceAuthManager('/app-improvement-types', 'get', {}, true).then((res) => {
      if (res.data?.data) {
        setAppTypes(res.data?.data)
      }
    })
  }

  const handleSearchMechanism = () => {
    const filteredAppImproves = appImproves.filter((appType) => {
      if (!typeSelect) {
        return true
      } else if (appType.app_improvement_suggestion.id === typeSelect) {
        return true
      }
      return false
    })

    if (!currentSearchVal) {
      setFilteredAppImp(filteredAppImproves)
      return
    }
    const searchData = fuzzyHandler(currentSearchVal, filteredAppImproves, [
      'fullname',
      'phone_number',
      'app_improvement_suggestion.description',
      'app_improvement_suggestion.name',
    ])

    const finalSearchFilterData = searchData.map((search) => ({ ...search.obj }))
    setFilteredAppImp(finalSearchFilterData)
  }

  React.useEffect(() => {
    fetchAppImproveTypes()
    fetchAppImprovements()
  }, [])

  React.useEffect(() => {
    if (appImproves.length) {
      handleSearchMechanism()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [appImproves, typeSelect, currentSearchVal])

  const handleSearchInpChange = (evt) => {
    evt.preventDefault()
    setCurrentSearchVal(evt.target.elements.searchInput.value)
  }

  const handleSearchOnFormInpChange = (evt) => {
    evt.preventDefault()
    setCurrentSearchVal(evt.target.value)
  }

  const handleAppTypeChange = (evt) => {
    setTypeSelect(evt.target.value)
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
        <CCol xs>
          {appTypes.length ? (
            <CFormSelect
              aria-label="Select Types"
              placeholder="Select Types"
              value={typeSelect}
              onChange={handleAppTypeChange}
            >
              <option value={''}>Select Types</option>
              {appTypes.map((type) => (
                <option value={type._id} key={type._id}>
                  {type.name}
                </option>
              ))}
            </CFormSelect>
          ) : null}
        </CCol>
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
            <CCardHeader>App Improvement Suggestion: ({appImpData.length})</CCardHeader>
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
