import React from 'react';
import {  MeetingOverview } from '@convin/meeting-overview'
import './App.css';


function App() {
  return (
    <div className="App">
      <MeetingOverview
          hostname={process.env.REACT_APP_DOMAIN}
          jwt={process.env.REACT_APP_JWT_TOKEN}
          callId={process.env.REACT_APP_CALL_ID}
        />
    </div>
  );
}

export default App;
