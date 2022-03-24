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
import { serviceAuthManager } from 'src/util'

const AppImprovement = () => {
  const [appImproves, setAppImprove] = React.useState([])

  const fetchAppImprovements = async () => {
    serviceAuthManager('/app-improvement-suggestions').then((res) => {
      if (res.data?.data) {
        setAppImprove(res.data?.data)
      }
    })
  }

  React.useEffect(() => {
    fetchAppImprovements()
  }, [])

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
                    <CTableHeaderCell>Description</CTableHeaderCell>
                    <CTableHeaderCell>Type</CTableHeaderCell>
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
                        <div className="clearfix" style={{ maxWidth: 535 }}>
                          <div className="float-start">
                            <span>{item?.app_improvement_suggestion?.description || '-'}</span>
                          </div>
                        </div>
                      </CTableDataCell>

                      <CTableDataCell>
                        <div>{item?.app_improvement_suggestion?.name}</div>
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
