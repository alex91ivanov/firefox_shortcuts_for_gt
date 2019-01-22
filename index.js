// console.log('index.js started');

var textArea = document.querySelector('div.input-full-height-wrapper');
var swapLangIcon = document.querySelector('.jfk-button-img:nth-child(1)');
var clearTextIcon = document.querySelectorAll('.jfk-button-img:nth-child(1)')[1];
var inputPanelIconAudio = document.querySelector('.src-tts');
var outputPanelIconAudio = document.querySelector('.res-tts');
var microphone = document.querySelector('#gt-speech');

var click = [new MouseEvent('mousedown'), new MouseEvent('mouseup')];

function emulateClick(elemA, elemB) {
  for (i in click) {
    elemA.dispatchEvent(click[i]);
    if (elemB)
      elemB.dispatchEvent(click[i]);
  }
}


var keys = {
  "swap-languages": "Alt+D",
  "output-audio": "Alt+J",
  "clear-text": "Alt+K",
  "input-audio": "Alt+L",
  "microphone": "Alt+N",
  "focus": "Alt+S"
};

function keydownCapture(e) {
  if (e['swap-languages'])
    keys = e;
  else
  if (e.altKey) {
    // console.log(e.key);
    // console.log(e.keyCode);
    // console.log(keys['swap-languages'].replace('Alt+', ''));
    // console.log(keys['swap-languages'].replace('Alt+', '').charCodeAt());
    // console.log(e.keyCode === keys['swap-languages'].replace('Alt+', '').charCodeAt());
    switch (e.keyCode) {
      case keys['swap-languages'].replace('Alt+', '').charCodeAt():
        e.preventDefault();
        // console.log("D - swap languages");
          swapLangIcon = document.querySelector('.jfk-button-img:nth-child(1)');
        emulateClick(swapLangIcon, swapLangIcon.parentElement);
        break;
      case keys['output-audio'].replace('Alt+', '').charCodeAt():
        e.preventDefault();
        // console.log("J - output panel audio");
          outputPanelIconAudio = document.querySelector('.res-tts');
        emulateClick(outputPanelIconAudio, outputPanelIconAudio.parentElement);
        break;
      case keys['clear-text'].replace('Alt+', '').charCodeAt():
        e.preventDefault();
        // console.log("K - clear text");
          clearTextIcon = document.querySelectorAll('.jfk-button-img:nth-child(1)')[1];
        emulateClick(clearTextIcon, clearTextIcon.parentElement);
        break;
      case keys['input-audio'].replace('Alt+', '').charCodeAt():
        e.preventDefault();
        // console.log("L - input panel audio");
        inputPanelIconAudio = document.querySelector('.src-tts');
        emulateClick(inputPanelIconAudio, inputPanelIconAudio.parentElement);
        break;
      case keys['microphone'].replace('Alt+', '').charCodeAt():
        e.preventDefault();
        // console.log("N - microphone");
          microphone = document.querySelector('#gt-speech');
        emulateClick(microphone, microphone.parentElement)
        break;
      case keys['focus'].replace('Alt+', '').charCodeAt():
        e.preventDefault();
        // console.log("S - focus on input");
          textArea = document.querySelector('div.input-full-height-wrapper')
        textArea.click();
        // emulateClick(textArea, textArea.parentElement);
        break;
    }
  }
}

window.addEventListener('keydown', keydownCapture);


setTimeout(() => {

  var myPort = browser.runtime.connect();

  myPort.postMessage({
    request: "request for commands"
  });

  myPort.onMessage.addListener((commands) => {
    // console.log(JSON.stringify(commands))
    // console.log(commands[0]['name']);
    var o = {};
    for (let command of commands) {
      o[command.name] = command.shortcut;
    }
    // console.log(o['swap-languages']);
    keydownCapture(o)
  });

}, 1000)