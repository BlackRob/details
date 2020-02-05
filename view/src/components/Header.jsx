import React from 'react';
import './Header.css';
import Ellipsis from './header_pages/Ellipsis';
import Question from './header_pages/Question';
import Exclamation from './header_pages/Exclamation';

// our header, which has nothing to do with gameplay
export default ({ ...props }) => (
  <header className="App_header">
    <div className="Header_logo" ><a href="http://workingclasshouses.com" alt="logo">details</a></div>
    <Ellipsis />
    <Question />
    <Exclamation />
  </header>
);