import React from 'react'
import { CSpinner } from '@coreui/react'

const Spinner = () => {
  return (
    <div className="text-center mt-5">
      <CSpinner color="primary" style={{ width: '4rem', height: '4rem' }} />
    </div>
  )
}

export default Spinner
