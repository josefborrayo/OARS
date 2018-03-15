import React from 'react';
/*
This is the PDF report component for the L Test.

All test reports follow a similar format and a new test report
would be added in the format shown below.
*/
class L_Test_Report_Modal extends React.Component {

  /*The state variable for the L test report which are the references
  (APA citation) and any text based result interpretations.*/

  state = {

    lTestReference: "[1] Deathe, A. B., & Miller, W. C. (2005). The L Test of Functional Mobility: Measurement Properties of a Modified Version of the Timed “Up & Go” Test Designed for People With Lower-Limb Amputations. Physical Therapy. doi:10.1093/ptj/85.7.626\n\n"
              + "[2] Rushton, P. W., Miller, W. C., & Deathe, A. B. (2014). Minimal clinically important difference of the L Test for individuals with lower limb amputation: A pilot study. Prosthetics and Orthotics International, 39(6), 470-476. doi:10.1177/0309364614545418\n\n" + "Link:\n[1] https://academic.oup.com/ptj/article/85/7/626/2804973\n" + "[2] https://academic.oup.com/ptj/article/85/7/626/2804973\n\n" + "Video: \nhttps://www.youtube.com/watch?v=gixqOS8qBNA",
    lTestAdditionalResultInterpretation: "Individuals with a lower limb amputation who improve by at least 4.5 s on the L Test after an intervention have likely undergone an important change. [2]"


  }

  /*Component is rendered here.*/
  render() {
    /*Test data and patient information are passed in as props
    and are used to print patient information and information
    pertaining to the test, to the report.

    The previously defined references and results interpretation
    state variables are passed in here to get printed to the report.*/
    const {test, patientInformation} = this.props;
    const {tugReference, tugAdditionalResultInterpretation} = this.state;

    return (

    <div>
      <div className>
        <table className="table table-striped informationCard custab lTestTable">
          <thead>
          {/*This is the header for the table of results.*/}
            <tr className = "resultsRow">
              <th>Title</th>
              <th>Category</th>
              <th>Time</th>
              <th>WA Used?*</th>
            </tr>
          </thead>
          <tbody>
            <tr className = "resultsRow">
              <td>{test.title}</td>
              <td>{test.category}</td>
              <td>{test.lTime} Seconds</td>
              <td>{test.aidUsed}</td>
            </tr>
          </tbody>
        </table>
        {/*This is where the referenced information gets printed.*/}
        <table className = "table table-bordered rightAlignTable pull-right col-md-6">
          <thead>
            <tr className = "bg-primary">
              <th colSpan="2" className="text-center table-title">Time to Complete L Test(s) [1]</th>
            </tr>
            <tr className = "bg-info">
              <th className="table-info">Category</th>
              <th>AT+-SD*</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <span>Limb level: {patientInformation.limbLevel}</span>
              </td>
              <td>
                {patientInformation.limbLevel === "Transfemoral" ? <span>41.7 +- 16.8</span> : patientInformation.limbLevel === "Transtibial" ? <span>29.5 +- 12.8</span>: <span>N/A</span>}
              </td>
            </tr>
            <tr>
              <td>
                <span>Limb level: {patientInformation.limbLossCause}</span>
              </td>
              <td>
              {patientInformation.limbLossCause === "Vascular" ? <span>26.4 +- 7.8</span> : patientInformation.limbLossCause === "Traumatic" ? <span>42.0 +- 17.8</span>: <span>N/A</span>}
              </td>
            </tr>
            <tr>
              <td>
                <span>Under/Over 55: {patientInformation.age}</span>
              </td>
              <td>
                {patientInformation.age < 55 ? <span>25.4</span> : patientInformation.age >= 55 ? <span>39.7</span> : <span>N/A</span>}
              </td>
            </tr>
            <tr>
              <td>
                <span>Walking aid used: {test.aidUsed}</span>
              </td>
              <td>
                {test.aidUsed === "Yes" ? <span>43.3 +- 17.5</span> : test.aidUsed === "No" ? <span>25.5 +- 6.4</span> : <span>N/A</span>}
              </td>

            </tr>
          </tbody>
        </table>
        <span><h4>* AT+-SD = Average Time plus or minus Standard deviation, WA = Walking Aid</h4></span>
      </div>
        {/*Additional results interpretation*/}
        <div className="afterResults">
          <div className="card informationCard lTestResult">
            <p>{this.state.lTestAdditionalResultInterpretation}</p>
          </div>
          {/*Comment (if created)*/}
          <div className="card informationCard">
            <strong id = "underline">Comment</strong>
            <p>{test.comment}</p>
          </div>
          {/*Citations for referenced documents*/}
          <div className="card referencesCard">
            <strong id = "underline">References</strong>
            <div id="references"><p>{this.state.lTestReference}</p></div>
          </div>
        </div>
    </div>



    )

  }

}

export default L_Test_Report_Modal
