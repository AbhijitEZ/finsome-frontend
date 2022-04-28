/* eslint-disable react/prop-types */
import React from 'react'
import { CFormSelect, CSpinner } from '@coreui/react'
import lodashGet from 'lodash.get'
import { useGlobalContext } from 'src/layout/GlobalContext'

const CountrySelect = ({ value, handleChange, required, ...rest }) => {
  const { state } = useGlobalContext()

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const { result, loading } = React.useMemo(() => lodashGet(state, 'country', {}), [state.country])

  if (loading) {
    return <CSpinner size="sm" />
  }

  return (
    <CFormSelect value={value} onChange={handleChange} required={required} {...rest}>
      <option value="">Select Country</option>
      {result.map((country) => (
        <option value={country.code} key={country._id}>
          {country.name}
        </option>
      ))}
    </CFormSelect>
  )
}

export default CountrySelect
