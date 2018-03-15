/*These are the questions for the Prosthesis Evaluation Questionnare.
These questions are stored in an array in the App.js component. Additional
subscales/questions can be added as shown below.*/
export default {
    Satisfaction: [
      {
        id: '1A',
        question: 'How happy you have been with your current prosthesis',
        lowerLimit: 'Not happy',
        upperLimit: 'Very happy',
        category: 'Satisfaction'
      },
      {
        id: '1B',
        question: 'How satisfied you have been with your prosthesis',
        lowerLimit: 'Not satisfied',
        upperLimit: 'Extremely Satisfied',
        category: 'Satisfaction'
      },
      {
        id: '1C',
        question: 'How satisfied you have been with how you are walking',
        lowerLimit: 'Not satisfied',
        upperLimit: 'Extremely satisfied',
        category: 'Satisfaction'
      },
    ],
    Utility: [
      {
        id: '2A',
        question: 'The fit of your prosthesis',
        lowerLimit: 'Very bad',
        upperLimit: 'Very good',
        category: 'Utility'
      },
      {
        id: '2B',
        question: 'The weight of your prosthesis',
        lowerLimit: 'Extremely bad',
        upperLimit: 'Extremely good',
        category: 'Utility'
      },
      {
        id: '2C',
        question: 'Your comfort while standing when using your prosthesis',
        lowerLimit: 'Uncomfortable',
        upperLimit: 'Comfortable',
        category: 'Utility'
      },
      {
        id: '2D',
        question: 'Your comfort while sitting when using your prosthesis',
        lowerLimit: 'Uncomfortable',
        upperLimit: 'Comfortable',
        category: 'Utility'
      },
      {
        id: '2E',
        question: 'How often you felt off balance while using your prosthesis',
        lowerLimit: 'Always',
        upperLimit: 'Never',
        category: 'Utility'
      },
      {
        id: '2F',
        question: 'How much energy it took to use your prosthesis for as long as you needed it.',
        lowerLimit: 'A lot',
        upperLimit: 'None at all',
        category: 'Utility'
      },
      {
        id: '2G',
        question: 'The feel (such as the temperature and texture) of the prosthesis (sock, liner, socket) on your residual limb (stump)',
        lowerLimit: 'Worst possible',
        upperLimit: 'Best Possible',
        category: 'Utility'
      },
      {
        id: '2H',
        question: 'The ease of putting on (donning) your prosthesis',
        lowerLimit: 'Terrible',
        upperLimit: 'Excellent',
        category: 'Utility'
      }
    ]
  }
