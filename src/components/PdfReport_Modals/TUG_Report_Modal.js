import React from 'react';

class TUG_Report_Modal {

  state = {

    test: {},
    tugReference: "Instructions:  \n[1] Centers for Disease Control and Prevention. (2017). Timed Up & Go (TUG). Retrieved from https://www.cdc.gov/steadi/pdf/tug_test-a.pdf \n\n" +
              "Video:\nhttps://www.youtube.com/watch?v=VljdYRXMIE8",
    tugAdditionalResultInterpretation: 'An older adult who takes 12 seconds or more to complete the TUG is at risk for falling.[1]'


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

    const {test, tugReference, tugAdditionalResultInterpretation} = this.props;

    const tugTestResult = (test) => {

        if (test.tugTime < 12) {
          return (
            <span className="text-center"> The patient is not at risk of falling. </span>
          )
        } else if (test.tugTime >= 12) {

          return (
            <span className="text-center"> The patient is at risk of falling. </span>
          )

        }

    }


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
              <td className="text-center">{tugTestResult}</td>
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

export default TUG_Report_Modal
