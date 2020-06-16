import React from 'react';
import Question from './Question';
import Settings from './Settings';

// our beloved header
export default ({ gameMode, setGameMode }) => (
  <header className="app_header">
    <div className="header_logo" >details</div>

    <Question />
    <Settings gameMode={gameMode} setGameMode={setGameMode} />
    <style jsx>{`
      .app_header {
        font-size: 2.6em;
        background-image: linear-gradient(to top, #21242b, #383f4d);
        box-sizing: border-box;
        height: auto;
        padding: 0.5vmin 3vmin;
        width: 100%;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
      }
      .header_logo {
        color: var(--active_outline);
        text-align: left;
        flex: 1;
      }  
      @media screen and (orientation: landscape) {
        .app_header {
          font-size: 8vmin;
        } 
      }
      `}
    </style>
  </header>
)