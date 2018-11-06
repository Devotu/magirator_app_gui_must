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

const templateSocketUrl = "ws://localhost:4100/socket"
const dataSocketUrl = "ws://localhost:4000/socket"
const tokenUrl = "http://localhost:4000/api/token/"

//Local storages
let templates = {} //App template storage
let behaviours = {} //App behaviour storage
let datas = {} //App data storage


//Selects what template to render and where (should perhaps be by requesting el?)
function navigate(params) {
  let route = params.action

  switch (route) {
    case 'main':
      viewRender.renderView('main', 'mr', params.params)
      break;
    case 'deck:new':
      console.log('deck:new')
      viewRender.renderView('deck:new', 'mr', params.params)
      break;
    case 'deck:list':
      console.log('decklist')
      break;
    default:
      console.log(params.action)
  }
}


function extractValue(element) {
  let value = element.value
  
  if (value != null && value != undefined) {
    
    //Is checkbox
    if (value === "on") {
      return document.getElementById(element.id).checked
    }

    return value
  }
}


function gatherInput(paramList) {
  let data = {}

  paramList.forEach(p => {
    let element = document.getElementById(p)

    if (element != null && element != undefined) {
      data[p] = extractValue(element)
    } else {
      console.log("could not find " + p)
    }
  });

  return data
}


//Performes one action
function execute(params) {
  let action = params.action

  switch (params.action) {
    case 'login':
      console.log(action)
      login()
      break;

    case 'deck:new':
      console.log(action)
      let input = gatherInput(params.input)
      console.log(input)
      break;
      
    default:
      console.log(action)
  }
}


//selects which template belongs to the requested view
var selectTemplate = function (viewName) {

  switch (viewName) {
    case 'main':
    case 'login':
    case 'deck:new':
      return viewName
      
    default:
    return 'none' //No template needed
  }
}


//selects which data belongs to the requested view
var selectData = function (viewName) {

  switch (viewName) {
    case 'main':
      return 'player:current'

    case 'login':
    case 'deck:new':
    default:
      return 'none' //No data needed
  }
}


//Special function as it is needed to access the data api
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

      let nav = {
        action: 'main',
        params: {},
        input: []
      }

      navigate(nav)
    }
  }
}


//Set up and configure components
templateChannel.init(templateSocketUrl)
dataChannel.init(dataSocketUrl)
viewRender.init(
  templateChannel, dataChannel, 
  selectTemplate, selectData,
  templates, behaviours, datas,
  login, navigate, execute)


const showTemplates = document.getElementById('show-templates');
showTemplates.addEventListener('click', () => { console.log(templates) }, false);

const showBehaviours = document.getElementById('show-behaviours');
showBehaviours.addEventListener('click', () => { console.log(behaviours) }, false);

const showData = document.getElementById('show-data');
showData.addEventListener('click', () => { console.log(datas) }, false);

const navigateMain = document.getElementById('navigate-main');
navigateMain.addEventListener('click', () => { navigate('main', {}) }, false);

//Start with login view
viewRender.renderView('login', 'mr', {})