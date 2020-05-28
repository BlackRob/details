import React, { useState } from 'react';
import styles from './HeaderPage.module.css';


// Clicking on the span opens a configuration popup
const PopUp = () => {
  const [show, setShow] = useState(false);
  return <div className={styles.header_punctuation}>
    <button onClick={() => { setShow(true) }}>
      <svg alt="Gear by Aya Sofya from the Noun Project"
        xmlns="http://www.w3.org/2000/svg" version="1.1" x="0px" y="0px"
        viewBox="0 0 100 100" fillOpacity="1" stroke="none" marker="none" visibility="visible"
        display="inline" overflow="visible" ><g transform="translate(0,-952.36218)">
          <path d="m 41.99461,957.36222 c -1.4459,0.0197 -2.6889,1.27519 -2.9375,2.4375 
        l -1.625,8.96872 c -3.4821,1.3103 -6.6953,3.1189 -9.5625,5.375 l -8.4688,-3.2812 
        c -1.3045,-0.5063 -2.9347,0.051 -3.6562,1.25 l -8.3438002,13.6562 
        c -0.7065,1.1896 -0.4434,2.8655 0.5938,3.7813 l 6.7188002,5.9687 
        c -0.4295,2.217 -0.7188,4.49976 -0.7188,6.84376 0,2.3379 0.2914,4.6008 0.7188,6.8125 
        l -6.7188002,5.9687 c -1.0523,0.9189 -1.3166,2.6171 -0.5938,3.8125 
        l 8.3438002,13.6562 c 0.731,1.1882 2.3586,1.7307 3.6562,1.2188 l 8.4688,-3.25 
        c 2.8638,2.2517 6.0858,4.0352 9.5625,5.3437 l 1.625,8.9688 
        c 0.2458,1.3658 1.5497,2.4616 2.9375,2.4687 l 16,0 c 1.3981,0.01 2.7211,-1.0927 2.9688,-2.4687 
        l 1.625,-8.9688 c 3.4766,-1.3085 6.6986,-3.092 9.5624,-5.3437 
        l 8.4688,3.25 c 1.2903,0.4956 2.8961,-0.044 3.625,-1.2188 
        l 8.3438,-13.6562 c 0.7301,-1.1886 0.4799,-2.8855 -0.5626,-3.8125 
        l -6.7187,-6 c 0.4188,-2.2115 0.6875,-4.4662 0.6875,-6.7812 0,-2.3211 -0.2666,-4.59556 -0.6875,-6.81246 
        l 6.7187,-6 c 1.0273,-0.9238 1.2764,-2.5985 0.5626,-3.7813 
        l -8.3438,-13.6562 c -0.7195,-1.1853 -2.3279,-1.74 -3.625,-1.25 
        l -8.4688,3.2812 c -2.8672,-2.2561 -6.0804,-4.0647 -9.5624,-5.375 
        l -1.625,-8.96872 c -0.2607,-1.36484 -1.5794,-2.44755 -2.9688,-2.4375 
        l -16,0 z m 2.5312,6 10.9688,0 1.4688,8.03122 
        c 0.2003,1.0667 1.0255,1.9919 2.0624,2.3125 4,1.2574 7.6266,3.3566 10.7188,6.0625 0.8214,0.7151 2.0481,0.9279 3.0625,0.5313 
        l 7.625,-2.9375 5.7187,9.4062 -6.0937,5.4375 
        c -0.8098,0.7259 -1.1726,1.9144 -0.9063,2.9688 0.5626,2.2888 0.8438,4.6951 
        0.8438,7.18746 0,2.4923 -0.2812,4.8987 -0.8438,7.1875 -0.2543,1.0453 
        0.1072,2.2171 0.9063,2.9375 l 6.125,5.4687 -5.75,9.375 -7.625,-2.9375 
        c -1.0144,-0.3966 -2.2411,-0.1838 -3.0625,0.5312 -3.0922,2.706 
        -6.7189,4.8052 -10.7188,6.0625 -1.0369,0.3206 -1.8621,1.2458 -2.0624,2.3125 
        l -1.4688,8.0625 -10.9688,0 -1.4687,-8.0625 c -0.2004,-1.0667 -1.0256,-1.9919 
        -2.0625,-2.3125 -3.9999,-1.2573 -7.6265,-3.3565 -10.7188,-6.0625 -0.8215,-0.715 
        -2.0481,-0.9278 -3.0624,-0.5312 l -7.6563,2.9375 -5.7187,-9.375 6.125,-5.4375 
        c 0.8099,-0.7136 1.1844,-1.8866 0.9374,-2.9375 -0.5718,-2.3158 -0.9062,-4.7308 
        -0.9062,-7.2187 0,-2.48796 0.3344,-4.90286 0.9062,-7.21876 0.259,-1.0599 
        -0.1168,-2.2497 -0.9374,-2.9687 l -6.125,-5.4375 5.75,-9.375 7.625,2.9375 
        c 1.0143,0.3966 2.2409,0.1838 3.0624,-0.5313 3.0922,-2.7059 6.7189,-4.8051 
        10.7188,-6.0625 1.0369,-0.3206 1.8621,-1.2458 2.0625,-2.3125 l 1.4687,-8.03122 
        z m 5.4688,18.00002 c -11.5624,0 -21,9.4375 -21,20.99996 0,11.5624 9.4376,20.9999 
        21,20.9999 11.5625,0 21,-9.4375 21,-20.9999 0,-11.56246 -9.4375,-20.99996 -21,-20.99996 
        z m 0,6 c 8.3198,0 15,6.6801 15,14.99996 0,8.3197 -6.6802,14.9999 -15,14.9999 
        -8.3198,0 -15,-6.6802 -15,-14.9999 0,-8.31986 6.6802,-14.99996 15,-14.99996 z"/></g></svg>
    </button>
    <ExclamationPage showVal={show} setShow={() => { setShow(false) }} />
    <style jsx>
      {`
        svg {
          display: inline-block;
          box-sizing: border-box;
          background-color: inherit;
          padding: none;
          fill: var(--active_outline);
          transition: all 0.2s;
          margin-top: 0.22em;
          width: 0.85em;
          height: 0.85em;
          margin-bottom: 0;
        }
        svg:visited {
          fill: var(--active_outline);
        }
        svg:hover {
          fill: var(--logo_hover);
          cursor: pointer;
          animation: Gear-spin infinite 15s linear;
        }
        svg:active {
          fill: darkslategray;
        }
        @keyframes Gear-spin {
          from {
            transform: rotate(0deg);
          }
        to {
          transform: rotate(360deg);
          }
        }
      `}
    </style>
  </div>
};

const ExclamationPage = ({ showVal, setShow }) => {
  let showHide = styles.hidden;
  if (showVal) {
    showHide = styles.z2;
  }

  return <div className={showHide}>
    <div className={styles.z2_body}>
      <div className={styles.z2_title}>
        Settings
      <span className={styles.z2_hide} onClick={setShow}>x</span>
      </div>
      <p><strong>There are curently no configurable settings</strong></p>
      <p><strong>Game mode:</strong> </p>
      <p><strong>default / collaborative</strong> selected</p>
      <p><strong>creative</strong> <i>coming soon!!!</i></p>
      <p><strong>competitive</strong> <i>coming soon!!!</i></p>
    </div>
  </div>
}


export default PopUp;
