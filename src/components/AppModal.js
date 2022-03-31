import React from 'react'
import { CButton, CModal, CModalHeader, CModalTitle, CModalBody, CModalFooter } from '@coreui/react'

// eslint-disable-next-line react/prop-types
const AppModal = ({ visible, setVisible, title, children, isSave = false }) => {
  return (
    <>
      <CModal alignment="center" visible={visible} onClose={() => setVisible(false)}>
        <CModalHeader>
          <CModalTitle>{title}</CModalTitle>
        </CModalHeader>
        <CModalBody>{children}</CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setVisible(false)}>
            Close
          </CButton>
          {isSave ? <CButton color="primary">Save changes</CButton> : null}
        </CModalFooter>
      </CModal>
    </>
  )
}

export default AppModal
