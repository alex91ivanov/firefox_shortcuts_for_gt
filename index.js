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
  "commands": [{
      "name": "swap-languages",
      "description": "Swap languages",
      "shortcut": "Alt+D"
    },
    {
      "name": "output-audio",
      "description": "Output panel audio",
      "shortcut": "Alt+J"
    },
    {
      "name": "clear-text",
      "description": "Clear text",
      "shortcut": "Alt+K"
    },
    {
      "name": "input-audio",
      "description": "Input panel audio",
      "shortcut": "Alt+L"
    },
    {
      "name": "microphone",
      "description": "Microphone",
      "shortcut": "Alt+N"
    },
    {
      "name": "focus",
      "description": "Focus on input",
      "shortcut": "Alt+S"
    }
  ]
};

var keysFormatted = {
  'swap-languages': 'Alt+Z',
  'output-audio': 'Alt+J',
  'clear-text': 'Alt+K',
  'input-audio': 'Alt+L',
  'microphone': 'Alt+N',
  'focus': 'Alt+S'
}

function assign(data, thisCall) {
  // console.log(thisCall)
  if (thisCall === 'browser.storage.local.get') {
    for (let i of data.commands) {
      // console.log(JSON.stringify(i));
      // console.log(i.name);
      // console.log(i.shortcut);
      keysFormatted[i.name] = i.shortcut;
    }
    // console.log(thisCall)
    // console.log(JSON.stringify(keysFormatted))
    keydownSwitch(null, keysFormatted, 'storage.local.get');
  } else {
    for (let i of data.commands.newValue) {
      // console.log(JSON.stringify(i))
      keysFormatted[i.name] = i.shortcut;
    }
    // console.log(JSON.stringify(data))
    // console.log(JSON.stringify(keysFormatted))
    // console.log(keysFormatted)
    keydownSwitch(null, keysFormatted, 'storage.onChanged');
  }
}

browser.storage.local.get('commands', (data) => {
  assign(data, 'browser.storage.local.get')
});

browser.storage.onChanged.addListener(assign)

function keydownSwitch(event, keysFormatted, thisCall) {
  console.log(thisCall)
  // console.log(keysFormatted)
  if (event === null)
    return;
  // return console.log('do nothing')
  // keydownCapture(keysFormatted);
  else
    keydownCapture(event, keysFormatted);
}

function keydownCapture(e, data, thisCall) {
  // console.log(thisCall);
  if (data)
    keysFormatted = data;
  // else
  if (e.altKey) {
    // console.log(JSON.stringify(keysFormatted))
    // console.log(keysFormatted)
    // console.log(keysFormatted['swap-languages'])
    switch (e.keyCode) {
      case keysFormatted['swap-languages'].replace('Alt+', '').charCodeAt():
        e.preventDefault();
        // console.log("D - swap languages");
        swapLangIcon = document.querySelector('.jfk-button-img:nth-child(1)');
        emulateClick(swapLangIcon, swapLangIcon.parentElement);
        break;
      case keysFormatted['output-audio'].replace('Alt+', '').charCodeAt():
        e.preventDefault();
        // console.log("J - output panel audio");
        outputPanelIconAudio = document.querySelector('.res-tts');
        emulateClick(outputPanelIconAudio, outputPanelIconAudio.parentElement);
        break;
      case keysFormatted['clear-text'].replace('Alt+', '').charCodeAt():
        e.preventDefault();
        // console.log("K - clear text");
        clearTextIcon = document.querySelectorAll('.jfk-button-img:nth-child(1)')[1];
        emulateClick(clearTextIcon, clearTextIcon.parentElement);
        break;
      case keysFormatted['input-audio'].replace('Alt+', '').charCodeAt():
        e.preventDefault();
        // console.log("L - input panel audio");
        inputPanelIconAudio = document.querySelector('.src-tts');
        emulateClick(inputPanelIconAudio, inputPanelIconAudio.parentElement);
        break;
      case keysFormatted['microphone'].replace('Alt+', '').charCodeAt():
        e.preventDefault();
        // console.log("N - microphone");
        microphone = document.querySelector('#gt-speech');
        emulateClick(microphone, microphone.parentElement)
        break;
      case keysFormatted['focus'].replace('Alt+', '').charCodeAt():
        e.preventDefault();
        // console.log("S - focus on input");
        textArea = document.querySelector('div.input-full-height-wrapper')
        textArea.click();
        // emulateClick(textArea, textArea.parentElement);
        break;
    }
  }
}
window.addEventListener('keydown', keydownSwitch);







// setTimeout(() => {

//   var myPort = browser.runtime.connect();

//   myPort.postMessage({
//     request: "request for commands"
//   });

//   myPort.onMessage.addListener((commands) => {
//     console.log(commands)
//     // console.log(JSON.stringify(commands))
//     // console.log(commands[0]['name']);
//     var o = {};
//     for (let command of commands) {
//       o[command.name] = command.shortcut;
//     }
//     // console.log(o['swap-languages']);
//     keydownCapture(o)
//   });

// }, 1000)