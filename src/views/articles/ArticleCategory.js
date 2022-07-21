import React from 'react'
import { CButton, CCol, CFormInput, CInputGroup, CRow } from '@coreui/react'
import { serviceAuthManager } from 'src/util'
import LoadingContainer from 'src/components/LoadingContainer'
import CIcon from '@coreui/icons-react'
import { cilNotes, cilSearch, cilTrash } from '@coreui/icons'
import debounce from 'lodash.debounce'
import { useFuzzyHandlerHook } from 'src/components/hook'
import { RDTable } from 'src/components/RDTable'
import ArticleCatAdd from './ArticleCategoryAdd'
import { toastMessage } from 'src/helper/util'

const ArticleCategory = () => {
  const [appImproves, setAppImprove] = React.useState([])
  const [loading, setLoading] = React.useState(true)
  const [currentSearchVal, setCurrentSearchVal] = React.useState('')
  const [filteredAppImp, setFilteredAppImp] = React.useState([])
  const { fuzzyHandler } = useFuzzyHandlerHook()

  const fetchAppImprovements = async () => {
    serviceAuthManager('/post/article-categories', 'get', {}, true)
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
      setFilteredAppImp(appImproves)
      return
    }
    const searchData = fuzzyHandler(currentSearchVal, appImproves, ['name'])

    const finalSearchFilterData = searchData.map((search) => ({ ...search.obj }))
    setFilteredAppImp(finalSearchFilterData)
  }

  const handleAddCallback = (data, loader, visibleCB) => {
    serviceAuthManager('/post/article-categories', 'post', data, true)
      .then(() => {
        toastMessage('success', 'Added the article category successfully')
        fetchAppImprovements()
      })
      .catch(() => {
        toastMessage('error', 'Error while adding the particular article category')
      })
      .finally(() => {
        loader(false)
        visibleCB(false)
      })
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
      name: 'Name',
      selector: (row) => row.name || '-',
      grow: 2,
    },
    {
      name: 'Activity',
      selector: (row) => (
        <CRow className="w-100 activity-tab-cell flex-wrap overflow-visible">
          <CCol xs={3}>
            <CButton type="button" size="sm" color="secondary" variant="outline" onClick={() => {}}>
              <CIcon icon={cilNotes} />
            </CButton>
          </CCol>
          <CCol xs={3}>
            <CButton type="button" size="sm" color="danger" variant="outline" onClick={() => {}}>
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
          <ArticleCatAdd handleCallback={handleAddCallback} />
        </CCol>
        <CCol xs className="align-self-end">
          <form onSubmit={handleSearchInpChange} onChange={debounceFn}>
            <CInputGroup className="mb-3">
              <CFormInput
                placeholder="Search with name"
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
            headerTitle={'Article Category'}
            pagination
            striped
            keyField="_id"
          />
        </CCol>
      </CRow>
    </LoadingContainer>
  )
}

export default ArticleCategory
