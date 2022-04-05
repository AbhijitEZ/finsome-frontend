/* eslint-disable react/prop-types */
import React from 'react'
import { CButton, CModal, CModalHeader, CModalTitle, CModalBody, CModalFooter } from '@coreui/react'

const AppModal = ({
  visible,
  setVisible,
  title,
  children,
  isSave = false,
  handleSaveClick,
  saveText,
  scrollable,
}) => {
  return (
    <>
      <CModal
        alignment="center"
        scrollable={scrollable}
        visible={visible}
        onClose={() => setVisible(false)}
      >
        <CModalHeader>
          <CModalTitle>{title}</CModalTitle>
        </CModalHeader>
        <CModalBody>{children}</CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setVisible(false)}>
            Close
          </CButton>
          {isSave ? (
            <CButton color="primary" onClick={handleSaveClick}>
              {saveText ? saveText : 'Save changes'}
            </CButton>
          ) : null}
        </CModalFooter>
      </CModal>
    </>
  )
}

export default AppModal
