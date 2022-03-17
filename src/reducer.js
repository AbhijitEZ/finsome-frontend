const initialState = {
  sidebarShow: true,
  authData: {
    isAuthenticated: false,
    isAuthLoader: true,
    token: null,
    profileData: {},
  },
}

const mainReducer = (state = initialState, { type, ...rest }) => {
  switch (type) {
    case 'set':
      return { ...state, ...rest }
    default:
      return state
  }
}

export default mainReducer
