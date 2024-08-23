import React from 'react';
import './flowchart.css';
import NotesApp from "../components-flowchart/NotesApp";
import NoteProvider from '../components-flowchart/context/NoteContext';
const FlowChart = () => {
  return (
    <div className="flowchart-page">
      <div id='app'>
        {/* <Nav/>
        <Leftpanel/> */}
        <NoteProvider>
          <NotesApp />
        </NoteProvider>
      </div>
    </div>
  )
}

export default FlowChart
