import React from 'react'
import { CCol, CRow } from '@coreui/react'
import { dateFormatHandler, serviceAuthManager } from 'src/util'
import { RDTable } from 'src/components/RDTable'
import LoadingContainer from 'src/components/LoadingContainer'

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
        <CCol xs={12}>
          <RDTable
            columns={columns}
            data={quickContacts}
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
