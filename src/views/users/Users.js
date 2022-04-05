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
  CInputGroup,
  CFormInput,
  CFormSelect,
} from '@coreui/react'
import debounce from 'lodash.debounce'
import CIcon from '@coreui/icons-react'
import isEmpty from 'lodash.isempty'
import { cilPeople, cilSearch, cilNotes, cilTrash } from '@coreui/icons'
import avatar1 from 'src/assets/images/avatars/placeholder.jpg'
import { serviceAuthManager } from 'src/util'
import AppModal from 'src/components/AppModal'
import LoadingContainer from 'src/components/LoadingContainer'
import { useFuzzyHandlerHook } from 'src/components/hook'
import { toast } from 'react-toastify'

const Users = () => {
  const [viewModalCheck, setViewModalCheck] = React.useState(false)
  const [deleteUserModalVisible, setDeleteUserModalVisible] = React.useState(false)
  const [deleteUserId, setDeleteUserId] = React.useState('')
  const [userDetails, setUserDetails] = React.useState({})
  const [users, setUsers] = React.useState([])
  const [filteredUsers, setFilteredUsers] = React.useState([])
  const [loading, setLoading] = React.useState(true)
  const [currentStatusVal, setCurrentStatusVal] = React.useState('all')
  const [currentSearchVal, setCurrentSearchVal] = React.useState('')

  const { fuzzyHandler } = useFuzzyHandlerHook()

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

  // eslint-disable-next-line no-use-before-define

  const triggerViewModal = (data) => {
    if (data) {
      setUserDetails(data)
    }
    setViewModalCheck((prevState) => !prevState)
  }

  const deleteUserModalOpen = (id) => {
    if (!id) {
      setDeleteUserId('')
      setDeleteUserModalVisible(false)
      return
    }

    setDeleteUserId(id)
    setDeleteUserModalVisible(true)
  }

  const handleDeleteUser = () => {
    serviceAuthManager(`/user/${deleteUserId}`, 'delete', {})
      .then((res) => {
        toast.success(res?.data?.message, {
          position: 'top-center',
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        })
        fetchUsers()
      })
      .catch((error) => {
        console.log('ERROR:', error)
        toast.error('Failed to delete user', {
          position: 'top-center',
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        })
      })
      .finally(setDeleteUserModalVisible(false))
  }

  const handleSearchMechanism = () => {
    let filterUsers = users.filter((user) => {
      if ('enable' === currentStatusVal && !user.deleted_at) {
        return true
      }
      if ('disable' === currentStatusVal && user.deleted_at) {
        return true
      }
      if ('all' === currentStatusVal) {
        return true
      }

      return false
    })

    if (!currentSearchVal) {
      setFilteredUsers(filterUsers)
      return
    }
    const searchData = fuzzyHandler(currentSearchVal, filterUsers, [
      'fullname',
      'email',
      'phone_number',
    ])

    const finalSearchFilterData = searchData.map((search) => ({ ...search.obj }))
    setFilteredUsers(finalSearchFilterData)
  }

  React.useEffect(() => {
    if (users) {
      handleSearchMechanism()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [users, currentStatusVal, currentSearchVal])

  const handleStatusChangeFilter = (data) => {
    setCurrentStatusVal(data.target.value)
  }

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

  const usersData = React.useMemo(
    () => (filteredUsers.length || currentSearchVal ? filteredUsers : users),
    [filteredUsers, currentSearchVal, users],
  )

  return (
    <LoadingContainer loading={loading}>
      <CRow>
        <CCol xs>
          <CFormSelect
            aria-label="Select Active or InActive Filter"
            onChange={handleStatusChangeFilter}
          >
            <option value="all">Select Active or InActive Filter</option>
            <option value="enable">Active</option>
            <option value="disable">InActive</option>
          </CFormSelect>
        </CCol>
        <CCol xs></CCol>
        <CCol xs className="align-self-end">
          <form onSubmit={handleSearchInpChange} onChange={debounceFn}>
            <CInputGroup className="mb-3">
              <CFormInput
                placeholder="Search with name or email or phonenumber"
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
        <CCol xs>
          <CCard className="mb-4">
            <CCardHeader>User Management: ({usersData.length})</CCardHeader>
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
                  {usersData.map((item, index) => (
                    <CTableRow v-for="item in tableItems" key={index}>
                      <CTableDataCell className="text-center">
                        <CAvatar
                          size="md"
                          className="user-profile-img"
                          src={item.avatar.src}
                          status={item.avatar.status}
                        />
                      </CTableDataCell>
                      <CTableDataCell>
                        <div>{item.user.name || 'N/A'}</div>
                        <div className="small text-medium-emphasis">
                          <span>{item.user.email || '-'}</span> | Registered: {item.user.registered}
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
                        <CRow>
                          <CCol xs={2}>
                            <CButton
                              type="button"
                              color="secondary"
                              variant="outline"
                              onClick={() => triggerViewModal(item.meta_data)}
                            >
                              <CIcon icon={cilNotes} />
                            </CButton>
                          </CCol>
                          <CCol xs={2}>
                            <CButton
                              type="button"
                              color="danger"
                              variant="outline"
                              onClick={() => deleteUserModalOpen(item.id)}
                            >
                              <CIcon icon={cilTrash} />
                            </CButton>
                          </CCol>
                          <CCol xs={3}>
                            <strong>
                              <CButton
                                color="link"
                                onClick={() => userTogglerHandler(item?.deleted_at, item.id)}
                              >
                                {' '}
                                {item?.deleted_at ? 'Active' : 'InActive'}
                              </CButton>
                            </strong>
                          </CCol>
                        </CRow>
                      </CTableDataCell>
                    </CTableRow>
                  ))}
                </CTableBody>
              </CTable>
            </CCardBody>
          </CCard>
        </CCol>
        <AppModal
          visible={viewModalCheck}
          scrollable
          setVisible={setViewModalCheck}
          title="User Details"
        >
          {!isEmpty(userDetails) ? (
            <form>
              <div className="row align-items-center mb-2">
                <div className="col-2">
                  <label htmlFor="">Fullname</label>
                </div>
                <div className="col-9">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="-"
                    value={userDetails?.fullname ?? ''}
                    readOnly
                  />
                </div>
              </div>
              <div className="row align-items-center mb-2">
                <div className="col-2">
                  <label htmlFor="">Email</label>
                </div>
                <div className="col-9">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="-"
                    value={userDetails?.email ?? ''}
                    readOnly
                  />
                </div>
              </div>
              <div className="row align-items-center mb-2">
                <div className="col-2">
                  <label htmlFor="">Gender</label>
                </div>
                <div className="col-9">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="-"
                    value={userDetails?.gender ?? ''}
                    readOnly
                  />
                </div>
              </div>
              <div className="row align-items-center mb-2">
                <div className="col-2">
                  <label htmlFor="">Username</label>
                </div>
                <div className="col-9">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="-"
                    value={userDetails?.username ?? ''}
                    readOnly
                  />
                </div>
              </div>
              <div className="row align-items-center mb-2">
                <div className="col-2">
                  <label htmlFor="">Phone Number</label>
                </div>
                <div className="col-9">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="-"
                    value={userDetails?.phone_country_code + userDetails?.phone_number ?? ''}
                    readOnly
                  />
                </div>
              </div>
              <div className="row align-items-center mb-2">
                <div className="col-3">
                  <label htmlFor="">Registration Complete</label>
                </div>
                <div className="col-8">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="-"
                    value={userDetails?.is_registration_complete ?? ''}
                    readOnly
                  />
                </div>
              </div>
              <div className="row align-items-center mb-2">
                <div className="col-2">
                  <label htmlFor="">BirthDate</label>
                </div>
                <div className="col-9">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="-"
                    value={userDetails?.birth_date ?? ''}
                    readOnly
                  />
                </div>
              </div>
              <div className="row align-items-center mb-2">
                <div className="col-2">
                  <label htmlFor="">Trading Exp</label>
                </div>
                <div className="col-9">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="-"
                    value={userDetails?.trading_exp ?? ''}
                    readOnly
                  />
                </div>
              </div>
              <div className="row align-items-center mb-2">
                <div className="col-3">
                  <label htmlFor="">Instagram Link</label>
                </div>
                <div className="col-8">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="-"
                    value={userDetails?.instagram_link ?? ''}
                    readOnly
                  />
                </div>
              </div>
              <div className="row align-items-center mb-2">
                <div className="col-3">
                  <label htmlFor="">Telegram Link</label>
                </div>
                <div className="col-8">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="-"
                    value={userDetails?.telegram_link ?? ''}
                    readOnly
                  />
                </div>
              </div>
              <div className="row align-items-center mb-2">
                <div className="col-3">
                  <label htmlFor="">Youtube Link</label>
                </div>
                <div className="col-8">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="-"
                    value={userDetails?.youtube_link ?? ''}
                    readOnly
                  />
                </div>
              </div>
              <div className="row align-items-center mb-2">
                <div className="col-2">
                  <label htmlFor="">Bio</label>
                </div>
                <div className="col-9">
                  <textarea
                    type="text"
                    className="form-control"
                    placeholder="-"
                    value={userDetails?.bio ?? ''}
                    readOnly
                  />
                </div>
              </div>
            </form>
          ) : null}
        </AppModal>
        <AppModal
          visible={deleteUserModalVisible}
          setVisible={deleteUserModalOpen}
          title="Delete User?"
          isSave
          saveText={'Yes'}
          handleSaveClick={handleDeleteUser}
        >
          <h5>Are you sure to delete this user?</h5>
        </AppModal>
      </CRow>
    </LoadingContainer>
  )
}

export default Users
