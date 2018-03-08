import React from 'react';

class L_Test_Report_Modal extends React.Component {

  state = {

    test: {},
    lTestReference: "[1] Deathe, A. B., & Miller, W. C. (2005). The L Test of Functional Mobility: Measurement Properties of a Modified Version of the Timed “Up & Go” Test Designed for People With Lower-Limb Amputations. Physical Therapy. doi:10.1093/ptj/85.7.626\n\n"
              + "[2] Rushton, P. W., Miller, W. C., & Deathe, A. B. (2014). Minimal clinically important difference of the L Test for individuals with lower limb amputation: A pilot study. Prosthetics and Orthotics International, 39(6), 470-476. doi:10.1177/0309364614545418\n\n" + "Link:\n[1] https://academic.oup.com/ptj/article/85/7/626/2804973\n" + "[2] https://academic.oup.com/ptj/article/85/7/626/2804973\n\n" + "Video: \nhttps://www.youtube.com/watch?v=gixqOS8qBNA",
    lTestAdditionalResultInterpretation: "Individuals with a lower limb amputation who improve by at least 4.5 s on the L Test after an intervention have likely undergone an important change. [2]"


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

  render() {

    const {test, patientInformation} = this.props;
    const {tugReference, tugAdditionalResultInterpretation} = this.state;

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
              <td>{test.lTime} Seconds</td>
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
            <p>{this.state.lTestAdditionalResultInterpretation}</p>
          </div>

          <div className="card informationCard">
            <strong id = "underline">Comment</strong>
            <p>{test.comment}</p>
          </div>

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
