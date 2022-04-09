import React from 'react'
import { CCard, CCardBody, CCardHeader, CCol, CButton, CRow } from '@coreui/react'
import { Editor } from '@tinymce/tinymce-react'
import { toast } from 'react-toastify'
import { serviceAuthManager } from 'src/util'
import LoadingContainer from 'src/components/LoadingContainer'

const PrivacyPolicy = () => {
  const editorRef = React.useRef(null)
  const [editContent, setEditContent] = React.useState('')
  const [loading, setLoading] = React.useState(true)

  const fetchPolicy = async () => {
    serviceAuthManager('/privacy-policy')
      .then((res) => {
        if (res.data?.data) {
          setEditContent(res.data.data.content)
        }
      })
      .finally(() => {
        setLoading(false)
      })
  }

  React.useEffect(() => {
    fetchPolicy()
  }, [])

  const log = (evt) => {
    evt.preventDefault()
    if (editorRef.current) {
      const currentData = editorRef.current.getContent()
      setEditContent(currentData)

      serviceAuthManager('/privacy-policy', 'post', {
        content: currentData,
      })
        .then(() => {
          toast.success('Privacy Policy updated', {
            position: 'top-center',
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          })
          console.log('SUCCESSFULL UPDATED POLICY')
        })
        .finally(() => {})
    }
  }

  return (
    <LoadingContainer loading={loading}>
      <CRow>
        <CCol xs>
          <CCard className="mb-4">
            <CCardHeader>
              <h4>Privacy Policy</h4>
            </CCardHeader>
            <CCardBody>
              <Editor
                onInit={(evt, editor) => (editorRef.current = editor)}
                initialValue={editContent || ''}
                init={{
                  height: 500,
                  menubar: false,
                  plugins: [
                    'advlist autolink lists link image charmap print preview anchor',
                    'searchreplace visualblocks code fullscreen',
                    'insertdatetime media table paste code help wordcount',
                  ],
                  toolbar:
                    'undo redo | formatselect | ' +
                    'bold italic backcolor | alignleft aligncenter ' +
                    'alignright alignjustify | bullist numlist outdent indent | ' +
                    'removeformat | help | image | media',
                  content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }',
                }}
              />
              <CButton color="primary" className="mt-4" onClick={log}>
                Save
              </CButton>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </LoadingContainer>
  )
}

export default PrivacyPolicy
