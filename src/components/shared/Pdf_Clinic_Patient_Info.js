import React from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { connect } from 'react-redux';
import TUG_Test_Report_Modal from '../PdfReport_Modals/TUG_Test_Report_Modal';
import L_Test_Report_Modal from '../PdfReport_Modals/L_Test_Report_Modal';
import PEQ_Report_Modal from '../PdfReport_Modals/PEQ_Report_Modal';

/*This is the component that displays the modal of
the final report (for a completed outcome test) to be generated.*/

class Pdf_Clinic_Patient_Info extends React.Component {

  constructor(props) {

    super(props)
    this.printDocument = this.printDocument.bind(this)

  }

  // Constants
  state={
    test: {}
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
        docDefinition = { content: [{image: imgData, width: 525, height: 800}] };
        pdfMake.createPdf(docDefinition).download(test.title);

      });

  }

  /* Renders the test in the previewer*/
  renderReport(whichTest) {

    const { test, patientInformation } = this.props;

    if (whichTest === "TUG TEST") {

      return (

        <TUG_Test_Report_Modal test = {this.state.test}/>

      )

    } else if (whichTest === "PEQ TEST") {

      return (
        <PEQ_Report_Modal test = {this.state.test}/>
      )

    } else if (whichTest === "L TEST" ) {

      return (

        <L_Test_Report_Modal test = {this.state.test} patientInformation = {this.props.patientInformation}/>

      )

    }

  }


  render() {

    const {test, patientInformation} = this.props;

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
                    {this.renderReport(test.category)}
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
}))(Pdf_Clinic_Patient_Info);
