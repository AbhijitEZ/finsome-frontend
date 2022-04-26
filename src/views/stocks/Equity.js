import React from 'react'
import { CButton, CCol, CFormInput, CInputGroup, CRow } from '@coreui/react'
import { serviceAuthManager } from 'src/util'
import { RDTable } from 'src/components/RDTable'
import LoadingContainer from 'src/components/LoadingContainer'
import CIcon from '@coreui/icons-react'
import { cilNotes, cilSearch, cilTrash } from '@coreui/icons'
import { useFuzzyHandlerHook } from 'src/components/hook'
import debounce from 'lodash.debounce'
import CountrySelect from 'src/components/select/CountrySelect'
import FileUpload from './FileUpload'

const Equity = () => {
  const [stockEquities, setStockEquity] = React.useState([])
  const [equityFilter, setFilteredEquity] = React.useState([])
  const [loading, setLoading] = React.useState(true)
  const [currentSearchVal, setCurrentSearchVal] = React.useState('')
  const [selectedCountry, setCountry] = React.useState('')
  const { fuzzyHandler } = useFuzzyHandlerHook()

  const fetchStockEquity = async () => {
    serviceAuthManager('/post/stock-type?type=EQUITY&has_all_data=true', 'get', {}, true)
      .then((res) => {
        if (res.data?.data) {
          setStockEquity(res.data?.data?.stocks)
        }
      })
      .finally(() => {
        setLoading(false)
      })
  }

  React.useEffect(() => {
    fetchStockEquity()
  }, [])

  React.useEffect(() => {
    if (stockEquities.length) {
      handleSearchMechanism()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stockEquities, currentSearchVal])

  const handleSearchMechanism = () => {
    if (!currentSearchVal) {
      setFilteredEquity(stockEquities)
      return
    }
    const searchData = fuzzyHandler(currentSearchVal, stockEquities, [
      'name',
      'code',
      'country_code',
    ])

    const finalSearchFilterData = searchData.map((search) => ({ ...search.obj }))
    setFilteredEquity(finalSearchFilterData)
  }

  const handleSearchOnFormInpChange = (evt) => {
    evt.preventDefault()
    setCurrentSearchVal(evt.target.value)
  }

  const handleCountryChange = (e) => {
    setCountry(e.target.value || '')
  }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debounceFn = React.useCallback(debounce(handleSearchOnFormInpChange, 1000), [])

  const handleSearchInpChange = (evt) => {
    evt.preventDefault()
    setCurrentSearchVal(evt.target.elements.searchInput.value)
  }

  const contactData = React.useMemo(
    () => (equityFilter.length || currentSearchVal ? equityFilter : stockEquities),
    [equityFilter, stockEquities, currentSearchVal],
  )

  const columns = [
    {
      name: 'Name',
      selector: (row) => row.name,
    },
    {
      name: 'Code',
      selector: (row) => row.code,
    },
    {
      name: 'Country Code',
      selector: (row) => row.country_code || '-',
      grow: 2,
    },
    {
      name: 'Image',
      selector: (row) => row.image || '-',
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
              onClick={() => console.log(row.meta_data)}
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
              onClick={() => console.log(row.id)}
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
        <CCol xs>
          <FileUpload type="EQUITY" />
        </CCol>
        <CCol xs>
          <CountrySelect value={selectedCountry} handleChange={handleCountryChange} />{' '}
        </CCol>
        <CCol xs className="align-self-end">
          <form onSubmit={handleSearchInpChange} onChange={debounceFn}>
            <CInputGroup className="mb-3">
              <CFormInput
                placeholder="Search with name or code or country code"
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
            headerTitle={'Equity Stocks'}
            pagination
            striped
            keyField="_id"
          />
        </CCol>
      </CRow>
    </LoadingContainer>
  )
}

export default Equity
