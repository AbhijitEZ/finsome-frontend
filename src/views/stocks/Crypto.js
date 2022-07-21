import React from 'react'
import { CButton, CCol, CFormInput, CInputGroup, CRow } from '@coreui/react'
import { serviceAuthManager } from 'src/util'
import { RDTable } from 'src/components/RDTable'
import LoadingContainer from 'src/components/LoadingContainer'
import CIcon from '@coreui/icons-react'
import { cilSearch, cilTrash } from '@coreui/icons'
import { useFuzzyHandlerHook } from 'src/components/hook'
import debounce from 'lodash.debounce'
import FileUpload from './FileUpload'
import { toastMessage } from 'src/helper/util'
import StockAddModel from './StockAddModal'

const Crypto = () => {
  const [stockCrypto, setStockCrypto] = React.useState([])
  const [cryptoFilter, setFilteredCrypto] = React.useState([])
  const [loading, setLoading] = React.useState(true)
  const [currentSearchVal, setCurrentSearchVal] = React.useState('')

  const { fuzzyHandler } = useFuzzyHandlerHook()

  const fetchStock = async () => {
    serviceAuthManager('/post/stock-type?type=CRYPT&has_all_data=true', 'get', {}, true)
      .then((res) => {
        if (res.data?.data) {
          setStockCrypto(res.data?.data?.stocks)
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
    const searchData = fuzzyHandler(currentSearchVal, stockCrypto, ['name', 'code'])

    const finalSearchFilterData = searchData.map((search) => ({ ...search.obj }))
    setFilteredCrypto(finalSearchFilterData)
  }

  const handleSearchOnFormInpChange = (evt) => {
    evt.preventDefault()
    setCurrentSearchVal(evt.target.value)
  }

  const handleCSVUpdateSuccess = () => {
    fetchStock()
  }

  const handleAddCallback = (data, loader, visibleCB) => {
    serviceAuthManager('/stock/CRYPT', 'post', data)
      .then(() => {
        toastMessage('success', 'Added the stock successfully')
        fetchStock()
      })
      .catch(() => {
        toastMessage('error', 'Error while adding the particular stock')
      })
      .finally(() => {
        loader(false)
        visibleCB(false)
      })
  }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debounceFn = React.useCallback(debounce(handleSearchOnFormInpChange, 1000), [])

  const handleSearchInpChange = (evt) => {
    evt.preventDefault()
    setCurrentSearchVal(evt.target.elements.searchInput.value)
  }

  const handleDeleteStock = (id) => {
    serviceAuthManager(`/stock/CRYPT/${id}`, 'delete')
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

  const contactData = React.useMemo(
    () => (cryptoFilter.length || currentSearchVal ? cryptoFilter : stockCrypto),
    [cryptoFilter, stockCrypto, currentSearchVal],
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
    // {
    //   name: 'Image',
    //   selector: (row) => row.image || '-',
    // },
    {
      name: 'Activity',
      selector: (row) => (
        <CRow className="w-100 activity-tab-cell flex-wrap overflow-visible">
          <CCol xs={3}>
            <CButton
              type="button"
              size="sm"
              color="danger"
              variant="outline"
              onClick={() => handleDeleteStock(row._id)}
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
          <FileUpload type="CRYPT" refetchNetworkData={handleCSVUpdateSuccess} />
          <StockAddModel handleCallback={handleAddCallback} />
        </CCol>
        <CCol xs></CCol>
        <CCol xs className="align-self-end">
          <form onSubmit={handleSearchInpChange} onChange={debounceFn}>
            <CInputGroup className="mb-3">
              <CFormInput
                placeholder="Search with name or code"
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
            headerTitle={'Crypto'}
            pagination
            striped
            keyField="_id"
          />
        </CCol>
      </CRow>
    </LoadingContainer>
  )
}

export default Crypto
