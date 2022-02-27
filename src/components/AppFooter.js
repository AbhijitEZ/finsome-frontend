import React from 'react'
import { CFooter } from '@coreui/react'

const AppFooter = () => {
  return (
    <CFooter>
      <div>
        {/* eslint-disable-next-line jsx-a11y/anchor-is-valid  */}
        <a href="#" target="_blank" rel="noopener noreferrer">
          Fansome Admin-panel
        </a>
        <span className="ms-1">&copy; {new Date().getFullYear()}</span>
      </div>
    </CFooter>
  )
}

export default React.memo(AppFooter)
