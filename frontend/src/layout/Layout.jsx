import React from 'react'
import Navigation from '../components/Navigation'
import Footer from '../components/Footer'
import {Outlet} from 'react-router-dom'

const Layout = () => {
  return (
    <div style={{width:"100%"}}>
      <Navigation />
        <Outlet/>
      <Footer/>
    </div>
  )
}

export default Layout
