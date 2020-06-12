import React from 'react';
import Question from './Question';
import Settings from './Settings';
import styles from './HeaderPage.module.css';

// our beloved header
export default ({ gameMode, setGameMode }) => (
  <header className={styles.App_header}>
    <div className={styles.Header_logo} >details</div>

    <Question />
    <Settings gameMode={gameMode} setGameMode={setGameMode} />
  </header>
)