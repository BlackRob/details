import React from 'react';
import Question from './Question';
import Settings from './Settings';
import styles from './HeaderPage.module.css';

// our header, which has nothing to do with gameplay
export default ({ ...props }) => (
  <header className={styles.App_header}>
    <div className={styles.Header_logo} >details</div>

    <Question />
    <Settings />
  </header>
)