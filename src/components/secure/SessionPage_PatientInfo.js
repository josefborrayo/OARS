import React from 'react';
import { connect } from 'react-redux';
import SessionPage_OutcomeTests from '../shared/SessionPage_OutcomeTests';
import firebase from 'firebase';

/*This component is for the patient information displayed on the session page for a
patient. The component for the outcome tests panel (SessionPage_OutcomeTests)
is rendered in this component and displays the outcome test history as well
as outcome tests to choose from.*/

class SessionPage_PatientInfo extends React.Component {

    constructor(props) {

      super(props);
      this.buttonChange = this.buttonChange.bind(this)
      this.applyChange = this.applyChange.bind(this)
      this.fillForm = this.fillForm.bind(this)

    }
    /*The state variables for this component are similar to those defined
      in the CreateForm component as they represent information pertaining
      to the patient. The isFound variable refers to whether or not there
      exists information for the patient. The editPatient variable is for the
      edit button which allows a clinician to edit patient information. The patientInformation
      array stores information for the patient if it exists by checking the props for the
      session using react lifecycle methods.*/
    state = {
      isFound: 'loading',
      patientInformation: {},
      editPatient: false,
      id: '',
      fullname: '',
      sex: '',
      age: '',
      race: '',
      weight: '',
      feet: '',
      inch: '',
      centimeter: '',
      amputationLevel: '',
      kLevel: '',
      amputationSide: '',
      limbLossCause: ''
    }

    /*React lifecycle method: componentWillMount

    This method is invoked before the component mounts. Therefore it is called
    before render().*/
    componentWillMount() {
      /*If there exists a patient record with the id for this particular patient
      then store the information in the patientInformation state array.*/
      if (this.props.sessions && this.props.sessions[this.props.routeParams.id]) {
        this.setState({
          isFound: 'yes',
          patientInformation: this.props.sessions[this.props.routeParams.id]
        })

      }

    }

    /*React lifecycle method: componentWillReceiveProps

    This method is invoked before a mounted component receives new props. This method is necessary
    for updating the patientInformation array in reponse to prop changes which happens if patient
    information is changed. This method follows the same procedure as the componentWillMount method for this component.*/
    componentWillReceiveProps(nextProps) {
        if(nextProps.sessions) {
            if (nextProps.sessions[this.props.routeParams.id]) {
                this.setState({
                  isFound: 'yes',
                  patientInformation: nextProps.sessions[this.props.routeParams.id]
                })

            } else {
              this.setState({
                isFound: 'no'
              })

            }
        }

    }

    componentDidMount() {

      this.fillForm();


    }

    componentDidUpdate() {


      this.fillForm();


    }




    /*This function sets the editPatient variable to true when the edit button of the
    patient information form has been clicked. This sets the patient information fields
    to be changeable.*/
    buttonChange() {

      this.setState({editPatient: true})

  	}


    /*This function executes when the apply button of the patient information form has been
      clicked. It sets the patientInformation state array values to the updated patient Information
      and sets a new cookie after deleting the old one.*/
    applyChange() {


      const {patientInformation} = this.state;
      document.cookie = "username=" + patientInformation.id.toString() + " ; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      patientInformation.fullname = document.getElementById("pname").value;
      patientInformation.id = document.getElementById("identification").value;
      patientInformation.age = document.getElementById("age").value;
      patientInformation.race = document.getElementById("race").value;
      patientInformation.weight = document.getElementById("weight").value;
      patientInformation.sex = document.getElementById("sex").value;
      patientInformation.amputationLevel = document.getElementById("level").value;
      patientInformation.kLevel = document.getElementById("klevel").value;
      patientInformation.amputationSide = document.getElementById("amp").value
      patientInformation.limbLossCause = document.getElementById("loss").value;

      if (this.props.settings.measurementUnit === "Imperial") {

        patientInformation.feet = document.getElementById("feet").value;
        patientInformation.inch = document.getElementById("inches").value;
        this.setCookie(this.state.id.toString(), JSON.stringify({

          field1: patientInformation.id,
          field2: patientInformation.fullname,
          field3: patientInformation.sex,
          field4: patientInformation.age,
          field5: patientInformation.race,
          field6: patientInformation.amputationLevel,
          field7: patientInformation.limbLossCause,
          field8: patientInformation.kLevel,
          field9: patientInformation.amputationSide,
          field10: patientInformation.weight,
          field11: patientInformation.feet,
          field12: patientInformation.inch

        }));

      } else if (this.props.settings.measurementUnit === "Metric") {

        patientInformation.centimeter = document.getElementById("centimeter").value;
        this.setCookie(this.state.id.toString(), JSON.stringify({

          field1: patientInformation.id,
          field2: patientInformation.fullname,
          field3: patientInformation.sex,
          field4: patientInformation.age,
          field5: patientInformation.race,
          field6: patientInformation.amputationLevel,
          field7: patientInformation.limbLossCause,
          field8: patientInformation.kLevel,
          field9: patientInformation.amputationSide,
          field10: patientInformation.weight,
          field11: patientInformation.centimeter

        }));





      }


      /*editPatient is set to false to simply display the patient information values.*/
      this.setState({editPatient: false})

    }

    /*This function handles any change of user input.*/
    onInputChange(name, event) {

      var change = {};
  		change[name] = event.target.value;
  		this.setState(change);

  	}

    /*This function sets a cookie and accepts a cookie name, value, and number
    of days to expire, as parameters.*/
    setCookie(cname, cvalue, exdays) {
      var d = new Date();
      d.setTime(d.getTime() + (exdays*24*60*60*1000));
      var expires = "expires="+ d.toUTCString();
      document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
    }

    /*This function returns a cookie accepting a cookie name as a parameter.*/
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

    /*This function gets a cookie based on the patient ID and sets the
    values for the patient information displayed to the user.*/
    fillForm() {

      const {patientInformation} = this.state
      var cookie = this.getCookie(patientInformation.id);
      /*If a cookie with the corresponding id exists,
      then autocomplete the form */
      if (cookie && !patientInformation.fullname) {


        var cookieParse = JSON.parse(cookie);

        patientInformation.id= cookieParse.field1
        patientInformation.fullname= cookieParse.field2
        patientInformation.sex= cookieParse.field3
        patientInformation.age= cookieParse.field4
        patientInformation.race=cookieParse.field5
        patientInformation.amputationLevel= cookieParse.field6
        patientInformation.limbLossCause= cookieParse.field7
        patientInformation.kLevel=cookieParse.field8
        patientInformation.amputationSide= cookieParse.field9
        patientInformation.weight= cookieParse.field10

        if (this.props.settings.measurementUnit === "Imperial") {

          patientInformation.feet=cookieParse.field11
          patientInformation.inch= cookieParse.field12
          this.setState({
            id: cookieParse.field1,
            fullname: cookieParse.field2,
            sex: cookieParse.field3,
            age: cookieParse.field4,
            race: cookieParse.field5,
            amputationLevel: cookieParse.field6,
            limbLossCause: cookieParse.field7,
            kLevel: cookieParse.field8,
            amputationSide: cookieParse.field9,
            weight: cookieParse.field10,
            feet: cookieParse.field11,
            inch: cookieParse.field12,
            enableButton: true
          });

        } else if (this.props.settings.measurementUnit === "Metric") {

          patientInformation.centimeter=cookieParse.field11
          this.setState({
            id: cookieParse.field1,
            fullname: cookieParse.field2,
            sex: cookieParse.field3,
            age: cookieParse.field4,
            race: cookieParse.field5,
            amputationLevel: cookieParse.field6,
            limbLossCause: cookieParse.field7,
            kLevel: cookieParse.field8,
            amputationSide: cookieParse.field9,
            weight: cookieParse.field10,
            centimeter: cookieParse.field11,
            enableButton: true
          });

        }
      }


    }

	render() {

    /*editPatient, the patientInformation state array and editPatient are passed
    in as constants to be used in the render.*/
    const {
      patientInformation,
      isFound,
      editPatient,
    } = this.state;

		return (

        <div>
          {isFound === 'loading' && <div id="loader"></div>}
          {/*If a record exists for the patient then render the component. Otherwise
            the loading symbol will be displayed indefinitely or until the record is
            found if it does exist.*/}
          {isFound === 'yes' && <div className="container">
          <div className = "testForm">
            <div className="row">
                <div className="displayPanel col-xs-10 col-sm-10 col-md-10 col-lg-10 col-xs-offset-1 col-sm-offset-1 col-md-offset-1 col-lg-offset-1 toppad" >
                {isFound === 'no' && <div className="well"> <h1> Test with specified ID was not found </h1> </div>}
                <div className={patientInformation.completed === 1 ? 'panel panel-success' : 'panel panel-info'}>
                    <div className="panel-heading">
                      Patient Information
                      {/*The buttons for editing and applying changes to the patient
                        information which display depending on whether or not
                        editPatient is true or not.*/}
                      {editPatient === true ?
                        <div className = "editButton glyphicon glyphicon-pencil btn btn-success pull-right" onClick = {this.applyChange.bind(this)}>
                          <span>  Apply</span>
                        </div> :
                        <div className = "editButton glyphicon glyphicon-pencil btn btn-info pull-right" onClick = {this.buttonChange.bind(this)}>
                          <span>  Edit</span>
                        </div>}
                    </div>
                    <div className="panel-body">
                    <div className="row">
                        <div className=" col-md-12 col-lg-12 ">
                        {/*This is the table where patient information is rendered. if the editPatient state variable is true,
                          editable fields will be displayed to the user where the patient information can be changed. Otherwise,
                          the state variable values will be displayed.*/}
                        <table className="table table-user-information">
                            <tbody>
                            <tr>
                                <td>Full Name:</td>
                                <td>{editPatient === true ? <input id = "pname" defaultValue = {patientInformation.fullname} onChange={this.onInputChange.bind(this, 'fullname')} type = "text"/> : patientInformation.fullname}</td>
                            </tr>
                            <tr>
                                <td>ID:</td>
                                <td>{editPatient === true ? <input id = "identification" defaultValue = {patientInformation.id} type = "number"/> : patientInformation.id}</td>
                            </tr>
                            <tr>
                                <td>Age:</td>
                                <td>{editPatient === true ? <input id = "age" defaultValue = {patientInformation.age} type = "number"/> : patientInformation.age}</td>
                            </tr>
                            <tr>
                                <td>Weight:</td>
                                <td>{editPatient === true  ? <input id = "weight" defaultValue = {patientInformation.weight} type = "number"/> : patientInformation.weight}
                                  {this.props.settings.measurementUnit === "Imperial" ? <span> lb(s)</span> : <span> kg(s)</span>}
                                </td>
                            </tr>
                            <tr>
                                <td>Height:</td>
                                <td>{(editPatient === true && patientInformation.feet !== '' && patientInformation.inch !== '') ?
                                    <div>
                                      <span>  Feet: </span>
                                        <select id = "feet" className = "selectorHeight" class="selectpicker" defaultValue = {patientInformation.feet} onChange={this.onInputChange.bind(this, 'feet')}>
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
                                        <select id = "inches" className = "selectorHeight" class="selectpicker" defaultValue = {patientInformation.inch} onChange={this.onInputChange.bind(this, 'inch')}>

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
                                   : (editPatient === false && patientInformation.feet !== '' && patientInformation.inch !== '') ? (patientInformation.feet + " ft / " + patientInformation.inch + " inch") :
                                   (editPatient === true && patientInformation.centimeter !== '') ? <input id = "centimeter" defaultValue = {patientInformation.centimeter} type = "number"/> :
                                   (patientInformation.centimeter)}{this.props.settings.measurementUnit === "Metric" ? <span> cm(s)</span> : <span></span>}</td>
                            </tr>
                            <tr>
                                <td>Sex:</td>
                                <td>{editPatient === true ?
                                  <div>
                                    <select id = "sex" className = "selector" class="selectpicker" defaultValue = {patientInformation.sex} onChange={this.onInputChange.bind(this, 'sex')}>
                                      <option>Male</option>
                                      <option>Female</option>
                                    </select>
                                  </div>
                                  :patientInformation.sex}
                                </td>
                            </tr>
                            <tr>
                                <td>Race:</td>
                                <td>{editPatient === true ?
                                  <div>
                                    <select id = "race" className = "selector" class="selectpicker" defaultValue = {patientInformation.race} onChange={this.onInputChange.bind(this, 'race')}>
                                      <option>American Indian</option>
                                      <option>Asian</option>
                                      <option>African American</option>
                                      <option>Hispanic</option>
                                      <option>Native Hawaiian</option>
                                      <option>White</option>
                                      <option>Other</option>
                                    </select>
                                  </div> :
                                  patientInformation.race}</td>
                            </tr>
                            <tr>
                                <td>Limb Loss Level:</td>
                                <td>{editPatient === true ?
                                  <div>
                                    <select id = "level" className = "selector" class="selectpicker" defaultValue = {patientInformation.amputationLevel} onChange={this.onInputChange.bind(this, 'amputationLevel')}>
                                      <option>Partial Foot</option>
                                      <option>Ankle Disarticulation</option>
                                      <option>Knee Disarticulation</option>
                                      <option>Hip Disarticulation</option>
                                      <option>Transtibial</option>
                                      <option>Transfemoral</option>
                                      <option>Hemipelvectomy</option>
                                    </select>
                                  </div>
                                  :patientInformation.amputationLevel}</td>
                            </tr>
                            <tr>
                                <td>Amputation Side:</td>
                                <td>{editPatient === true ?
                                  <div>
                                    <select id = "amp" className = "selector" class="selectpicker" defaultValue = {patientInformation.amputationSide} onChange={this.onInputChange.bind(this, 'amputationSide')}>
                                      <option>Right Side</option>
                                      <option>Left Side</option>
                                      <option>Bilateral</option>
                                      <option>Trilateral</option>
                                      <option>Quadrilateral</option>
                                    </select>
                                  </div>
                                  :patientInformation.amputationSide}</td>
                            </tr>
                            <tr>
                                <td>Cause of Limb Loss:</td>
                                <td>{editPatient === true ?
                                  <div>
                                    <select id = "loss" className = "selector" class="selectpicker" defaultValue = {patientInformation.limbLossCause} onChange={this.onInputChange.bind(this, 'limbLossCause')}>
                                      <option>Cancer</option>
                                      <option>Congenital Condition</option>
                                      <option>Diabetes-Related Complications</option>
                                      <option>Vascular Disease (non-diabetes related)</option>
                                      <option>Infection (non-diabetes related)</option>
                                      <option>Traumatic Incident</option>
                                      <option>Unknown</option>
                                    </select>
                                  </div>
                                  :patientInformation.limbLossCause}</td>
                            </tr>
                            <tr>
                                <td>K Level:</td>
                                <td>{editPatient === true ?
                                  <div>
                                    <select id = "klevel" className = "selector" class="selectpicker" defaultValue = {patientInformation.kLevel} onChange={this.onInputChange.bind(this, 'kLevel')}>
                                      <option>K-0</option>
                                      <option>K-1</option>
                                      <option>K-2</option>
                                      <option>K-3</option>
                                      <option>K-4</option>
                                    </select>
                                  </div>
                                  :patientInformation.kLevel}</td>
                            </tr>

                            </tbody>
                        </table>
                        {/*The panel that displays the outcome tests pending/completed
                          and allows for an outcome test to be selected are rendered
                          from the SessionPage_OutcomeTests component.*/}
                        <SessionPage_OutcomeTests questions={this.props.questions} patientInformation={patientInformation} settings={this.props.settings} />
                        </div>
                    </div>
                    </div>
                </div>
                </div>
            </div>
            </div>
          </div>}

        </div>)
	}
}

/*The connect function connects the application to a redux store.
Redux store stores the state of the application. By passing in the
state parameter, this component subscribes to the redux store updates.
Therefore, whenever the store (state of the application) is updated, the
component will have access to the updated state.*/
export default connect(state=>({
    user: state.auth.user,
    settings: state.auth.settings,
    sessions: state.session.sessions,
    questions: state.session.questions
}))(SessionPage_PatientInfo);
