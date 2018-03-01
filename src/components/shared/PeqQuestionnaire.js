import React from 'react';
import Slider from 'react-rangeslider'

class PeqQuestionnaire extends React.Component {
    state = {
      allQuestions: {},
      question: '',
      category: 'Satisfaction',
      id: ''
    }
    styles = {
      row: {
        'padding': 25
      },
    }

    componentWillMount () {
        this.setState({
          allQuestions: this.props.allQuestions
        })
    }

    componentWillReceiveProps (nextProps) {
      this.setState({
        allQuestions: nextProps.allQuestions
      })
  }

    render() {
      const horizontalLabels = {
        0: 'Extremely Bad',
        100: 'Really Good'
      }
      const {
        allQuestions
      } = this.state;


      return (
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
                                    onChange={(event) => this.props.handleChange(index, item.category, event)}
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
      )
    }
}

export default PeqQuestionnaire;
