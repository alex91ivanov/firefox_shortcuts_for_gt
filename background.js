// console.log('background.js started');

// var port = browser.runtime.connect();
var getCommands = browser.commands.getAll();
var value;

getCommands.then((commands) => {
  // console.log(commands);
  var commands = commands;
  browser.storage.local.get('commands').then(data => {
    if (data.keys === undefined) {
      // console.log('checking whether an object is stored');
      // console.log(data);
      browser.storage.local.set({commands}).then(success => {}, error => {});
    } else {
      browser.storage.local.get('commands').then(data => {
        // console.log(data);
        // port.postMessage({data})
      });
    }
  });
});
