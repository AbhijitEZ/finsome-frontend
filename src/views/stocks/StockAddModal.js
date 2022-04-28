/* eslint-disable react/prop-types */
import { CButton, CCol, CForm, CFormInput, CFormLabel, CRow } from '@coreui/react'
import React from 'react'
import AppModal from 'src/components/AppModal'
import CountrySelect from 'src/components/select/CountrySelect'

const StockAddModel = ({ handleCallback, isCountry }) => {
  const [addStockModalVisible, handleStockModalVisible] = React.useState(false)
  const [selectedCountry, setCountry] = React.useState('')
  const [loader, setLoader] = React.useState(false)
  const formRef = React.useRef(null)
  const formResetRef = React.useRef(null)

  const handleOpenModal = () => {
    handleStockModalVisible(true)
  }
  const handleCountryChange = (e) => {
    setCountry(e.target.value || '')
  }

  const handleAddSaveModalInt = (e) => {
    formRef.current.click()
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const payload = {
      name: e.target.name.value,
      code: e.target.name.value,
      image: e.target.name.image,
    }

    if (isCountry) {
      payload.country_code = selectedCountry
    }
    setLoader(true)
    handleCallback(payload, setLoader, handleStockModalVisible)
  }

  React.useEffect(() => {
    if (!addStockModalVisible) {
      setCountry('')
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
        title="Add Stock?"
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
              <CFormInput type="text" id="nameStock" label="Name" name="name" required />
            </CCol>
          </CRow>

          {isCountry && (
            <CRow className="mb-3">
              <CFormLabel htmlFor="countryCodeStock" className="col-sm-2 col-form-label">
                Country
              </CFormLabel>
              <CCol sm={10}>
                <CountrySelect
                  value={selectedCountry}
                  id="countryCodeStock"
                  handleChange={handleCountryChange}
                  required
                />
              </CCol>
            </CRow>
          )}

          <CRow className="mb-3">
            <CFormLabel htmlFor="codeStock" className="col-sm-2 col-form-label">
              Code
            </CFormLabel>
            <CCol sm={10}>
              <CFormInput type="text" id="codeStock" label="Code" name="code" required />
            </CCol>
          </CRow>
          <CRow className="mb-3">
            <CFormLabel htmlFor="imageStock" className="col-sm-2 col-form-label">
              Image
            </CFormLabel>
            <CCol sm={10}>
              <CFormInput type="text" id="imageStock" label="Image" name="image" />
            </CCol>
          </CRow>
          <input type="submit" style={{ display: 'none' }} ref={formRef} />
          <input type="reset" style={{ display: 'none' }} ref={formResetRef} />
        </CForm>
      </AppModal>
    </>
  )
}

export default StockAddModel
