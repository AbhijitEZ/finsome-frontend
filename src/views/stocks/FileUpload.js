/* eslint-disable react/prop-types */
import React from 'react'
import { CButton } from '@coreui/react'
import { serviceAuthManager } from 'src/util'
import { toast } from 'react-toastify'
import CIcon from '@coreui/icons-react'
import { cilReload } from '@coreui/icons'
import { toastMessage } from 'src/helper/util'

const FileUpload = ({ type, refetchNetworkData }) => {
  const fileRef = React.useRef(null)
  const [loader, setLoader] = React.useState(false)

  const handleFileUploadSelection = () => {
    fileRef.current.click()
  }

  const handleFileChange = (evt) => {
    const fileUploaded = evt.target.files[0]
    const formData = new FormData()
    formData.append('document', fileUploaded)
    setLoader(true)
    serviceAuthManager(`/stock-upload/${type}`, 'post', formData)
      .then((res) => {
        toast.success(res.data?.message || 'CSV upload successfull', {
          position: 'top-center',
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        })
        refetchNetworkData?.()
      })
      .catch((err) => {
        toastMessage('error', err?.response?.data?.message || 'CSV upload unsuccessfull')
      })
      .finally(() => {
        setLoader(false)
      })
  }
  return (
    <React.Fragment>
      <CButton
        type="submit"
        color="primary"
        variant="outline"
        onClick={handleFileUploadSelection}
        disabled={loader}
        style={{ marginRight: 15 }}
      >
        {loader ? <CIcon icon={cilReload} /> : 'Upload CSV'}
      </CButton>
      <input type="file" ref={fileRef} onChange={handleFileChange} style={{ display: 'none' }} />
    </React.Fragment>
  )
}

export default FileUpload
