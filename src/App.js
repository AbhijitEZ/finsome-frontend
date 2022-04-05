import React, { Component } from 'react'
import { Redirect } from 'react-router-dom'
import { HashRouter, Route, Switch } from 'react-router-dom'
import 'react-toastify/dist/ReactToastify.css'
import { ToastContainer } from 'react-toastify'
import './scss/style.scss'

const loading = (
  <div className="pt-3 text-center">
    <div className="sk-spinner sk-spinner-pulse"></div>
  </div>
)

// Containers
const DefaultLayout = React.lazy(() => import('./layout/DefaultLayout'))

// Pages
const Login = React.lazy(() => import('./views/pages/login/Login'))
const AboutUs = React.lazy(() => import('./views/pages/about-us/About-us.js'))
const Page404 = React.lazy(() => import('./views/pages/page404/Page404'))
const Page500 = React.lazy(() => import('./views/pages/page500/Page500'))

// eslint-disable-next-line react/prop-types
const PrivateRoute = ({ children, ...rest }) => {
  const idToken = localStorage.getItem('id_token')
  return <Route {...rest} render={() => (idToken ? children : <Redirect to="/login" />)} />
}

class App extends Component {
  render() {
    return (
      <React.Fragment>
        <HashRouter>
          <React.Suspense fallback={loading}>
            <Switch>
              <Route
                exact
                path="/login"
                name="Login Page"
                render={(props) => <Login {...props} />}
              />
              <Route
                exact
                path="/about-us"
                name="About Us"
                render={(props) => <AboutUs {...props} />}
              />
              <Route exact path="/404" name="Page 404" render={(props) => <Page404 {...props} />} />
              <Route exact path="/500" name="Page 500" render={(props) => <Page500 {...props} />} />
              <PrivateRoute path="/" name="Home">
                <DefaultLayout />
              </PrivateRoute>
            </Switch>
          </React.Suspense>
        </HashRouter>
        <ToastContainer />
      </React.Fragment>
    )
  }
}

export default App
