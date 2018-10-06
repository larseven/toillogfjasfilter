var deafultUserWords = 'Farmen, skal vi danse, kjendis, rampelys';

function setStatus(msg) {
  // Update status to let user know options were saved.
  var status = document.getElementById('status');
  status.textContent = msg;
  setTimeout(function() {
    status.textContent = '';
  }, 2000);
}

// Enable save button when settings are changed
function onChange() {
  if (document.getElementById('save').disabled) {
    document.getElementById('save').disabled = false;
  }
}

function saveOptions() {
  var userWords = document.getElementById('userWords').value;
  var pluss = document.getElementById('pluss').checked;
  var kjendis = document.getElementById('kjendis').checked;
  var mote = document.getElementById('mote').checked;
  var sport = document.getElementById('sport').checked;
  chrome.storage.sync.set({
    userWords: userWords,
    pluss: pluss,
    kjendis: kjendis,
    mote: mote,
    sport: sport 
  }, function () {
    setStatus('Lagret');
  });
}

function restoreOptions() {
  chrome.storage.sync.get({
    userWords: deafultUserWords,
    pluss: true,
    kjendis: true,
    mote: true,
    sport: false 
  }, function (items) {
    document.getElementById('userWords').value = items.userWords;
    document.getElementById('pluss').checked = items.pluss;
    document.getElementById('kjendis').checked = items.kjendis;
    document.getElementById('mote').checked = items.mote;
    document.getElementById('sport').checked = items.sport;
  });
}

function onDomReady() {
  restoreOptions();

  var save = document.getElementById('save');
  save.addEventListener('click', saveOptions); 
  save.disabled = true; 

  document.getElementById('userWords').addEventListener('input', onChange);
  document.getElementById('pluss').addEventListener('click', onChange);
  document.getElementById('kjendis').addEventListener('click', onChange);
  document.getElementById('mote').addEventListener('click', onChange);
  document.getElementById('sport').addEventListener('click', onChange);
}

document.addEventListener('DOMContentLoaded', onDomReady);
