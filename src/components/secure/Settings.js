import React from 'react';
import firebase from 'firebase';
import { connect } from 'react-redux';
import Sidebar from '../shared/Sidebar.js';

{/*This is the settings component.*/}

class Settings extends React.Component {

  /*The state variables for this component are mainly the settings for
  the PDF report for an individual test which will have information
  pertaining to the clinician. This includes the address of the clinic
  as well clinician name and clinic ID.*/
  state = {
    settings: {
      clinicId: '',
      fullname: '',
      clinic: '',
      zip: '',
      email: '',
      city: '',
      state: '',
      streetaddress: '',
      measurementUnit: ''
    },
    successMessage: ''
  }

  /*React lifecycle method: componentDidMount

  This method is invoked after the component has mounted and rendered.*/
  componentDidMount () {
    /*Using the setState method, we can set the values for the state variables
    that were previously set by the user to save (remember) the state of the
    settings page.*/
    this.setState({
      settings: {...this.state.settings, ...this.props.settings},
    })


  }

  /*React lifecycle method: componentWillMount

  This method is invoked before the component mounts. Therefore it is called
  before render().*/
  componentWillReceiveProps(nextProps) {
    if(nextProps.settings) {
      /*Using the setState method, we can set the values for the state variables
      that were previously set by the user to update the state of the settings page.*/
      this.setState({
        settings: {
          ...this.state.settings, ...nextProps.settings}
      })
    }


  }

  /*This function handles changes to any of the state variables.*/
  onInputChange(name, event) {
    const { settings } = this.state;
		settings[name] = event.target.value;
		this.setState({
      settings
    });
  }

  /*This function handles updating the settings.*/
  updateProfile() {

    const {
      settings
    } = this.state;

    /*This snippet serves the purpose of updating the displayed name in
    the sidebar.*/
    var user = firebase.auth().currentUser;
    user.updateProfile({
      displayName: settings.fullname
    }).then(function() {
      // Update successful.
    }).catch(function(error) {
      // An error happened.
    });

      /*This snippet updates the settings variables in the firebase
      database and insessions the user that the settings have been successfully
      updated.*/
      const userId = firebase.auth().currentUser.uid;
      firebase.database().ref().child(`/users/${userId}`)
      .update(settings).then((user) => {
          this.setState({
            successMessage: `Profile was updated successfully`
          })

          window.location.reload();

      });

  }

  /*This is where the Settings component is rendered.*/
	render() {
    const {
      settings
    } = this.state;

    const unitSelected = settings.measurementUnit !== "Select";
    const isEnabled = settings.email.length > 0;


		return (

			<div>
        {/*If there exists settings for the user then it is rendered below.*/}
				{settings && <div className="container">
      <div className="row">
        <div className="col-xs-10 col-sm-10 col-md-10 col-lg-10 col-xs-offset-0 col-sm-offset-0 col-md-offset-0 col-lg-offset-0 toppad settings-panel" >
        <div className='panel panel-info'>
            <div className="panel-heading">
            {/*The clinicians name*/}
            <h3>{settings.fullname}</h3>
            </div>
            <div className="panel-body">
            {this.state.successMessage && <div className="alert alert-success">{this.state.successMessage}</div>}
            <div className="row">
                <div className=" col-md-12 col-lg-12 ">
                <table className="table table-user-information">
                    <tbody>
                    <tr>
                        {/*The clinician ID*/}
                        <td>Clinician ID</td>
                        <td>
                          <input
                            className="form-control"
                            type="number" value={settings.clinicId}
                            placeholder="Clinician ID"
                            onChange={this.onInputChange.bind(this, 'clinicId')}
                          /></td>
                    </tr>
                    <tr>
                        {/*The clinic name*/}
                        <td>Clinic Name</td>
                        <td>
                          <input
                            className="form-control"
                            type="text" value={settings.clinic}
                            placeholder="Clinic Name"
                            onChange={this.onInputChange.bind(this, 'clinic')}
                          /></td>
                    </tr>
                    <tr>
                        {/*The clinician name*/}
                        <td>Clinician Name</td>
                        <td>
                          <input
                            className="form-control"
                            type="text" value={settings.fullname}
                            placeholder="Clinician Name"
                            onChange={this.onInputChange.bind(this, 'fullname')}
                          /></td>
                    </tr>
                    <tr>
                        {/*The clinician email*/}
                        <td>Email Address</td>
                        <td>
                          <input
                            className="form-control"
                            type="text" value={settings.email}
                            placeholder="Email Address"
                            onChange={this.onInputChange.bind(this, 'email')}
                          /></td>
                    </tr>
                    <tr>
                        {/*The clinician address*/}
                        <td>Clinic Address</td>
                        <td>
                          <input
                            className="form-control"
                            type="text" value={settings.streetaddress}
                            placeholder="Street Address"
                            onChange={this.onInputChange.bind(this, 'streetaddress')}
                          /></td>
                    </tr>
                    <tr>
                        {/*The clinician city*/}
                        <td>City</td>
                        <td>
                          <input
                            className="form-control"
                            type="text" value={settings.city}
                            placeholder="City"
                            onChange={this.onInputChange.bind(this, 'city')}
                          /></td>
                    </tr>
                    <tr>
                        {/*The clinician state*/}
                        <td>State</td>
                        <td>
                          <input
                            className="form-control"
                            type="text" value={settings.state}
                            placeholder="State"
                            onChange={this.onInputChange.bind(this, 'state')}
                          /></td>
                    </tr>
                    <tr>
                        {/*The clinician zip code*/}
                        <td>ZIP Code</td>
                        <td>
                          <input
                            className="form-control"
                            type="text" value={settings.zip}
                            placeholder="Zip Code"
                            onChange={this.onInputChange.bind(this, 'zip')}
                          /></td>
                    </tr>
                    <tr>
                        {/*The measurement units for the patient information form*/}
                        <td>Measurement Units</td>
                        <td>
                          <select className="selectpicker pull-right" autoComplete="off" value={settings.measurementUnit} onChange={this.onInputChange.bind(this, 'measurementUnit')}>
                            <option>Select</option>
                            <option>Metric</option>
                            <option>Imperial</option>
                          </select>
                        </td>
                    </tr>
                      {/*The button to update the settings*/}
                    </tbody>
                </table>
                <button disabled = {!isEnabled || !unitSelected} onClick={this.updateProfile.bind(this)} onEnter={this.updateProfile.bind(this)} className="btn icon-btn btn-info pull-right">
                <span className="glyphicon glyphicon-edit"></span>  Update Settings</button>
                {(!unitSelected || !isEnabled) &&
                  <div className=" col-xs-6 alert alert-danger text-left">
                    Please fill out the email address field and select a measurement unit.
                  </div>
                }
                </div>
            </div>
            </div>
        </div>
        </div>
        </div>
        </div>}
			</div>
		)
	}
}

/*The connect function connects the application to a redux store.
Redux store stores the state of the application. By passing in the
state parameter, this component subscribes to the redux store updates.
*/
export default connect(state=>({
	user: state.auth.user,
	settings: state.auth.settings
}))(Settings);
