import React from 'react'
const fuzzysort = require('fuzzysort')

export const useFuzzyHandlerHook = () => {
  const fuzzyHandler = React.useCallback((searchText, targetArry, keys) => {
    return fuzzysort.go(searchText, targetArry, {
      keys,
    })
  }, [])

  return { fuzzyHandler }
}
