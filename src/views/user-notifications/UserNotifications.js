import React from 'react'
import {
  CAvatar,
  CCol,
  CRow,
  CButton,
  CForm,
  CCard,
  CCardBody,
  CInputGroup,
  CFormInput,
  CFormTextarea,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilSearch } from '@coreui/icons'
import avatar1 from 'src/assets/images/avatars/placeholder.jpg'
import { serviceAuthManager } from 'src/util'
import LoadingContainer from 'src/components/LoadingContainer'
import { RDTable } from 'src/components/RDTable'

const UserNotifications = () => {
  const [users, setUsers] = React.useState([])
  const [loading, setLoading] = React.useState(true)

  const fetchUsers = async () => {
    serviceAuthManager('/users')
      .then((res) => {
        if (res.data?.data) {
          const filteredUser = res.data?.data?.map((user) => {
            return {
              id: user._id,
              fullname: user.fullname,
              email: user.email,
              phone_number: user.phone_number,
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
              meta_data: {
                ...user,
              },
            }
          })
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
  const usersData = React.useMemo(() => users, [users])

  const onUserCheck = (e) => {
    const id = e.target.id.split('_')[1].toString()
    usersData.forEach((a) => {
      if (a.id === id) {
        a.selected = e.target.checked
      }
    })
  }

  const sendNotifications = (e) => {
    e.preventDefault()
    let filteredUsers = usersData.filter((a) => a.selected === true).map((a) => a.id)
    const payload = {
      title: e.target.title.value,
      body: e.target.body.value,
      userIds: filteredUsers,
    }
    console.log(payload)
    // if (filteredUsers.length > 0) {
    //   serviceAuthManager('/send-notification', 'post', payload)
    //     .then((res) => {
    //       if (res.data?.data) {
    //       }
    //     })
    //     .finally(() => {
    //       setLoading(false)
    //     })
    // }
  }

  const columns = [
    {
      name: '#',
      width: '50px',
      selector: (row) => {
        const id = `row_${row.id}`
        return (
          <input
            type="checkbox"
            checked={row.selected}
            className="form-check-input"
            id={id}
            onChange={onUserCheck}
          />
        )
      },
    },
    {
      name: 'User Details',
      selector: (row) => (
        <div className="d-flex">
          <CAvatar
            size="md"
            className="user-profile-img"
            src={row.avatar.src}
            status={row.avatar.status}
          />

          <div className="d-flex flex-column ml-1">
            <span className="font-weight-bold">{row.fullname || 'N/A'}</span>
          </div>
        </div>
      ),
    },
    {
      name: 'Email',
      selector: (row) => row.email || 'N/A',
    },
  ]

  return (
    <LoadingContainer loading={loading}>
      <CRow>
        <CCol className="col-md-4">
          <CCard className="mb-4">
            <CCardBody>
              <div className="mb-3">
                <h4 className="mb-0 pb-0">User Notifications</h4>
                <small className="text-muted">Send notifications to users.</small>
              </div>

              <CForm onSubmit={sendNotifications}>
                <CFormInput
                  type="text"
                  id="title"
                  className="mb-3"
                  label="Title"
                  name="title"
                  required
                />
                <CFormTextarea
                  id="body"
                  className="mb-3"
                  label="Body"
                  name="body"
                  required
                ></CFormTextarea>

                <div className="mb-2">
                  <button type="submit" className="btn btn-info text-white">
                    Send
                  </button>
                </div>
              </CForm>
            </CCardBody>
          </CCard>
        </CCol>
        <CCol className="col-md-8">
          <CCard className="mb-4">
            <CCardBody>
              <div className="mb-3">
                <h4 className="mb-0 pb-0">DATA</h4>
                <small className="text-muted">List of users</small>
              </div>
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

              <CRow>
                <CCol xs={12}>
                  <RDTable
                    columns={columns}
                    data={usersData}
                    headerTitle={'Users List'}
                    pagination
                    striped
                    keyField="id"
                  />
                </CCol>
              </CRow>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </LoadingContainer>
  )
}

export default UserNotifications
