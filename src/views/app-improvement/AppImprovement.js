import React from 'react'
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
} from '@coreui/react'
import { dateFormatHandler, serviceAuthManager } from 'src/util'
import Spinner from 'src/components/Spinner'

const AppImprovement = () => {
  const [appImproves, setAppImprove] = React.useState([])
  const [loading, setLoading] = React.useState(true)

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

  React.useEffect(() => {
    fetchAppImprovements()
  }, [])

  if (loading) {
    return <Spinner />
  }

  return (
    <>
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
                  {appImproves.map((item, index) => (
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
    </>
  )
}

export default AppImprovement
