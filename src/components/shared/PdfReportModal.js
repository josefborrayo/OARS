import React from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { connect } from 'react-redux';

/*This is the component that displays the modal of
the final report (for a completed outcome test) to be generated.*/

class PdfReportModal extends React.Component {

  constructor(props) {

    super(props)
    this.handleStore = this.handleStore.bind(this)
    this.printDocument = this.printDocument.bind(this)

  }

  // Constants
  state={
    test: {},
    range: {
      'TUG TEST': 12
    },

    // references to be displayed in the respective reference cards.
    references: {

      'L TEST': "[1] Deathe, A. B., & Miller, W. C. (2005). The L Test of Functional Mobility: Measurement Properties of a Modified Version of the Timed “Up & Go” Test Designed for People With Lower-Limb Amputations. Physical Therapy. doi:10.1093/ptj/85.7.626\n\n"
                + "[2] Rushton, P. W., Miller, W. C., & Deathe, A. B. (2014). Minimal clinically important difference of the L Test for individuals with lower limb amputation: A pilot study. Prosthetics and Orthotics International, 39(6), 470-476. doi:10.1177/0309364614545418\n\n" + "Link:\n[1] https://academic.oup.com/ptj/article/85/7/626/2804973\n" + "[2] https://academic.oup.com/ptj/article/85/7/626/2804973\n\n" + "Video: \nhttps://www.youtube.com/watch?v=gixqOS8qBNA",
      'TUG TEST': "Instructions:  \n[1] Centers for Disease Control and Prevention. (2017). Timed Up & Go (TUG). Retrieved from https://www.cdc.gov/steadi/pdf/tug_test-a.pdf \n\n" +
                "Video:\nhttps://www.youtube.com/watch?v=VljdYRXMIE8",
      'PEQ TEST': "[1] Legro, M. W., Reiber, G. D., Smith, D. G., Aguila, M. D., Larsen, J., & Boone, D. (1998). Prosthesis evaluation questionnaire for persons with lower limb amputations: Assessing prosthesis-related quality of life. Archives of Physical Medicine and Rehabilitation, 79(8), 931-938. doi:10.1016/s0003-9993(98)90090-9\n\n" + "Link: http://www.archives-pmr.org/article/S0003-9993(98)90090-9/pdf"

    },

    // results to be displayed in the respective reference cards.
    result: {

      'L TEST': "Individuals with a lower limb amputation who improve by at least 4.5 s on the L Test after an intervention have likely undergone an important change. [2]",
      'TUG TEST': "An older adult who takes 12 seconds or more to complete the TUG is at risk for falling.[1]",
      'PEQ TEST': "This prosthesis evaluation questionnaire takes into account the satisfaction and utility subscales and compares against the population averages."

    },

    // these scores are for the national average on the PEQ test.
    natAverage: [

      {value: 71.6},
      {value: 72}

    ],

    totalScore: [

      {value: '0'},
      {value: '0'}

    ],

    // total number of questions in the PEQ
    totalNumber: [

      {value: 3},
      {value: 8}

    ]
  }

  componentDidMount() {
    this.setState({
      test: this.props.test
    })
  }

  componentWillReceiveProps(nextProps) {
    if(nextProps.test) {
      this.setState({
        test: nextProps.test
      })
    }
  }

  /*
  The function that generates the Portable Document Form (PDF)
  */
  printDocument() {

    const {test} = this.state

    var pdfToModal = document.getElementById('pdf-content');

    // prepares and copies data onto document canvas
    html2canvas(pdfToModal)
      .then((canvas) => {

        const imgData = canvas.toDataURL('image/png');
        var pdfMake, pdfFonts, docDefinition;
        var pdfMake = require('pdfmake/build/pdfmake.js');
        var pdfFonts = require('pdfmake/build/vfs_fonts.js');
        pdfMake.vfs = pdfFonts.pdfMake.vfs;
        if (test.category === "L TEST") {
          docDefinition = { content: [{image: imgData, width: 515, height: 830}] };
        } else {

          docDefinition = { content: [{image: imgData, width: 525, height: 800}] };

        }
        pdfMake.createPdf(docDefinition).download(test.title);

        {/*
        var image = new Image();
        image.src = imgData;
        var w = window.open("");
        w.document.write(image.outerHTML);
        */}
      });

  }

  handleStore(totalVal, i) {

    this.state.totalScore[i].value = totalVal;

  }

  /* Renders the test in the previewer*/
  renderTest(whichTest, accessTime, totalQuestions, averageScore, references, result) {

    const { test, patientInformation } = this.props;

    if (whichTest === "TUG TEST") {

      return (
        <div>
        <table className="table table-striped informationCard custab">
          <thead>
            <tr className = "resultsRow">
              <th>Title</th>
              <th>Category</th>
              <th>Metric</th>
              <th>Value</th>
              <th className="text-center">Results</th>
            </tr>
          </thead>
          <tbody>
            <tr className = "resultsRow">
              <td>{test.title}</td>
              <td>{test.category}</td>
              <td>Time</td>
              <td>{test.time}</td>
              <td className="text-center">{accessTime(test.time, test.category)}</td>
            </tr>
          </tbody>
          </table>
          <div className="afterResults">
            <div className="card informationCard">
              <p>{result(test.category)}</p>
            </div>

            <div className="card informationCard">
              <strong id = "underline">Comment</strong>
              <p>{test.comment}</p>
            </div>

            <div className="card referencesCard">
              <strong id = "underline">References</strong>
              <div id="references"><p>{references(test.category)}</p></div>
            </div>
          </div>
          </div>
      )

    } else if (whichTest === "PEQ TEST") {

      return (
        <div>
        <table className="table table-striped informationCard custab">
        <thead>
          <tr>
            <th></th>
            <th>Category</th>
            <th>No. of Questions</th>
            <th className="text-center">Score</th>
            <th className="text-center">Population Average [1]</th>
          </tr>
        </thead>

        {Object.keys(test.questions).map((category, i) => <tr key={i}>
            <td></td>
            <td>{category}</td>
            <td>{totalQuestions(test.questions[category])}/{this.state.totalNumber[i].value}</td>
            <td className="text-center text-success">{averageScore(test.questions[category])}</td>
            {this.handleStore(averageScore(test.questions[category]), i)}
            <td className="text-center text-success">{this.state.natAverage[i].value}</td>
          </tr>

        )}
      </table>
      <div className="afterResults">
        <div className="card informationCard">
          <p>{result(test.category)}</p>
        </div>

        <div className="card informationCard">
          <strong id = "underline">Comment</strong>
          <p>{test.comment}</p>
        </div>

        <div className="card referencesCard">
          <strong id = "underline">References</strong>
          <div id="references"><p>{references(test.category)}</p></div>
        </div>
      </div>
      </div>
      )

    } else if (whichTest === "L TEST" ) {

      return (
        <div>
          <div className>
            <table className="table table-striped informationCard custab lTestTable">
              <thead>
                <tr className = "resultsRow">
                  <th>Title</th>
                  <th>Category</th>
                  <th>Time</th>
                  <th>WA Used?</th>
                  {/*<th className="text-center">Time to Complete L Test(s) [1]</th>*/}
                </tr>
              </thead>
              <tbody>
                <tr className = "resultsRow">
                  <td>{test.title}</td>
                  <td>{test.category}</td>
                  <td>{test.time} Seconds</td>
                  <td>{test.aidUsed}</td>
                </tr>
              </tbody>
            </table>
            <table className = "table table-bordered rightAlignTable pull-right col-md-6">
              <thead>
                <tr className = "bg-primary">
                  <th colSpan="2" className="text-center table-title">Time to Complete L Test(s) [1]</th>
                </tr>
                <tr className = "bg-info">
                  <th className="table-info">Average Time</th>
                  <th>Standard Deviation</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  {patientInformation.limbLev === "Transfemoral" ? <td>Transfemoral: 41.7</td> : patientInformation.limbLev === "Transtibial" ? <td>Transtibial: 29.5</td> : <td>N/A</td>}
                  {patientInformation.limbLev === "Transfemoral" ? <td>Transfemoral: 16.8</td> : patientInformation.limbLev === "Transtibial" ? <td>Transtibial: 12.8</td> : <td>N/A</td>}
                </tr>
                <tr>
                  {patientInformation.limbLost === "Traumatic" ? <td>Traumatic: 26.4</td> : patientInformation.limbLev === "Vascular" ? <td>Vascular: 42.0</td> : <td>Limb Loss Cause: N/A</td>}
                  {patientInformation.limbLost === "Traumatic" ? <td>Traumatic: 7.8</td> : patientInformation.limbLev === "Vascular" ? <td>Vascular: 17.8</td> : <td>Limb Loss Cause: N/A</td>}
                </tr>
                <tr>
                  {patientInformation.age < 55 ? <td>Under 55: 25.4</td> : patientInformation.age >= 55 ? <td>55 or older: 39.7</td> : <td>N/A</td>}
                  {patientInformation.age < 55 ? <td>Under 55: 6.8</td> : patientInformation.age >= 55 ? <td>55 or older: 17.1</td> : <td>N/A</td>}
                </tr>
                <tr>
                  {test.aidUsed === "Yes" ? <td>Aid used: 43.3</td> : test.aidUsed === "No" ? <td>Aid not used: 25.5</td> : <td>N/A</td>}
                  {test.aidUsed === "Yes" ? <td>Aid used: 17.5</td> : test.aidUsed === "No" ? <td>Aid not used: 6.4</td> : <td>N/A</td>}
                </tr>
              </tbody>
            </table>
          </div>
            <div className="afterResults">
              <div className="card informationCard lTestResult">
                <p>{result(test.category)}</p>
              </div>

              <div className="card informationCard">
                <strong id = "underline">Comment</strong>
                <p>{test.comment}</p>
              </div>

              <div className="card referencesCard">
                <strong id = "underline">References</strong>
                <div id="references"><p>{references(test.category)}</p></div>
              </div>
            </div>
        </div>

      )

    }

  }


  render() {
    const { patientInformation, test } = this.props;
    const totalQuestions = (questions => questions.filter(question => question.value || question.value === 0).length);
    const averageScore = (questions) => {
      let sum = 0
      let answeredQuestions = questions.filter(question => question.value || question.value === 0);
      answeredQuestions.forEach(question => sum += question.value);
      return Math.ceil(sum/answeredQuestions.length)
    }

    // eslint-disable-next-line
    const accessTime = (time, category) => {

      // determining result based on metric
      if (category === "TUG TEST") {

        if (time < this.state.range[category]) {
          return (
            <span className="text-center"> The patient is not at risk of falling. </span>
          )
        } else if (time >= this.state.range[category]) {

          return (
            <span className="text-center"> The patient is at risk of falling. </span>
          )

        }

      }
      return (
        <span className="text-center"> L Test results interpretation in progress. Please check references.</span>
      )
    }

    const references = (category) => {

      return (
        <span className="text-center">{this.state.references[category]}</span>
      )
    }

    const result = (category) => {

      return (
        <span className="text-center">{this.state.result[category]}</span>
      )
    }

    /*
    Displays a preview document that will be generated using printDocument()
    */
    return (
      <div className="modal fade" id="pdfModal" tabIndex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-body">
              <button type="button" className="close btn btn-danger" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
              <div className="row">
                <div className="panel panel-default">
                  <div className="panel-heading clearfix">
                    <h3 className="pull-left">Confirm Information</h3>
                    <div className="btn-group pull-right">
                      <button id = "downloadButton" onClick={this.printDocument.bind(this)} className="btn icon-btn btn-lg btn-success">
                      <span className="glyphicon glyphicon-download"></span>  Generate Report
                      </button>

                    </div>
                  </div>
                </div>
              </div>
              <div className="pdf-content border" id="pdf-content">
                <div className="row">
                  <div className="col-md-6" >
                  <img id="headerLogo" className = "modal-logo"  src="/images/aopaLOGO.png" alt="AOPA"/>
                    <div className="card border border-success informationCard top-buffer">
                      <p><strong id = "underline">Clinician Information</strong></p>
                      <p><strong>Clinic: </strong> {this.props.settings.clinic}</p>
                      <p><strong>Clinician: </strong> {this.props.settings.fullname} </p>
                      <p><strong>Tested on: </strong> {test.date}</p>
                      <p><strong>Street Address: </strong> {this.props.settings.streetaddress} </p>
                      <p><strong>City: </strong> {this.props.settings.city} </p>
                      <p><strong>State: </strong> {this.props.settings.state} </p>
                      <p><strong>Zip Code: </strong> {this.props.settings.zip} </p>
                    </div>
                  </div>
                  <div className="col-sm-6">

                    <div className="card table informationCard heightAdjustment">
                      <p><strong id = "underline">Patient Information</strong></p>
                      <p><strong>ID: </strong> {patientInformation.id}</p>
                      <p><strong>Full Name: </strong> {patientInformation.fullname}</p>
                      <p><strong>Sex: </strong> {patientInformation.sex}</p>
                      <p><strong>Age: </strong> {patientInformation.age} years</p>
                      <p><strong>Race: </strong> {patientInformation.race}</p>
                      <p><strong>Weight: </strong> {patientInformation.weight}
                      {this.props.settings.measurementUnit === "Imperial" ? <span> lb(s)</span> : <span> kg(s)</span>}</p>
                      <p><strong>Height: </strong>
                      {this.props.settings.measurementUnit === "Imperial" ? patientInformation.feet + " ft / " + patientInformation.inch + " inch(es)" :
                       patientInformation.centimeter + " cm(s)"}</p>
                      <p><strong>Limb Level: </strong> {patientInformation.limbLevel}</p>
                      <p><strong>K Level: </strong> {patientInformation.kLevel}</p>
                      <p><strong>Cause of Limb Loss: </strong> {patientInformation.limbLossCause}</p>
                      <p><strong>Amputation Side: </strong> {patientInformation.amputationSide}</p>
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="afterCard col-sm-12">
                    {this.renderTest(test.category, accessTime, totalQuestions, averageScore, references, result)}
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

export default connect(state=>({
    settings: state.auth.settings,
}))(PdfReportModal);
