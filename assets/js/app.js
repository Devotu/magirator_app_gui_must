// Brunch automatically concatenates all files in your
// watched paths. Those paths can be configured at
// config.paths.watched in "brunch-config.js".
//
// However, those files will only be executed if
// explicitly imported. The only exception are files
// in vendor, which are never wrapped in imports and
// therefore are always executed.

// Import dependencies
//
// If you no longer want to use a dependency, remember
// to also remove its path from "config.paths.watched".
import "phoenix_html"

// Import local files
//
// Local files can be imported directly using relative
// paths "./socket" or full ones "web/static/js/socket".

import { viewRender } from "./render.js"
import { templateChannel } from "./templatechannel"
import { dataChannel } from "./datachannel"

//Dev only
document.getElementById('name').value = 'Adam'
document.getElementById('pass').value = 'Hemligt';

const templateSocketUrl = "ws://localhost:4100/socket"
const dataSocketUrl = "ws://localhost:4000/socket"
const tokenUrl = "http://localhost:4000/api/token/"

//Local storages
let templates = {} //App template storage
let datas = {} //App data storage


//Selects what template to render and where (should perhaps be by requesting el?)
function navigate(route, params) {
  switch (route) {
    case 'main':
      viewRender.renderView('main', 'mr', params)
      break;
    case 'deck:list':
      console.log('decklist')
      break;
    default:
      console.log(route)
  }
}


//selects which template belongs to the requested view
var selectTemplate = function (viewName) {

  switch (viewName) {
    case 'main':
      return 'main'

    default:
      break;
  }
}


//selects which data belongs to the requested view
var selectData = function (viewName) {

  switch (viewName) {
    case 'main':
      return 'player:current'

    default:
      break;
  }
}

//Set up and configure components
templateChannel.init(templateSocketUrl)
dataChannel.init(dataSocketUrl)
viewRender.init(
  templateChannel, dataChannel, 
  selectTemplate, selectData,
  templates, datas)


function login() {
  const Http = new XMLHttpRequest();

  let name = document.getElementById('name').value;
  let pass = document.getElementById('pass').value;

  const url = tokenUrl + name + '/' + pass;

  Http.open("GET", url);
  Http.send();
  Http.onreadystatechange = (e) => {
    if (Http.readyState == 4 && Http.status == 200) {
      let response = JSON.parse(Http.responseText)
      dataChannel.connect(response.token)
    }
  }
}


const loginButton = document.getElementById('login');
loginButton.addEventListener('click', login, false);

const showTemplates = document.getElementById('show-templates');
showTemplates.addEventListener('click', () => { console.log(templates) }, false);

const showData = document.getElementById('show-data');
showData.addEventListener('click', () => { console.log(datas) }, false);

const showReady = document.getElementById('show-ready');
showReady.addEventListener('click', () => { console.log(tracksReady) }, false);

const navigateMain = document.getElementById('navigate-main');
navigateMain.addEventListener('click', () => { navigate('main', {}) }, false);



