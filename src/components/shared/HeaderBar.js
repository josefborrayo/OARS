import React from 'react';
import { Link } from 'react-router';

{/*This is the header bar component.*/}
class HeaderBar extends React.Component {
    render() {
        return (
            <nav className="navbar navbar-inverse navbar-fixed-top">
            <div className="container">
              <div className="navbar-header">
                <a className="navbar-brand" href="/dashboard">
                  <img
                  id="headerLogo"
                  src="/images/aopaLOGO.png"
                  alt="AOPA"
                  />
                </a>
                </div>
              <div className="header-title">
                <h1>Outcome Assessment Reporting System</h1>
              </div>

            </div>
          </nav>
        )
    }
}

export default HeaderBar;
