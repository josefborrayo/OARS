import React from 'react';
/*
This is the PDF report component for the Prosthesis Evaluation Questionnaire.

All test reports follow a similar format and a new test report
would be added in the format shown below.
*/
class PEQ_Report_Modal extends React.Component {

  /*State variables for the component which includes
  references and other information necessary for the
  results interpretation.*/
  state = {

    peqReference: "[1] Legro, M. W., Reiber, G. D., Smith, D. G., Aguila, M. D., Larsen, J., & Boone, D. (1998). Prosthesis evaluation questionnaire for persons with lower limb amputations: Assessing prosthesis-related quality of life. Archives of Physical Medicine and Rehabilitation, 79(8), 931-938. doi:10.1016/s0003-9993(98)90090-9\n\n" + "Link: http://www.archives-pmr.org/article/S0003-9993(98)90090-9/pdf",
    peqAdditionalResultInterpretation: "This prosthesis evaluation questionnaire takes into account the satisfaction and utility subscales and compares against the population averages.",
    populationAverage: [

      {value: 71.6},
      {value: 72}

    ],
    totalNumberOfQuestionsInSubscale: [

      {value: 3},
      {value: 8}

    ],
    totalScoreOfEachSubscale: [

      {value: '0'},
      {value: '0'}

    ]

  }


  render() {

    /*Test data and other state variables
    are passed in to get printed to the report.*/
    const {test} = this.props;
    const {peqReference, peqAdditionalResultInterpretation} = this.state;
    {/*This constant utilizes the filter function to create a new array
      of questions that have been answered (have a value equal to or
      greater than 0) and store the length of the array (number of questions
      answered). It takes the a question for a subscale as a parameter
      when called.*/}
    const totalQuestionsAnswered = (questions => questions.filter(question => question.value || question.value === 0).length);

    {/*This constant utilizes the filter function to create a new array
      of questions that have been answered (have a value equal to or
      greater than 0). For each question, its value is added to a sum
      and the total sum value is divided by the total number of questions
      answered. To get the average score for each subscale.*/}
    const averageScore = (questions) => {
      let sum = 0
      let answeredQuestions = questions.filter(question => question.value || question.value === 0);
      answeredQuestions.forEach(question => sum += question.value);
      return Math.ceil(sum/answeredQuestions.length)
    }

    {/*This is where the information gets printed to the report.*/}
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
      {/*This is where the predefined constants are called. The map function is used
        to get the properties of each question stored in the questions array in the test props
        which are then used to calculate averages, etc using the predefined constants*/}
      {Object.keys(test.questions).map((category, i) => <tr key={i}>
          <td></td>
          <td>{category}</td>
          <td>{totalQuestionsAnswered(test.questions[category])}/{this.state.totalNumberOfQuestionsInSubscale[i].value}</td>
          <td className="text-center text-success">{averageScore(test.questions[category])}</td>
          <td className="text-center text-success">{this.state.populationAverage[i].value}</td>
        </tr>

      )}
    </table>
    {/*The comment for the test, other results interpretations, and citations
      for documents are printed here.*/}
    <div className="afterResults">
      <div className="card informationCard">
        <p>{peqAdditionalResultInterpretation}</p>
      </div>

      <div className="card informationCard">
        <strong id = "underline">Comment</strong>
        <p>{test.comment}</p>
      </div>

      <div className="card referencesCard">
        <strong id = "underline">References</strong>
        <div id="references"><p>{peqReference}</p></div>
      </div>
    </div>
    </div>

    )

  }

}

export default PEQ_Report_Modal
