import React from 'react';
import firebase from 'firebase';
import moment from 'moment';
import PeqQuestionnaire from './PeqQuestionnaire';


class AddTestModal extends React.Component {
  constructor(props) {

    super(props)

    this.alertNull = this.alertNull.bind(this)

  }
  state = {
    title: '',
    time: '',
    aidUsed: '',
    comment: '',
    error: '',
    successMessage: '',
    selectedTest: '',
    selectedCategory: '',
    allQuestions: {},
    videos: {
      'L TEST': '//www.youtube.com/embed/gixqOS8qBNA?rel=0',
      'TUG TEST': '//www.youtube.com/embed/VljdYRXMIE8?rel=0',
      'PEQ TEST': '/images/sliderEx.gif'
    },
    text: {
      'L TEST': 'When you say "Go", begin timing using a stopwatch and instruct the patient to:\n'+
        '\t(1) Stand up from the chair.\n'+
        '\t(2) Walk 3 meters to the marker on the floor at your normal pace.\n'+
        '\t(3) Turn 90 degrees.\n'+
        '\t(4) Continue walking 7 meters.\n'+
        '\t(5) Turn 180 degrees.\n'+
        '\t(6) Return to the marker.\n'+
        '\t(7) Turn 90 degrees.\n'+
        '\t(8) Walk back to the chair at your normal pace.\n'+
        '\t(9) Sit down again.\n'+
        'Stop timing once the patient has sat down and then record the time.',

      'TUG TEST': 'When you say "Go", begin timing using a stopwatch and instruct the patient to:\n'+
        '\t(1) Stand up from the chair.\n'+
        '\t(2) Walk along the line on the floor at your normal pace.\n'+
        '\t(3) Turn 180 degrees.\n'+
        '\t(4) Walk back to the chair at your normal pace.\n'+
        '\t(5) Sit down again.\n'+
        'Stop timing once the patient has sat down and then record the time.',
      'PEQ TEST': 'This is an analog sliding scale.'
    }
  }
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

  componentWillReceiveProps (nextProps) {
    let tests;
    if (nextProps.selectedCategory && nextProps.tests) {
      if(nextProps.tests.hasOwnProperty(nextProps.selectedCategory)) {
        tests = nextProps.tests[nextProps.selectedCategory];
      }
    }
    if(tests) {
      const testData = tests[nextProps.selectedTest];
      if (testData) {
        this.setState({
          title: testData.title,
          time: testData.time,
          aidUsed: testData.aidUsed,
          comment: testData.comment,
          selectedCategory: testData.category,
          date: testData.date,
          successMessage: '',
          selectedTest: nextProps.selectedTest,
          allQuestions: testData.questions
        })
      } else {
        if (nextProps.selectedCategory) {
          this.setState({
            title: '',
            time: '',
            comment: '',
            aidUsed: '',
            date: moment().format('MMMM Do YYYY, h:mm:ss a'),
            selectedCategory: nextProps.selectedCategory,
            successMessage: '',
            selectedTest: nextProps.selectedTest,
            allQuestions: Object.assign({}, nextProps.questions)
          })
        }
      }
    } else {
      this.setState({
        title: '',
        time: '',
        date: moment().format('MMMM Do YYYY, h:mm:ss a'),
        comment: '',
        aidUsed: '',
        successMessage: '',
        selectedCategory: nextProps.selectedCategory,
        selectedTest: nextProps.selectedTest,
        allQuestions: Object.assign({}, nextProps.questions)
      })
    }
  }

  saveMetric (event) {
    event.preventDefault();
    this.setState({
      error: ''
    })
    const {
      selectedTest,
      selectedCategory,
      time,
      aidUsed,
      comment,
      title,
      date,
      allQuestions
    } = this.state;
    const {
      valid,
      error
    } = this.isValid();

    if(valid) {

      const userId = firebase.auth().currentUser.uid;
      let updates = {};
      const testkey = selectedTest || firebase.database().ref()
        .child(`sessions/${userId}/${this.props.formId}/tests`).push().key
      const postData = selectedCategory !== 'PEQ TEST' ? {
        id: testkey,
        formId: this.props.formId,
        category: selectedCategory,
        aidUsed,
        time,
        comment,
        title,
        date
      } : {
        id: testkey,
        formId: this.props.formId,
        category: selectedCategory,
        questions: allQuestions,
        comment,
        title,
        date
      }
      const childNode = `${selectedCategory}/${testkey}`;
      const node = `/sessions/${userId}/${this.props.formId}/tests/${childNode}`;
      updates[node] = postData;
      firebase.database().ref().update(updates)
      .then(() => {
        this.props.resetValue(testkey, this.state.selectedCategory);
        this.setState({
          successMessage: 'Test was saved sucessfully'
        }, () => setTimeout(() => {
          this.setState({
            successMessage: ''
          })
        }, 2000))
      })
      .catch((error) => {
        this.setState({ error: error.message });
      });

    } else {
      this.setState({
        error
      })
    }
  }

  isValid () {
    let valid = true;
    let error = '';
    if(!this.state.title) {
      valid = false;
      error = 'Title is required to save form.'
      return {
        valid,
        error
      }
    }

    if (this.state.selectedCategory === "L TEST" && (this.state.aidUsed === "Select" || this.state.aidUsed === '')) {
      valid = false;
      error = 'Please indicate if the patient used a walking aid or not.'
      return {
        valid,
        error
      }
    }

    const {
      allQuestions
    } = this.state;
    if(this.state.selectedCategory === 'PEQ TEST') {
      Object.keys(allQuestions).forEach((category) => {
        const filteredQuestions =  allQuestions[category]
          .filter(question => question.value || question.value === 0)

          if (category === "Satisfaction") {
            valid = filteredQuestions.length > 1 ? true : false;
          } else if (category === "Utility") {
            valid = filteredQuestions.length > 4 ? true : false;
          }
            error = 'You must answer at least half of the questions from each section.'
            return;
          })
       return {
        valid,
        error
      }
    } else {
      if(!this.state.time) {
        valid = false;
        error = 'Time value is required to save test data'
        return {
          valid,
          error
        }
      }
    }


    return {
      valid,
      error
    }
  }

  onInputChange(name, event) {
		var change = {};
		change[name] = event.target.value;
		this.setState(change);
  }
  handleChange (index, category, answer) {
    const {
      allQuestions
    } = this.state;
    allQuestions[category][index]['value'] = answer
    this.setState({
      allQuestions
    })
  }


  renderTest() {

    if (this.state.selectedCategory === "TUG TEST") {

      return (

        <table className="table table-bordered table-hover">
        <thead>
          <tr>
            <th>Scale Name</th>
            <th>Value (Seconds)</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Time(Seconds)</td>
            <td>
              <input
                id="textinput"
                name="textinput"
                type="text"
                placeholder='Time in Seconds'
                className="form-control input-lg"
                value={this.state.time}
                onChange={this.onInputChange.bind(this, 'time')}
              />
            </td>
          </tr>
        </tbody>
      </table>

      )


    } else if (this.state.selectedCategory === "L TEST") {

      return (

        <table className="table table-bordered table-hover">
        <thead>
          <tr>
            <th>Scale Name</th>
            <th>Value (Seconds)</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Time(Seconds)</td>
            <td>
              <input
                id="textinput"
                name="textinput"
                type="text"
                placeholder='Time in Seconds'
                className="form-control input-lg"
                value={this.state.time}
                onChange={this.onInputChange.bind(this, 'time')}
              />
            </td>
          </tr>
          <tr>
            <td>Walking aid used</td>
            <td>
              <select className="selectpicker" value={this.state.aidUsed} onChange={this.onInputChange.bind(this, 'aidUsed')}>
                <option>Select</option>
                <option>Yes</option>
                <option>No</option>
              </select>
            </td>
          </tr>
        </tbody>
      </table>
      )

    } else if (this.state.selectedCategory === "PEQ TEST") {

      return (

        <PeqQuestionnaire allQuestions={this.state.allQuestions} handleChange={this.handleChange.bind(this)} />

      )

    }

  }

  alertNull() {

    this.setState({error: null})


  }

	render() {
    var errors = this.state.error ? <p> {this.state.error} </p> : '';
		return (
      <div className="modal fade" id="videoModal" tabIndex="-1"
        role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
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
              <label htmlFor="exampleInputEmail1">Title</label>
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
              <label htmlFor="category">Category:</label>
              <span>   {this.state.selectedCategory}</span>
            </div>
            <div className="form-group">
              <label htmlFor="date">Date:</label>
              <span>   {this.state.date}</span>
            </div>
            {this.renderTest()}
            <form style={ this.styles.metric } className="form-horizontal"
              onSubmit={this.saveMetric.bind(this)}>

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
            <div className="panel-group" id="accordion">
              <div className="panel panel-default">
                <div className="panel-heading">
                  <button data-toggle="collapse" data-parent="#accordion"
                    href="#collapse1"
                    className="btn btn-primary pull-left left-arrow">+</button>
                  <h6 data-toggle="collapse" data-parent="#accordion"
                    href="#collapse1" className="panel-title">
                    <span className="accordion_heading">
                      Show Instructions
                    </span>
                  </h6>
                </div>
                <div id="collapse1" className="panel-collapse collapse">
                  <div className="panel-body">
                    <div id="instructions">{this.state.text[this.state.selectedCategory]}</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="panel-group" id="accordion">
              <div className="panel panel-default">
                <div className="panel-heading">
                  <button data-toggle="collapse" data-parent="#accordion"
                    href="#collapse2"
                    className="btn btn-primary pull-left left-arrow">+</button>
                  <h6 data-toggle="collapse" data-parent="#accordion"
                    href="#collapse2" className="panel-title">
                    <span className="accordion_heading">Show Video</span>
                  </h6>
                </div>
                <div id="collapse2"
                  className="panel-collapse collapse videopadding">
                  <div className="panel-body">
                    <iframe id="video" className = "col-xs-12 text-center instructionalVideo" width="720" height="350"
                      src={this.state.videos[this.state.selectedCategory]}
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
    )
	}
}

export default AddTestModal;
