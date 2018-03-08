import React from 'react';

class PEQ_Report_Modal extends React.Component {

  state = {

    test: {},
    peqReference: "[1] Legro, M. W., Reiber, G. D., Smith, D. G., Aguila, M. D., Larsen, J., & Boone, D. (1998). Prosthesis evaluation questionnaire for persons with lower limb amputations: Assessing prosthesis-related quality of life. Archives of Physical Medicine and Rehabilitation, 79(8), 931-938. doi:10.1016/s0003-9993(98)90090-9\n\n" + "Link: http://www.archives-pmr.org/article/S0003-9993(98)90090-9/pdf",
    peqAdditionalResultInterpretation: "This prosthesis evaluation questionnaire takes into account the satisfaction and utility subscales and compares against the population averages.",
    populationAverage: [

      {value: 71.6},
      {value: 72}

    ],
    totalNumber: [

      {value: 3},
      {value: 8}

    ],
    totalScore: [

      {value: '0'},
      {value: '0'}

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

  handleStore(totalVal, i) {

    this.state.totalScore[i].value = totalVal;

  }

  render() {

    const {test} = this.props;
    const {peqReference, peqAdditionalResultInterpretation} = this.state;
    const totalQuestions = (questions => questions.filter(question => question.value || question.value === 0).length);
    const averageScore = (questions) => {
      let sum = 0
      let answeredQuestions = questions.filter(question => question.value || question.value === 0);
      answeredQuestions.forEach(question => sum += question.value);
      return Math.ceil(sum/answeredQuestions.length)
    }

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
          <td className="text-center text-success">{this.state.populationAverage[i].value}</td>
        </tr>

      )}
    </table>
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
