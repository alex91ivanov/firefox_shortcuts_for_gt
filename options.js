// console.log('options.js started');

window.addEventListener('load', event => {



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


  var inputs = [swapLanguages, outputAudio, clearText, inputAudio, microphone, focus];

  for (let input of inputs) {
    // console.log(input)
    document.getElementById(input + '--update').addEventListener('click', updateShortcut);
    document.getElementById(input + '--reset').addEventListener('click', resetShortcut);
  }

  // var portFromCS;

  // function connected(p) {
  //   portFromCS = p;
  //   portFromCS.onMessage.addListener((m) => {
  //     // console.log(m.request);
  //     let getCommands = browser.storage.sync.get('commands');
  //     getCommands.then(portFromCS.postMessage);
  //   });
  // }

  // browser.runtime.onConnect.addListener(connected);

  browser.storage.sync.get('commands').then(data => {
    updateUI(data);
  });



  function updateUI(data, fromManifest, thisCommand) {
    if (fromManifest === 'fromManifest') {
      var commands = data;
      browser.storage.sync.set({commands});

      for (let i = 0; i < data.length; i++) {
        var thatInput = inputs.find(result => {
          // console.log(data.commands[i].name)
          return result === data[i].name;
        });
        if (thatInput !== undefined) {
          document.getElementById(thatInput + '--input').value = data[i].shortcut;
        }
      }

    } else {
      for (let i = 0; i < data.commands.length; i++) {
        var thatInput = inputs.find(result => {
          // console.log(data.commands[i].name)
          return result === data.commands[i].name;
        });
        if (thatInput !== undefined) {
          document.getElementById(thatInput + '--input').value = data.commands[i].shortcut;
        }
      }
    }
    // portFromCS.postMessage(data.commands)
  }





  function recordShortcut(e) {
    e.preventDefault();
    switch (true) {
      case e.altKey:
        this.value = 'Alt' + '+' + e.key.toUpperCase();
        break;
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
    let thisCommand = this.id.split('--')[0];
    // console.log(thisCommand)
    let thisTagId = thisCommand + '--input';
    let thisElement = document.getElementById(thisTagId);
    let commandsFromStorage = await browser.storage.sync.get('commands');
    let commandsFromManifest = await browser.commands.getAll();
    for (let i of commandsFromStorage.commands) {
      if (i.name === thisCommand) {
        i.shortcut = thisElement.value;
        // console.log(commandsFromStorage)
        // console.log(commandsFromManifest)
        break;
      }
    }
    await browser.storage.sync.set(commandsFromStorage);
    document.getElementById('popup-message').innerHTML = 'Updated <br>' + Date();
    // let newCommands = browser.storage.sync.get('commands');
    // newCommands.then(portFromCS.postMessage);
  }

  async function resetShortcut() {
    let thisCommand = this.id.split('--')[0];
    browser.commands.reset(thisCommand);
    document.getElementById('popup-message').innerHTML = 'Reset <br>' + Date();
    // console.log('reset confirmed')
    commands = await browser.commands.getAll();
    getCommands.then(updateUI(commands, 'fromManifest', thisCommand));
  }
});