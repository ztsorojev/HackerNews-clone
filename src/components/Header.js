import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { withRouter } from 'react-router'
import { AUTH_TOKEN } from '../constants'

class Header extends Component {

  render() {
    const authToken = localStorage.getItem(AUTH_TOKEN)

    return (
      <div className="flex pa1 justify-between nowrap orange">
        <div className="flex flex-fixed black">
          <div className="fw7 mr1">Hacker News</div>

        {/*
          Link component that is used here. The one that you’re using in the Header has nothing to do with 
          the Link component that you wrote before, they just happen to have the same name. 
          This Link stems from the react-router-dom package and allows you to navigate between routes inside of your application.
        */}

          <Link to="/top" className="ml1 no-underline black">
            top
          </Link>
          <div className="ml1">|</div>

          <Link to="/" className="ml1 no-underline black">
            new
          </Link>

          <div className="ml1">|</div>
          <Link to="/search" className="ml1 no-underline black">
            search
          </Link>

          {/*
            If already signed in (token available = not null), user can create post
          */}          
          {authToken && (
            <div className="flex">
              <div className="ml1">|</div>
              <Link to="/create" className="ml1 no-underline black">
                submit
              </Link>
            </div>
          )}  
          </div>

          {/*
            If already loged in, user can log out. Else, user can login.
          */} 
          <div className="flex flex-fixed">
            {authToken ? (
              <div
                className="ml1 pointer black"
                onClick={() => {
                  localStorage.removeItem(AUTH_TOKEN)
                  this.props.history.push(`/`)
                }}
              >
                logout
              </div>
            ) : (
              <Link to="/login" className="ml1 no-underline black">
                login
              </Link>
            )}
        </div>
      </div>
    )
  }
}

export default withRouter(Header)