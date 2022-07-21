/* eslint-disable react/prop-types */
import { CButton, CCol, CForm, CFormInput, CFormLabel, CRow } from '@coreui/react'
import React from 'react'
import AppModal from 'src/components/AppModal'

const ArticleCatAdd = ({ handleCallback }) => {
  const [addStockModalVisible, handleStockModalVisible] = React.useState(false)
  const [loader, setLoader] = React.useState(false)
  const formRef = React.useRef(null)
  const formResetRef = React.useRef(null)

  const handleOpenModal = () => {
    handleStockModalVisible(true)
  }

  const handleAddSaveModalInt = (e) => {
    formRef.current.click()
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const payload = {
      name: e.target.name.value,
    }

    setLoader(true)
    handleCallback(payload, setLoader, handleStockModalVisible)
  }

  React.useEffect(() => {
    if (!addStockModalVisible) {
      formResetRef?.current?.click()
    }
  }, [addStockModalVisible])

  return (
    <>
      <CButton color="primary" variant="outline" onClick={handleOpenModal}>
        Add
      </CButton>
      <AppModal
        visible={addStockModalVisible}
        setVisible={handleStockModalVisible}
        title="Add Article Category?"
        isSave
        saveText={'Yes'}
        isLoader={loader}
        handleSaveClick={handleAddSaveModalInt}
      >
        <CForm onSubmit={handleSubmit}>
          <CRow className="mb-3">
            <CFormLabel htmlFor="nameStock" className="col-sm-2 col-form-label">
              Name
            </CFormLabel>
            <CCol sm={10}>
              <CFormInput type="text" id="nameStock" name="name" required />
            </CCol>
          </CRow>

          <input type="submit" style={{ display: 'none' }} ref={formRef} />
          <input type="reset" style={{ display: 'none' }} ref={formResetRef} />
        </CForm>
      </AppModal>
    </>
  )
}

export default ArticleCatAdd
