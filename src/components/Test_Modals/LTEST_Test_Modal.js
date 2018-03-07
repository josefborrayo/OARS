import React from 'react';

class LTEST_Test_Modal extends React.component {

  state = {

    textInstructions: {

      'L TEST': 'When you say "Go", begin timing using a stopwatch and instruct the patient to:\n'+
        '\t(1) Stand up from the chair.\n'+
        '\t(2) Walk 3 meters to the marker on the floor at your normal pace.\n'+
        '\t(3) Turn 90 degrees.\n'+
        '\t(4) Continue walking 7 meters.\n'+
        '\t(5) Turn 180 degrees.\n'+
        '\t(6) Return to the marker.\n'+
        '\t(7) Turn 90 degrees.\n'+
        '\t(8) Walk back to the chair at your normal pace.\n'+
        '\t(9) Sit down again.\n'+
        'Stop timing once the patient has sat down and then record the time.'

    },

    videoInstructions: {

      'L TEST': '//www.youtube.com/embed/gixqOS8qBNA?rel=0'

    }


  }

  render() {

    return (



    )

  }



}

export default LTEST_Test_Modal
