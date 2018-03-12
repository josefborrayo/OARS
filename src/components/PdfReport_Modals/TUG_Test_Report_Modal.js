import React from 'react';
/*
This is the PDF report component for the Timed Up & Go test.

All test reports follow a similar format and a new test report
would be added in the format shown below.
*/
class TUG_Test_Report_Modal extends React.Component {

  /*State variables for the TUG test which include
  references and results interpretations.*/
  state = {

    test: {},
    tugReference: "Instructions:  \n[1] Centers for Disease Control and Prevention. (2017). Timed Up & Go (TUG). Retrieved from https://www.cdc.gov/steadi/pdf/tug_test-a.pdf \n\n" +
              "Video:\nhttps://www.youtube.com/watch?v=VljdYRXMIE8",
    tugAdditionalResultInterpretation: 'An older adult who takes 12 seconds or more to complete the TUG is at risk for falling.[1]'


  }


  /*The test data is passed in as props in addition
  to the state variables for references and results
  which are printed to the report below.*/
  render() {

    const {test} = this.props;
    const {tugReference, tugAdditionalResultInterpretation} = this.state;

    {/*This constant takes the time metric entered for the test as a parameter
    and returns the result.*/}
    const tugTestResult = (tugTime) => {

        if (tugTime < 12) {
          return (
            <span className="text-center"> The patient is not at risk of falling. </span>
          )
        } else if (tugTime >= 12) {

          return (
            <span className="text-center"> The patient is at risk of falling. </span>
          )

        }

    }

    {/*This is where information gets printed to the report.*/}
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
              <td>{test.tugTime}</td>
              <td className="text-center">{tugTestResult(test.tugTime)}</td>
            </tr>
          </tbody>
          </table>
          <div className="afterResults">
            <div className="card informationCard">
              <p>{tugAdditionalResultInterpretation}</p>
            </div>

            <div className="card informationCard">
              <strong id = "underline">Comment</strong>
              <p>{test.comment}</p>
            </div>

            <div className="card referencesCard">
              <strong id = "underline">References</strong>
              <div id="references"><p>{tugReference}</p></div>
            </div>
          </div>
        </div>

    )

  }

}

export default TUG_Test_Report_Modal
