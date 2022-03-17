import React from 'react'
import { CCard, CCardBody, CCol, CContainer, CRow, CCardImage } from '@coreui/react'
import AppBrandImg from 'src/assets/brand/app-logo.png'

const AboutUs = () => {
  React.useEffect(() => {
    document.title = 'Finsom About US'
  }, [])

  return (
    <div className="bg-light min-vh-100 d-flex flex-row align-items-center">
      <CContainer>
        <div className="w-50 m-auto mb-5">
          <CCardImage orientation="top" src={AppBrandImg} />
        </div>

        <CRow className="justify-content-center">
          <CCol md={9} lg={7} xl={6}>
            <CCard className="mx-4">
              <CCardBody className="p-4">
                <p>
                  {/* eslint-disable-next-line react/no-unescaped-entities */}
                  Welcome to Finsom, your number one source for all things stocks learning. We're
                  dedicated to providing you the very best of training and guidance, with an
                  emphasis on stocks, techniques and better financial planning. Founded in 2022 by
                  [founder name], Finsom has come a long way from its beginnings in [starting
                  location]. When [founder name] first started out, [his/her/their]
                  {/* eslint-disable-next-line react/no-unescaped-entities */}
                  passion for [brand message - e.g. "eco-friendly cleaning products"] drove them to
                  start their own business. We hope you enjoy our products as much as we enjoy
                  {/* eslint-disable-next-line react/no-unescaped-entities */}
                  offering them to you. If you have any questions or comments, please don't hesitate
                  to contact us. Sincerely, [founder name]
                </p>
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  )
}

export default AboutUs
