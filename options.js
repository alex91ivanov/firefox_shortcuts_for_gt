// console.log('options.js started');

var swapLanguages = 'swap-languages';
var swapLanguagesInput = document.getElementById(swapLanguages + '--input').addEventListener('keydown', recordShortcut);

var outputAudio = 'output-audio';
var outputAudioInput = document.getElementById(outputAudio + '--input').addEventListener('keydown', recordShortcut);

var clearText = 'clear-text';
var clearTextInput = document.getElementById(clearText + '--input').addEventListener('keydown', recordShortcut);

var inputAudio = 'input-audio';
var inputAudioInput = document.getElementById(inputAudio + '--input').addEventListener('keydown', recordShortcut);

var microphone = 'microphone';
var microphoneInput = document.getElementById(microphone + '--input').addEventListener('keydown', recordShortcut);

var focus = 'focus';
var focusInput = document.getElementById(focus + '--input').addEventListener('keydown', recordShortcut);

var getCommands = browser.commands.getAll();
getCommands.then(updateUI);

var inputs = [swapLanguages, outputAudio, clearText, inputAudio, microphone, focus];

for (let input of inputs) {
  // console.log(input)
  document.getElementById(input + '--update').addEventListener('click', updateShortcut);
  document.getElementById(input + '--reset').addEventListener('click', resetShortcut);
}

function updateUI(commands) {
  console.log('updating')
  for (let i = 0; i < commands.length; i++) {
    var thatInput = inputs.find((result) => {
      return result === commands[i].name;
    });
    if (thatInput !== undefined) {
      document.getElementById(thatInput + '--input').value = commands[i].shortcut;
    }
  }
}

var portFromCS;

function connected(p) {
  portFromCS = p;
  portFromCS.onMessage.addListener((m) => {
    // console.log(m.request);
    let getCommands = browser.commands.getAll();
    getCommands.then(portFromCS.postMessage);
  });
}

browser.runtime.onConnect.addListener(connected);

function recordShortcut(e) {
  e.preventDefault();
  switch (true) {
    case e.altKey:
      this.value = 'Alt' + '+' + e.key.toUpperCase();
      break;
      // case e.ctrlKey:
      //   this.value = 'Ctrl' + '+' + e.key.toUpperCase();
      //   break;
      // case e.shiftKey:
      //   this.value = 'Shift' + '+' + e.key.toUpperCase();
      //   break;
    default:
      if (e.key === 'Shift')
        break;
      if (e.key === 'Alt')
        break;
      if (e.key === 'Control')
        break;
      this.value = 'Alt' + '+' + e.key.toUpperCase();
  }
}

async function updateShortcut() {
  let commands = await browser.commands.getAll();
  let thisCommand = this.id.split('--')[0];
  let thisTagId = thisCommand + '--input';
  let thisElement = document.getElementById(thisTagId);
  if (thisElement.value)
    await browser.commands.update({
      name: thisCommand,
      shortcut: thisElement.value
    });
  document.getElementById('popup-message').innerHTML = 'Updated <br>' + Date();
  let newCommands = browser.commands.getAll();
  newCommands.then(portFromCS.postMessage);
  // console.log('commands updated')

  // console.log(commands)
}

async function resetShortcut() {
  let thisCommand = this.id.split('--')[0];
  browser.commands.reset(thisCommand);

  document.getElementById('popup-message').innerHTML = 'Reset <br>' + Date();
  // console.log('reset confirmed')
  getCommands.then(updateUI);
}