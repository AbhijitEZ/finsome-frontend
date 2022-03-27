import React from 'react'

import {
  CAvatar,
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
  CButton,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilPeople } from '@coreui/icons'

import avatar1 from 'src/assets/images/avatars/1.jpg'

import { serviceAuthManager } from 'src/util'
import Spinner from 'src/components/Spinner'

const Users = () => {
  const [users, setUsers] = React.useState([])
  const [loading, setLoading] = React.useState(true)

  const fetchUsers = async () => {
    serviceAuthManager('/users')
      .then((res) => {
        if (res.data?.data) {
          const filteredUser = res.data?.data?.map((user) => {
            return {
              id: user._id,
              avatar: {
                src: user.profile_photo || avatar1,
                status: user.is_registration_complete ? 'success' : 'danger',
              },
              user: {
                name: user.fullname,
                email: user?.email,
                registered: user?.created_at,
              },

              usage: {
                phone_number: user?.phone_country_code + user?.phone_number,
              },
              deleted_at: user?.deleted_at ?? null,
            }
          })

          console.log(res.data?.data, 'user data')
          setUsers(filteredUser)
        }
      })
      .finally(() => {
        setLoading(false)
      })
  }

  React.useEffect(() => {
    fetchUsers()
  }, [])

  const userTogglerHandler = (currentState, id) => {
    serviceAuthManager('/toggle-user-status', 'post', {
      status: !Boolean(currentState),
      id,
    }).then(() => {
      fetchUsers()
    })
  }

  if (loading) {
    return <Spinner />
  }

  return (
    <>
      <CRow>
        <CCol xs>
          <CCard className="mb-4">
            <CCardHeader>Users</CCardHeader>
            <CCardBody>
              <CTable align="middle" className="mb-0 border" hover responsive>
                <CTableHead color="light">
                  <CTableRow>
                    <CTableHeaderCell className="text-center">
                      <CIcon icon={cilPeople} />
                    </CTableHeaderCell>
                    <CTableHeaderCell>User</CTableHeaderCell>
                    <CTableHeaderCell>Phone</CTableHeaderCell>

                    <CTableHeaderCell>Activity</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {users.map((item, index) => (
                    <CTableRow v-for="item in tableItems" key={index}>
                      <CTableDataCell className="text-center">
                        <CAvatar size="md" src={item.avatar.src} status={item.avatar.status} />
                      </CTableDataCell>
                      <CTableDataCell>
                        <div>{item.user.name}</div>
                        <div className="small text-medium-emphasis">
                          <span>{item.user.email}</span> | Registered: {item.user.registered}
                        </div>
                      </CTableDataCell>

                      <CTableDataCell>
                        <div className="clearfix">
                          <div className="float-start">
                            <strong>{item.usage.phone_number}</strong>
                          </div>
                        </div>
                      </CTableDataCell>

                      <CTableDataCell>
                        <strong>
                          <CButton
                            color="link"
                            onClick={() => userTogglerHandler(item?.deleted_at, item.id)}
                          >
                            {' '}
                            {item?.deleted_at ? 'Enable' : 'Disable'}
                          </CButton>
                        </strong>
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

export default Users
