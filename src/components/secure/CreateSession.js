import React from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import firebase, { Promise } from 'firebase';
import { push } from 'react-router-redux';
import { resetNext } from '../../actions/auth';
import SweetAlert from 'react-bootstrap-sweetalert';
import swal from 'sweetalert';
var randtoken = require('rand-token');

/*This is the component that is utilized for entering a patient's information to create a patient settings.*/

class CreateSession extends React.Component {

  /*The constructor for binding methods*/

  constructor(props) {

    super(props);
    this.checkCookies = this.checkCookies.bind(this)
    this.autoCompleteForm = this.autoCompleteForm.bind(this)
    this.handleCollapse = this.handleCollapse.bind(this)
    this.checkIfIdExists = this.checkIfIdExists.bind(this)


  }

  /*The state variables of this component. The majority of these state variables
    are those that belong to the patient information form. The loading variable is for the
    the loading indicator while the sessionId variable is simply the 16 character token that
    is the unique sessionId of the current patient settings. */

  state =  {
    id: '',
    fullname: '',
    sex: 'Select',
    age: '',
    race: 'Select',
    weight: '',
    feet: '',
    inch: '',
    centimeter: '',
    limbLevel: 'Select',
    kLevel: 'Select',
    amputationSide: 'Select',
    limbLossCause: 'Select',
    loading: false,
    sessionId: '',
    measurementUnit: ''

  }

  componentDidMount() {

    const{centimeter} = this.state;
    const userId = firebase.auth().currentUser.uid;
    var ref = firebase.database().ref("/users/" + userId.toString() + "/measurementUnit");
    firebase.database().ref("/users/" + userId.toString() + "/measurementUnit").once('value').then(function(snapshot) {
      var unit = snapshot.val();
      this.setState({measurementUnit: unit})

    }.bind(this));


  }


  /*This is the function that handles the submission of the patient settings patient information form
  to firebase. To address security concerns, the only information being stored is the patient ID as well as
  the unique 16 character sessionId of the form.*/

  handleSubmit(event) {

    event.preventDefault();

    /*This is the array that holds what is essentially the patient form. No data is actually being
    stored but an empty form is being stored in firebase with the actual user input gets stored in a cookie.*/
    const postData = {
      sessionId: randtoken.generate(16),
      id: this.state.id,
      completed: false,
      date: moment().format('MMMM Do YYYY, h:mm:ss a')
    }
    const userId = firebase.auth().currentUser.uid;
    this.storeValues(postData, userId);

    let updates = {};
    updates[`/sessions/${userId}/${postData['sessionId']}`] = postData;
    /*The postData array gets stored in firebase and the app redirects the user to
    the test page.*/
    firebase.database().ref().update(updates)
      .then(() => this.setState({
        loading: false
      }, () => {
        this.props.onRedirect(`/test/${postData['sessionId']}`);
        this.props.onResetNext();
      }))
    .catch((error) => {
      this.setState({ error: error.message });
    });
  }

  /*This function checks if there is a matching ID in firebase with what the users
  has input for the patient ID section to warn the user that they are creating a duplicate
  settings if they continue.*/
  checkIfIdExists() {

      const currentId = this.state.id;
      const userId = firebase.auth().currentUser.uid;

      var ref = firebase.database().ref("/sessions/" + userId.toString());
      ref.once("value")
        .then(function(snapshot) {
          snapshot.forEach(function(childSnapshot) {
            var key = childSnapshot.key;
            var childData = childSnapshot.child("id").val();

            if (currentId === childData) {

              swal({
                button: "Got it",
                text: "Note: There is already a patient on record with this ID.",
                icon: "warning",
                className: "matchingID"
              });

            }
          })
      })

  }

  /*At the time that patient information form is submitted using the continue button,
    this function stores the user input into a cookie so all information is stored
    locally*/
  storeValues(postData, userId) {

    if (this.props.settings.measurementUnit === "Imperial") {

      this.setCookie(this.state.id.toString(), JSON.stringify({

        field1: this.state.id,
        field2: this.state.fullname,
        field3: this.state.sex,
        field4: this.state.age,
        field5: this.state.race,
        field6: this.state.limbLevel,
        field7: this.state.limbLossCause,
        field8: this.state.kLevel,
        field9: this.state.amputationSide,
        field10: this.state.weight,
        field11: this.state.feet,
        field12: this.state.inch,
        field13: userId


      }));

    } else if (this.props.settings.measurementUnit === "Metric") {

      this.setCookie(this.state.id.toString(), JSON.stringify({

        field1: this.state.id,
        field2: this.state.fullname,
        field3: this.state.sex,
        field4: this.state.age,
        field5: this.state.race,
        field6: this.state.limbLevel,
        field7: this.state.limbLossCause,
        field8: this.state.kLevel,
        field9: this.state.amputationSide,
        field10: this.state.weight,
        field11: this.state.centimeter,
        field12: userId


      }));

    }

  }

  /*The function that sets the cookie. This function accepts a name, a value,
  and an expiration date for the cookie. In this case, this function is called
  without passing an expiration date so the cookie persists indefinitely. This can
  be changed by specifying a number of days.*/
  setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    var expires = "expires="+ d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
  }

  /*The function that gets a cookie based on the name*/
  getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for(var i = 0; i <ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) === ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) === 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
  }

  /*This function is for handling any change in input by the user. This function also
  handles changing the K-level information drop down accordion as well as executing the
  autoComplete function which autoCompletes the form if there is data already stored locally
  and warns the user if they are creating a duplicate report.*/
	onInputChange(name, event) {

    var change = {};
		change[name] = event.target.value;
		this.setState(change);

    if (name == 'kLevel') {

      this.handleCollapse()

    }
	}

  /*This is the function that handles completing the form based on a matching patient ID
  from a preexisting cookie. The state variables get set to the cookie values and the input
  field values get set to the values of the state variables.*/
  checkCookies() {

    const userId = firebase.auth().currentUser.uid;
    var cookie = this.getCookie(this.state.id.toString());

    if (cookie) {

      var cookieParse = JSON.parse(cookie);

      if (this.props.settings.measurementUnit === "Imperial") {

        this.setState({
          id: cookieParse.field1,
          fullname: cookieParse.field2,
          sex: cookieParse.field3,
          age: cookieParse.field4,
          race: cookieParse.field5,
          limbLevel: cookieParse.field6,
          limbLossCause: cookieParse.field7,
          kLevel: cookieParse.field8,
          amputationSide: cookieParse.field9,
          weight: cookieParse.field10,
          feet: cookieParse.field11,
          inch: cookieParse.field12
        })
        document.getElementById("patientFeet").value = this.state.feet;
        document.getElementById("patientInch").value = this.state.inch;

      } else if (this.props.settings.measurementUnit === "Metric") {

        this.setState({
          id: cookieParse.field1,
          fullname: cookieParse.field2,
          sex: cookieParse.field3,
          age: cookieParse.field4,
          race: cookieParse.field5,
          limbLevel: cookieParse.field6,
          limbLossCause: cookieParse.field7,
          kLevel: cookieParse.field8,
          amputationSide: cookieParse.field9,
          weight: cookieParse.field10,
          centimeter: cookieParse.field11,

        })
        document.getElementById("patientCentimeter").value = this.state.centimeter;


      }

        document.getElementById("patientIdentity").value = this.state.id;
        document.getElementById("patientName").value = this.state.fullname;
        document.getElementById("patientGender").value = this.state.sex;
        document.getElementById("patientAge").value = this.state.age;
        document.getElementById("patientRace").value = this.state.race;
        document.getElementById("patientLevel").value = this.state.limbLevel;
        document.getElementById("patientCause").value = this.state.limbLossCause;
        document.getElementById("patientKLevel").value = this.state.kLevel;
        document.getElementById("patientSide").value = this.state.amputationSide;
        document.getElementById("patientWeight").value = this.state.weight;





    }


  }

  /*This function simply handles changing the K-Level drop down accordion explanation depending
  on which K-Level the user chooses. This function gets executed in the onInputChange function.*/
  handleCollapse() {

    var levelValue = document.getElementById("patientKLevel").value

    if (levelValue == "K-0") {

      document.getElementById("general").innerHTML = "Level 0: Does not have the ability or potential to ambulate or transfer safely with or without assistance and a prosthesis does not enhance their quality of life or mobility."
      document.getElementById("collapsibleExplanation").innerHTML = "More Information - Level 0"
      this.setState({kLevel: levelValue})

    } else if (levelValue == "K-1") {

      document.getElementById("general").innerHTML = "Level 1: Has the ability or potential to use a prosthesis for transfers or ambulation on level surfaces at fixed cadence. Typical of the limited and unlimited household ambulator."
      document.getElementById("collapsibleExplanation").textContent = "More Information - Level 1"
      this.setState({kLevel: levelValue})


    } else if (levelValue == "K-2") {

      document.getElementById("general").innerHTML = "Level 2: Has the ability or potential for ambulation with the ability to traverse low level environmental barriers such as curbs, stairs, or uneven surfaces. Typical of the limited community ambulator."
      document.getElementById("collapsibleExplanation").textContent = "More Information - Level 2"
      this.setState({kLevel: levelValue})


    } else if (levelValue == "K-3") {

      document.getElementById("general").innerHTML = "Level 3: Has the ability or potential for ambulation with variable cadence. Typical of the community ambulator who has the ability to traverse most environmental barriers and may have vocational, therapeutic, or exercise activity that demands prosthetic utilization beyond simple locomotion."
      document.getElementById("collapsibleExplanation").textContent = "More Information - Level 3"
      this.setState({kLevel: levelValue})

    } else if (levelValue == "K-4") {

      document.getElementById("general").innerHTML = "Level 4: Has the ability or potential for prosthetic ambulation that exceeds basic ambulation skills, exhibiting high impact, stress, or energy levels. Typical of the prosthetic demands of the child, active adult, or athlete."
      document.getElementById("collapsibleExplanation").textContent = "More Information - Level 4"
      this.setState({kLevel: levelValue})

    } else if (levelValue == "Select") {

      document.getElementById("general").innerHTML = "The classification level assigned is used to determine the medical necessity of certain componentry, and thus to match the ultimate LLP to the beneficiary’s clinical needs."
      document.getElementById("collapsibleExplanation").textContent = "More Information - K Levels"
      this.setState({kLevel: levelValue})


    }


  }

  /*This function autoCompletes the form if a matching ID is found in a local cookie and also
  warns the user if a duplicate record is being created. This function gets executed in the
  onInputChange function.*/
  autoCompleteForm() {
    this.checkIfIdExists();
    this.checkCookies();
  }

	render() {
    {/*These two constants are used for enabling and disabling the continue button of the
      patient information form. The button is disabled until all input fields are filled out
      and in the case of the drop down selections, once any option other than the default "Select"
      option is selected.*/}

    const { id, sex, age, race, limbLevel, limbLossCause, kLevel, amputationSide,
      weight, feet, inch, centimeter, fullname, measurementUnit} = this.state;

    const isEnabled = fullname.length > 0 && id.length > 0 && (sex !== "Select") && age.length > 0 &&
    (race !== "Select") && weight.length > 0 && ((feet !== "Select" > 0 && inch !== "Select") || centimeter.length > 0) &&
    (limbLevel !== "Select") && (limbLossCause !== "Select") && (kLevel !== "Select") && (amputationSide !== "Select");

		return (
      <div id="wrapper" className="container">
        <div className="createSession">
          <div className="panel panel-default col-lg panel-primary">
            <div className="panel-heading text-left">Patient Information</div>
              <div className="panel-body text-left">
              {/*The form is being rendered here.*/}
              <form onSubmit={this.handleSubmit.bind(this)} id="PatientForm">
                  <div className="col-sm-12">

                    {/*Patient ID*/}
                    <div className="row">
                        <div className="form-group">
                        <label>Patient ID:</label><br />
                        <input
                          type="number"
                          id="patientIdentity"
                          class="form-control"
                          value={this.state.id}
                          placeholder="ex. 12345"
                          max = "999999999999"
                          onBlur={this.autoCompleteForm.bind(this)}
                          onChange={this.onInputChange.bind(this, 'id')}
                        />
                        </div>
                    </div>

                    {/*Patient Name*/}
                    <div className="row">
                        <div class="form-group">
                          <label for="pName">Full Name:</label><br />
                          <input
                            type="text"
                            class="form-control"
                            id="patientName"
                            maxLength = "25"
                            value={this.state.fullname}
                            onChange={this.onInputChange.bind(this, 'fullname')}
                          />
                        </div>
                    </div>

                    {/*Patient Age*/}
                    <div className="row">
                      <div className="form-group">
                        <label>Age:</label><br />
                          <input
                            type="number"
                            id="patientAge"
                            min = "0"
                            max = "150"
                            class="form-control"
                            value={this.state.age}
                            onChange={this.onInputChange.bind(this, 'age')}
                          />
                      </div>
                    </div>

                    {/*Patient Height: Feet and Inches*/}

                    <div className="row">
                      {measurementUnit === "Imperial" ?
                        <div className="form-group">
                          <label>Height</label>
                          <br />
                          <br />
                          <div id = "feetAndInches" className="form-group">
                            <span>  Feet: </span>
                              <select id = "patientFeet" className = "selectorHeight" class="selectpicker" value = {this.state.feet} onChange={this.onInputChange.bind(this, 'feet')}>
                                <option>Select</option>
                                <option>1</option>
                                <option>2</option>
                                <option>3</option>
                                <option>4</option>
                                <option>5</option>
                                <option>6</option>
                                <option>7</option>
                                <option>8</option>
                              </select>

                            <span>  Inches: </span>
                              <select id = "patientInch" className = "selectorHeight" class="selectpicker" value = {this.state.inch} onChange={this.onInputChange.bind(this, 'inch')}>

                                <option>Select</option>
                                <option>0</option>
                                <option>1</option>
                                <option>2</option>
                                <option>3</option>
                                <option>4</option>
                                <option>5</option>
                                <option>6</option>
                                <option>7</option>
                                <option>8</option>
                                <option>9</option>
                                <option>10</option>
                                <option>11</option>

                              </select>
                          </div>
                        </div>
                          : measurementUnit === "Metric" ?
                        <div className="form-group">
                          <label>Height</label>
                          <br />
                          <br />
                          <div id = "centimeters" className="form-group">


                              <input
                                autoComplete="off"
                                type="number"
                                id="patientCentimeter"
                                value={this.state.centimeter}
                                min="0"
                                max="300"
                                onChange={this.onInputChange.bind(this, 'centimeter')}
                              /><span> Centimeter(s): </span>

                          </div>
                        </div>

                      : <span></span>}
                    </div>

                    <br />

                    {/*Patient Weight*/}
                    <div className="row">

                      {measurementUnit === "Imperial" ?
                      <div class="form-group input-group">
                        <label for="patientWeight">Weight:</label><br />
                        <input
                          autoComplete="off"
                          type="number"
                          min="1"
                          max="1500"
                          class="form-control col-xs-3"
                          id="patientWeight"
                          value={this.state.weight}
                          onChange={this.onInputChange.bind(this, 'weight')}/> lb(s)
                      </div> : measurementUnit === "Metric" ?
                      <div class="form-group input-group">
                        <label for="patientWeight">Weight:</label><br />
                        <input
                          autoComplete="off"
                          type="number"
                          min="1"
                          max="1500"
                          class="form-control col-xs-3"
                          id="patientWeight"
                          value={this.state.weight}
                          onChange={this.onInputChange.bind(this, 'weight')}/> kg(s)
                      </div> : <span></span>}

                    </div>

                    <br />

                    {/*Patient Sex*/}
                    <div className="row">

                        <div class="form-group">
                          <label for="patientGender">Sex:</label><br />
                          <select class="selectpicker" id="patientGender" autoComplete="off" value={this.state.sex} onChange={this.onInputChange.bind(this, 'sex')}>
                            <option>Select</option>
                            <option>Male</option>
                            <option>Female</option>
                          </select>

                        </div>

                    </div>
                    <br />

                    {/*Patient Race*/}
                    <div className="row">

                      <div class="form-group">
                        <label for="patientRace">Race:</label><br />
                        <select class="selectpicker" id="patientRace" autoComplete="off" value={this.state.race} onChange={this.onInputChange.bind(this, 'race')}>
                          <option>Select</option>
                          <option>American Indian</option>
                          <option>Asian</option>
                          <option>African American</option>
                          <option>Hispanic</option>
                          <option>Native Hawaiian</option>
                          <option>White</option>
                          <option>Other</option>
                        </select>

                      </div>

                    </div>
                    <br />

                    {/*Patient Amputation Side*/}
                    <div className="row">

                      <div class="form-group">
                        <label for="patientSide">Amputation Side:</label><br />
                        <select class="selectpicker" id="patientSide" autoComplete="off" value={this.state.amputationSide} onChange={this.onInputChange.bind(this, 'amputationSide')}>
                          <option>Select</option>
                          <option>Right Side</option>
                          <option>Left Side</option>
                          <option>Bilateral</option>
                          <option>Trilateral</option>
                          <option>Quadrilateral</option>
                        </select>

                      </div>
                    </div>

                    <br />

                    {/*Patient Amputation Level*/}
                    <div className="row">

                      <div class="form-group">
                        <label for="patientLevel">Amputation Level:</label><br />
                        <select class="selectpicker" id="patientLevel" autoComplete="off" value={this.state.limbLevel} onChange={this.onInputChange.bind(this, 'limbLevel')}>
                          <option>Select</option>
                          <option>Partial Foot</option>
                          <option>Ankle Disarticulation</option>
                          <option>Knee Disarticulation</option>
                          <option>Hip Disarticulation</option>
                          <option>Transtibial</option>
                          <option>Transfemoral</option>
                          <option>Hemipelvectomy</option>
                        </select>

                      </div>
                    </div>
                    <br />

                    {/*Patient's Cause of Amputation*/}
                    <div className="row">

                      <div class="form-group">
                        <label for="patientLoss">Amputation Cause:</label><br />
                        <select class="selectpicker" id="patientCause" autoComplete="off" value={this.state.limbLossCause} onChange={this.onInputChange.bind(this, 'limbLossCause')}>
                          <option>Select</option>
                          <option>Cancer</option>
                          <option>Congenital Condition</option>
                          <option>Diabetes-Related</option>
                          <option>Vascular</option>
                          <option>Infection</option>
                          <option>Traumatic Incident</option>
                          <option>Unknown</option>
                        </select>

                      </div>

                    </div>
                    <br />

                    {/*Patient K Level*/}
                    <div className="row">

                      <div className="form-group">
                        <label for="patientLoss">K Level:   </label>
                        <div className="panel-group">
                          <div class="panel panel-default">

                            <select id="patientKLevel" autoComplete="off" class="selectpicker" value={this.state.kLevel}  onChange={this.onInputChange.bind(this, 'kLevel')}>
                              <option>Select</option>
                              <option>K-0</option>
                              <option>K-1</option>
                              <option>K-2</option>
                              <option>K-3</option>
                              <option>K-4</option>
                            </select>

                            <div class="panel-heading levels">
                              <a  id = "collapsibleExplanation"  data-toggle="collapse" href="#general">More Information - K Levels</a>
                            </div>


                                <div id="general" className="panel-collapse collapse"><li className="list-group-item">The classification level assigned is used to determine the medical necessity of certain componentry, and thus to match the ultimate LLP to the beneficiary’s clinical needs.</li></div>
                                <div id="level0" className="panel-collapse collapse"><li className="list-group-item">Level 0: Does not have the ability or potential to ambulate or transfer safely with or without assistance and a prosthesis does not enhance their quality of life or mobility.</li></div>
                                <div id="level1" className="panel-collapse collapse"><li className="list-group-item">Level 1: Has the ability or potential to use a prosthesis for transfers or ambulation on level surfaces at fixed cadence. Typical of the limited and unlimited household ambulator.</li></div>
                                <div id="level2" className="panel-collapse collapse"><li className="list-group-item">Level 2: Has the ability or potential for ambulation with the ability to traverse low level environmental barriers such as curbs, stairs, or uneven surfaces. Typical of the limited community ambulator.</li></div>
                                <div id="level3" className="panel-collapse collapse"><li className="list-group-item">Level 3: Has the ability or potential for ambulation with variable cadence. Typical of the community ambulator who has the ability to traverse most environmental barriers and may have vocational, therapeutic, or exercise activity that demands prosthetic utilization beyond simple locomotion.</li></div>
                                <div id="level4" className="panel-collapse collapse"><li className="list-group-item">Level 4: Has the ability or potential for prosthetic ambulation that exceeds basic ambulation skills, exhibiting high impact, stress, or energy levels. Typical of the prosthetic demands of the child, active adult, or athlete.</li></div>


                          </div>
                        </div>
                      </div>
                    </div>
                  <hr />
                  {/*The continue button and the loading symbol state variable*/}
                  {this.state.loading && <div className="loader"></div>}
                  {!isEnabled && <div className="col-xs-6 alert alert-danger">All fields are required</div>}
                  <button disabled={!isEnabled} type="submit" className="btn btn btn-info pull-right">Continue</button>
                  </div>
              </form>
              </div>
          </div>
        </div>
      </div>
		)
	}
}
/*The connect function connects the application to a redux store.
Redux store stores the state of the application. By passing in the
state parameter, this component subscribes to the redux store updates.
Therefore, whenever the store (state of the application) is updated, the
component will have access to the updated state. The dispatch function
is used to dispatch a redux action (function - action creator) which gets
sent to a redux reducer to update the store.*/
export default connect(state => ({
  settings: state.auth.settings
  }), dispatch => ({
	onRedirect: (path) => {
		dispatch(push(path));
	},
	onResetNext: () => {
		dispatch(resetNext());
	},
}))(CreateSession);
