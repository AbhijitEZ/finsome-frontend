import React from 'react'
import Spinner from 'src/components/Spinner'

// eslint-disable-next-line react/prop-types
const LoadingContainer = ({ loading, children }) => {
  if (loading) {
    return <Spinner />
  }

  return <React.Fragment>{children}</React.Fragment>
}

export default LoadingContainer
