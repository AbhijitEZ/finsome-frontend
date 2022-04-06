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
// import Spinner from 'src/components/Spinner'

const QuickContact = () => {
  const [quickContacts, setQuickContacts] = React.useState([])
  const [loading, setLoading] = React.useState(true)

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

  if (loading) {
    return <Spinner />
  }

  return (
    <>
      <CRow>
        <CCol xs>
          <CCard className="mb-4">
            <CCardHeader>Contact</CCardHeader>
            <CCardBody>
              <CTable align="middle" className="mb-0 border" hover responsive>
                <CTableHead color="light">
                  <CTableRow>
                    <CTableHeaderCell>Name</CTableHeaderCell>
                    <CTableHeaderCell>Email</CTableHeaderCell>
                    <CTableHeaderCell>Message</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {quickContacts.map((item, index) => (
                    <CTableRow v-for="item in tableItems" key={index}>
                      <CTableDataCell>
                        <div>{item.name}</div>
                        <div className="small text-medium-emphasis">
                          <span>{item?.created_at ? dateFormatHandler(item.created_at) : '-'}</span>
                        </div>
                      </CTableDataCell>

                      <CTableDataCell>
                        <div>{item?.email}</div>
                      </CTableDataCell>

                      <CTableDataCell>
                        <div className="clearfix" style={{ maxWidth: 535 }}>
                          <div className="float-start">
                            <span>{item?.message || '-'}</span>
                          </div>
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

export default QuickContact
