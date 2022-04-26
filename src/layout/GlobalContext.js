/* eslint-disable react/prop-types */
import React from 'react'
import { serviceAuthManager } from 'src/util'

const GlobalContext = React.createContext()

const initialState = {
  country: {
    loading: true,
    result: [],
  },
}

function globalReducer(state, action) {
  switch (action.type) {
    case 'update-countries': {
      return {
        country: {
          result: action.payload,
          loading: false,
        },
      }
    }
    case 'update-countries-fail': {
      return {
        country: {
          result: state.country.result,
          loading: false,
        },
      }
    }
    default: {
      throw new Error(`Unhandled action type: ${action.type}`)
    }
  }
}

const GlobalContextProvider = ({ children }) => {
  const [state, dispatch] = React.useReducer(globalReducer, initialState)

  const fetchCountries = () => {
    serviceAuthManager('/post/countries', 'get', {}, true)
      .then((res) => {
        if (res.data?.data) {
          dispatch({ type: 'update-countries', payload: res.data?.data })
        }
      })
      .catch(() => {
        dispatch({ type: 'update-countries-fail' })
      })
  }

  React.useEffect(() => {
    fetchCountries()
  }, [])

  return <GlobalContext.Provider value={{ state, dispatch }}>{children}</GlobalContext.Provider>
}

const useGlobalContext = () => {
  const context = React.useContext(GlobalContext)
  if (context === undefined) {
    throw new Error('useGlobalContext must be used within a GlobalContextProvider')
  }
  return context
}

export { GlobalContextProvider, useGlobalContext }
