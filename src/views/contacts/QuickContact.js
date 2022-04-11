import React from 'react'
import { CButton, CCol, CFormInput, CInputGroup, CRow } from '@coreui/react'
import { dateFormatHandler, serviceAuthManager } from 'src/util'
import { RDTable } from 'src/components/RDTable'
import LoadingContainer from 'src/components/LoadingContainer'
import CIcon from '@coreui/icons-react'
import { cilSearch } from '@coreui/icons'
import { useFuzzyHandlerHook } from 'src/components/hook'
import debounce from 'lodash.debounce'

const QuickContact = () => {
  const [quickContacts, setQuickContacts] = React.useState([])
  const [contactFilter, setFilteredContact] = React.useState([])
  const [loading, setLoading] = React.useState(true)
  const [currentSearchVal, setCurrentSearchVal] = React.useState('')
  const { fuzzyHandler } = useFuzzyHandlerHook()

  const fetchQuickContacts = async () => {
    serviceAuthManager('/quick-contacts')
      .then((res) => {
        if (res.data?.data) {
          setQuickContacts(res.data?.data)
        }
      })
      .finally(() => {
        setLoading(false)
      })
  }

  React.useEffect(() => {
    fetchQuickContacts()
  }, [])

  React.useEffect(() => {
    if (quickContacts.length) {
      handleSearchMechanism()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [quickContacts, currentSearchVal])

  const handleSearchMechanism = () => {
    if (!currentSearchVal) {
      setFilteredContact(quickContacts)
      return
    }
    const searchData = fuzzyHandler(currentSearchVal, quickContacts, ['name', 'email', 'message'])

    const finalSearchFilterData = searchData.map((search) => ({ ...search.obj }))
    setFilteredContact(finalSearchFilterData)
  }

  const handleSearchOnFormInpChange = (evt) => {
    evt.preventDefault()
    setCurrentSearchVal(evt.target.value)
  }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debounceFn = React.useCallback(debounce(handleSearchOnFormInpChange, 1000), [])

  const handleSearchInpChange = (evt) => {
    evt.preventDefault()
    setCurrentSearchVal(evt.target.elements.searchInput.value)
  }

  const contactData = React.useMemo(
    () => (contactFilter.length || currentSearchVal ? contactFilter : quickContacts),
    [contactFilter, quickContacts, currentSearchVal],
  )

  const columns = [
    {
      name: 'Name',
      selector: (row) => row.name,
    },
    {
      name: 'Email',
      selector: (row) => row.email,
    },
    {
      name: 'Message',
      selector: (row) => row.message || '-',
      grow: 2,
    },
    {
      name: 'Submitted At',
      selector: (row) => (row?.created_at ? dateFormatHandler(row.created_at) : '-'),
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
                placeholder="Search with name or email or message"
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
            headerTitle={'Contacts'}
            pagination
            striped
            keyField="_id"
          />
        </CCol>
      </CRow>
    </LoadingContainer>
  )
}

export default QuickContact
