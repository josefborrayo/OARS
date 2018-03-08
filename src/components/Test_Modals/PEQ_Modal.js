import React from 'react';
import firebase from 'firebase';
import moment from 'moment';
import Slider from 'react-rangeslider'

/*This is the component that is the modal for each individual
test.*/

class PEQ_Modal extends React.Component {

  /*Constructor for binding methods.*/
  constructor(props) {

    super(props)

    this.alertNull = this.alertNull.bind(this)

  }

  /*The state variables for this component. The title for the test,
  the time for the test, comment, and testId and selectedTest
  are common across all tests. The aidUsed variable stores whether or
  not the patient used a walking aid for the L test. The videos and text
  variable are for the video and text instructions for each text. The error
  variable stores the error message if for example a title has not been
  entered for a test. The allQuestions array stores the questions from
  PeqQuestionnaire javascript file.*/
  state = {

    title: '',
    allQuestions: {},
    question: '',
    category: 'Satisfaction',
    id: '',
    comment: '',
    error: '',
    successMessage: '',
    testCategory: '',
    date: '',
    videoInstruction: '/images/sliderEx.gif',
    textInstruction: 'This is an analog sliding scale.'
  }
  /*Styles for the modal.*/
  styles = {
		row: {
			'padding': 25
    },
    metric: {
      maxHeight: 500,
      'overflow': 'scroll',
      padding: 25
    }
  };

  /*React lifecycle method: componentWillReceiveProps

  This method is invoked before a mounted component receives new props. This method
  is necessary for updating the test modal content based on which test is selected.*/
  componentWillReceiveProps (nextProps) {
    let modalTest;

    /*The modalTest variable defined above is limited to the scope of this block
    using the let keyword. This component is being rendered in the SessionPage_OutcomeTests
    component and a tests prop (which contains all of the tests in firebase) is passed in
    to this component.*/
    /*When this component is being rendered, new props will be passed in the form
    of the test category which would either be the TUG, L, or PEQ. The modalTest
    variable will store an array of tests from firebase if there is a next test
    that is going to be edited by clicking the edit button (nextProps.tests).*/
    if (nextProps.selectedTest && nextProps.tests) {
        modalTest = nextProps.tests[nextProps.selectedTest];

    }

    /*If tests exist in the modalTest array then the test data that corresponds to the
    specific test id of the test that is going to be edited is stored in the constant
    testData.*/
    if(modalTest) {

      const testData = modalTest[nextProps.testId];


      /*if testData exists, (there exists a test with the specificed id specificed by
      nextProps.testId) then the state variables get set to that of the corresponding
      variables and their values that exist for the test being loaded. */
      if (testData) {
        this.setState({
          title: testData.title,
          allQuestions: testData.questions,
          comment: testData.comment,
          testCategory: testData.category,
          date: testData.date,
          successMessage: '',
        })
      } else {
        /*if testData does not exist then a new test is being created so set the state
        variables to null so it is an empty test as intended.*/
        if (nextProps.selectedTest) {
          this.setState({
            title: '',
            allQuestions: Object.assign({}, nextProps.questions),
            comment: '',
            date: moment().format('MMMM Do YYYY, h:mm:ss a'),
            testCategory: nextProps.selectedTest,
            successMessage: '',
          })
        }
      }
    } else {
      /*If no pre-existing tests exist in the modalTest array
      then a new test is being created so set the input values
      to null to create an empty test as intended.*/
      this.setState({
        title: '',
        allQuestions: Object.assign({}, nextProps.questions),
        date: moment().format('MMMM Do YYYY, h:mm:ss a'),
        comment: '',
        testCategory: nextProps.selectedTest,
        successMessage: ''

      })
    }
  }


  /*This event handles saving tests and is executed when the save button
  of the test modal is clicked.*/
  saveTest (event) {
    event.preventDefault();
    this.setState({
      error: ''
    })
    /*The state variables are passed in as well as the
    valid and error state variables for which the values
    are set in the isValid method and prevents or allows
    submission of the test data to firebase depending on
    the value of valid and error.
    */
    const {
      testCategory,
      allQuestions,
      comment,
      title,
      date
    } = this.state;
    const {
      valid,
      error
    } = this.isValid();

    /*If the form (test modal) is valid, then the test is successfully created
    and submitted to firebase using default firebase functions to store
    the array of relevant information for each test. This is the postData array. */
    if(valid) {

      const userId = firebase.auth().currentUser.uid;
      let updates = {};
      /*testKey is the token string for each test.*/
      const testKey = this.props.testId || firebase.database().ref()
        .child('sessions/'+userId + '/' + this.props.sessionId + '/tests' + testCategory).push().key
        /*The values in postData change depending on the test. This array
        is stored in firebase.*/
      const postData = {
        id: testKey,
        sessionId: this.props.sessionId,
        category: testCategory,
        questions: allQuestions,
        comment,
        title,
        date
      }
      /*The tests in firebase get updated here. Once the save button is clicked,
      the values that were just entered are cleared from the fields. To remember
      these values in the fields, the rememberValues function (defined in the
      SessionPage_OutcomeTests component) is executed to set the firebase id for
      the test as well as the selected test (in string form) which is then passed
      into this component as props and the lifecycle functions in this component will
      set the appropriate state variables using the props to set the input fields essentially
      'remembering' the values.*/
      updates['/sessions/' + userId + '/' + this.props.sessionId + '/tests/' + testCategory + '/' + testKey] = postData;
      firebase.database().ref().update(updates)
      .then(() => {
        this.props.rememberValues(testKey, testCategory)
        this.setState({
          successMessage: 'Test was saved sucessfully'
        })
      })
      .catch((error) => {
        this.setState({ error: error.message });
      });
    /*If the form is not valid then set the state of the error using the error
    constant passed in.*/
    } else {
      this.setState({
        error
      })
    }
  }

  /*This function returns the valid variable with the value set to true
  if the form is valid or false if not and will set the error to the appropriate
  error message depending on the test in which the error is made.*/
  isValid () {
    let valid = true;
    let error = '';

    const {
      allQuestions
    } = this.state;


    Object.keys(allQuestions).forEach((category) => {
      const filteredQuestions =  allQuestions[category]
        .filter(question => question.value)

        if (category === "Satisfaction") {
          valid = filteredQuestions.length > 1 ? true : false;
        } else if (category === "Utility") {
          valid = filteredQuestions.length > 4 ? true : false;
        }
          error = 'You must answer more than half of the questions from each section.'
          return;
        })
     return {
      valid,
      error
    }


    return {
      valid,
      error
    }
  }

  /*Handles any input change by the user and updates the
  appropriate state variable specified by the name variable.*/
  onInputChange(name, event) {

		var change = {};
		change[name] = event.target.value;
		this.setState(change);
  }

  handlePeqSliderValueChange = (index, category, value) => {

    const {
      allQuestions
    } = this.state;
    allQuestions[category][index]['value'] = value
    this.setState({
      allQuestions
    })
  }


  /*This function sets the error to null once a test modal has been closed.*/
  alertNull() {

    this.setState({error: null})

  }

  /*This is where the component is rendered.*/
	render() {

    const horizontalLabels = {
      0: 'Extremely Bad',
      100: 'Really Good'
    }

    const {allQuestions} = this.state;

    var errors = this.state.error ? <p> {this.state.error} </p> : '';

		return (
      <div>
      <div className="modal fade" id="peqQuestionnaireModal" tabIndex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
      <div className="modal-dialog">
      <div className="modal-content">
        <div className="modal-body">
        <button type="button" onClick = {this.alertNull.bind(this)} className="close btn btn-danger"
          data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">&times;</span></button>
        <div className="row">
          <div className="col-sm-6 col-sm-offset-5">
            <h3 className="form-text text-muted">{this.state.title}</h3></div>
          <div className="col-md-10 col-sm-offset-1 well">
            <div className="form-group">
              {errors && <div className="alert alert-danger">{errors}</div>}
              {this.state.successMessage &&
              <div className="alert alert-success">
                {this.state.successMessage}
              </div>}
              <label>Title</label>
              <input
                id="exampleInputtitle1"
                name="title"
                type="text"
                placeholder='Enter Title'
                className="form-control input-lg"
                value={this.state.title}
                onChange={this.onInputChange.bind(this, 'title')}
              />
            </div>
            <div className="form-group">
              <label>Category:</label>
              <span>   {this.state.testCategory}</span>
            </div>
            <div className="form-group">
              <label>Date:</label>
              <span>   {this.state.date}</span>
            </div>
            {/*Once the information that is common across all test modals such as
            the title date and category are rendered, the selected test will be
            rendered using the renderTest function.*/}
            <div className="panel-body">
                <div className="card">
                  <ul className="nav nav-tabs" role="tablist">
                    {Object.keys(allQuestions)
                      .map((category, i) => <li role="presentation" className={i === 0 ? 'col-xs-6 active' : 'col-xs-6'} key={i}><a href={"#tab" + i} data-toggle="tab">Section {i+1}: {category}</a></li>)}
                  </ul>
                  <div className="tab-content">
                    {Object.keys(allQuestions)
                      .map((category, i) =>
                      <div
                        key={i}
                        className={i === 0 ? 'tab-pane fade in active' : 'tab-pane fade'}
                        role="tabpanel"
                        id={"tab" + i}>
                          {allQuestions[category]
                            .map((item, index) =>
                              <div key={index} className="row" style={ this.styles.row }>
                                <div className="form-group">
                                  <h4><b>{item.question}</b></h4>
                                  <div className="col-sm-7">
                                    <Slider
                                      min={0}
                                      max={100}
                                      labels={horizontalLabels}
                                      step={1}
                                      value={item.value}
                                      tooltip={false}
                                      onChange={this.handlePeqSliderValueChange.bind(this, index, item.category)}
                                    />
                                  </div>
                                  <br />
                                  <br />
                                  <br />
                                </div>
                              </div>
                            )}
                      </div>)}
                  </div>
              </div>
            </div>
            <form style={ this.styles.metric } className="form-horizontal"
              onSubmit={this.saveTest.bind(this)}>

              <div className="col-md-12 form-group">
                <textarea className="form-control" placeholder="Write a Comment"
                  id="textarea"
                  onChange={this.onInputChange.bind(this, 'comment')}
                  name="comment" value={this.state.comment}
                />
              </div>
              <div className="col-xs-3 col-xs-offset-1 form-group">
                  <button type="submit" id="singlebutton"
                    name="singlebutton"

                    className="btn btn-lg btn-success col-xs-12">Save</button>
              </div>
              <div className = "row">
                <div className="col-lg-10">
                  {errors && <div className="alert alert-danger">{errors}</div>}
                  {this.state.successMessage &&
                  <div className="alert alert-success">
                    {this.state.successMessage}
                  </div>}
                </div>
              </div>
            </form>
            {/*This is the accordion for the text instructions for each test.
              The text instructions get set based on which test is selected
              in the text state array.*/}
            <div className="panel-group" id="accordion">
              <div className="panel panel-default">
                <div className="panel-heading">
                  <button data-toggle="collapse" data-parent="#accordion"
                    href="#peqTextInstructionPanel"
                    className="btn btn-primary pull-left left-arrow">+</button>
                  <h6 data-toggle="collapse" data-parent="#accordion"
                    href="#peqTextInstructionPanel" className="panel-title">
                    <span className="accordion_heading">
                      Show Instructions
                    </span>
                  </h6>
                </div>
                <div id="peqTextInstructionPanel" className="panel-collapse collapse">
                  <div className="panel-body">
                    {/*This is where the text instructions get printed.*/}
                    <div id="instructions">{this.state.textInstruction}</div>
                  </div>
                </div>
              </div>
            </div>
            {/*This is the accordion for the video instructions for each test.
              The video instructions get set in an iframe based on which test
              is selected in the videos state array.*/}
            <div className="panel-group" id="accordion">
              <div className="panel panel-default">
                <div className="panel-heading">
                  <button data-toggle="collapse" data-parent="#accordion"
                    href="#peqVideoInstructionPanel"
                    className="btn btn-primary pull-left left-arrow">+</button>
                  <h6 data-toggle="collapse" data-parent="#accordion"
                    href="#peqVideoInstructionPanel" className="panel-title">
                    <span className="accordion_heading">Show Video</span>
                  </h6>
                </div>
                <div id="peqVideoInstructionPanel" className="panel-collapse collapse videopadding">
                  <div className="panel-body">
                  {/*This is where the video is rendered (in the iframe)*/}
                    <iframe id="video" className = "col-xs-12 text-center instructionalVideo" width="720" height="350"
                      src={this.state.videoInstruction}
                      frameBorder="0" allowFullScreen></iframe>
                  </div>
                </div>
              </div>
            </div>
            </div>
        </div>
        </div>
      </div>
      </div>
      </div>
      </div>

    )
	}
}

export default PEQ_Modal;
