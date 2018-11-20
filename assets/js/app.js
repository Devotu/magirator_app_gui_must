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
import { values } from "./values";

const templateSocketUrl = "ws://localhost:4100/socket"
const dataSocketUrl = "ws://localhost:4000/socket"
const tokenUrl = "http://localhost:4000/api/token/"

//Local storages
let templates = {} //App template storage
let behaviours = {} //App behaviour storage
let datas = {} //App data storage


//Selects what page template to render and where (should perhaps be by requesting el?)
function navigate(params, id) {
  let route = params.action
  let pageDiv = 'mr'

  switch (route) {
    case 'deck:show':
      viewRender.renderView('deck:show', pageDiv, { deck_id: id })
      break;

    //Same mr with same as route
    case 'main':
    case 'deck:new':
    case 'deck:list':
    case 'game:register':
      viewRender.renderView(route, pageDiv, params.params, params.data)
      break;

    default:
      console.log("route not found: " + route)
  }
}


//Performes one action
function execute(params, id) {
  let action = params.action

  switch (params.action) {
    case 'login':
      login()
      break;

    case 'deck:create':
      let deck_create_input = values.gatherInput(params.input)
      let callback = function () {
        let nav = {
          action: 'main',
          params: {},
          input: []
        }

        navigate(nav)
      }

      dataChannel.create("deck", deck_create_input, callback)
      break;

    case 'log':
      console.log('executed by:' + id)
      break;

    default:
      console.log(action)
  }
}


//Selects what component template to render and where
function insert(params, _id) {
  let viewName = params.action

  switch (viewName) {

    case 'player:select':
      viewRender.renderView(viewName, params.target, params.params)
      break;

    default:
      console.log(viewName)
  }
}


//selects which template belongs to the requested view
var selectTemplate = function (viewName) {

  switch (viewName) {
    //Same as viewName
    case 'main':
    case 'login':
    case 'deck:new':
    case 'deck:list':
    case 'deck:show':
    case 'game:register':
    case 'player:select':
      return viewName

    //No template needed
    default:
      return 'none' //No template needed
  }
}


//selects which data belongs to the requested view
var selectData = function (viewName) {

  switch (viewName) {
    //Specified data
    case 'main':
      return ['player:current']

    case 'game:register':
      return ['deck:list', 'player:list']

    case 'player:select':
      return ['player:list']

    //Same as viewName
    case 'deck:list':
    case 'deck:show':
      return [viewName]

    //No data needed
    case 'login':
    case 'deck:new':
    default:
      return []
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
  login, navigate, execute, insert)


const showTemplates = document.getElementById('show-templates');
showTemplates.addEventListener('click', () => { console.log(templates) }, false);

const showBehaviours = document.getElementById('show-behaviours');
showBehaviours.addEventListener('click', () => { console.log(behaviours) }, false);

const showData = document.getElementById('show-data');
showData.addEventListener('click', () => { console.log(datas) }, false);

//Start with login view
viewRender.renderView('login', 'mr', {})