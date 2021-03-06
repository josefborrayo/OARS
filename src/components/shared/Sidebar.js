import React from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';

/*The sidebar component*/
class Sidebar extends React.Component {

  render() {
    return (
      <div>
      <div className="settings-sidebar">
        <div className="settings-usertitle">
          <div className="settings-usertitle-name" id = "displayName">
            Welcome {this.props.user && this.props.user.displayName}
          </div>
        </div>
        <div className="settings-usermenu">
          <ul className="nav">
            <li>
              <Link activeClassName="active" to="/dashboard">
              <i className="glyphicon glyphicon-home"></i>
              Dashboard </Link>
            </li>
            <li>
              <Link activeClassName="active" to="/create_session">
              <i className="glyphicon glyphicon-plus"></i>
              Create New Session </Link>
            </li>
            <li>
              <Link activeClassName="active" to="/pending_sessions">
              <i className="glyphicon glyphicon-hourglass"></i>
              View Pending Sessions </Link>
            </li>
            <li>
              <Link activeClassName="active" to="/completed_sessions">
              <i className="glyphicon glyphicon-ok"></i>
              View Completed Sessions </Link>
            </li>
            <li>
              <Link activeClassName="active" to="/settings">
              <i className="glyphicon glyphicon-cog"></i>
              Settings </Link>
            </li>
            <li>
              <Link activeClassName="active" to="/logout">
              <i className="glyphicon glyphicon-log-out"></i>
              Logout </Link>
            </li>
            <li>
              <Link activeClassName="active" to="/help">
              <i className="glyphicon glyphicon-flag"></i>
              Help </Link>
            </li>
          </ul>
        </div>
        </div>
        </div>
    )
  }
}
/*The connect function connects the application to a redux store.
Redux store stores the state of the application. By passing in the
state parameter, this component subscribes to the redux store updates
So the state of the variables such as user and settings can be shared
across different components.
*/
export default connect(state=>({
	user: state.auth.user,
	settings: state.auth.settings
}))(Sidebar);
