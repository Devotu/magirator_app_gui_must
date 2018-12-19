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
import { values as valueHelper } from "./values";

const templateSocketUrl = "ws://localhost:4100/socket"
const dataSocketUrl = "ws://localhost:4000/socket"
const tokenUrl = "http://localhost:4000/api/token/"

//Local storages
let templates = {} //App template storage
let behaviours = {} //App behaviour storage
let datas = {} //App data storage


//Selects what page template to render and where (should perhaps be by requesting el?)
function navigate(params, id, value) {
  let route = params.template
  let pageDiv = 'mr'

  let renderParams = collectRenderParams(params.params, id, value)

  switch (route) {
    //Same mr with same as route
    case 'main':
    case 'deck:new':
    case 'deck:show':
    case 'deck:list':
    case 'game:register':
      viewRender.renderPage(route, pageDiv, renderParams, [])
      break;

    default:
      console.log("route not found: " + route)
  }
}

//Selects what component template to render and where
function insert(params, id, value) {

  console.log('inserting')
  let renderParams = collectRenderParams(params.params, id, value)

  switch (params.action) {

    case 'player:select':
    case 'deck:select':
      viewRender.renderTemplate(params.action, params.target, renderParams, params.components, params.cfunct, params.name)
      break;

    default:
      console.log('default')
      console.log(params.action)
      viewRender.renderTemplate(params.action, params.target, renderParams, [])
  }
}

function collectRenderParams(params, id, value) {
  let renderParams = {}

  if (typeof params.id !== 'undefined') {
    renderParams[params.id] = id
  }

  if (typeof params.value !== 'undefined') {
    renderParams[params.value] = value
  }

  if (params.self) {
    renderParams["self"] = true
  }

  return renderParams
}

//TODO add then object to template
//Performes one action
function execute(params, id) {
  let action = params.action

  switch (params.action) {
    case 'login':
      login()
      break;

    case 'deck:create':
      let deckCreateInput = valueHelper.gatherInput(params.input)
      let deckCreateCallback = function () {
        let nav = {
          action: 'render',
          template: 'main',
          params: {},
          input: []
        }
        navigate(nav)
      }
      dataChannel.create("deck", deckCreateInput, deckCreateCallback)
      break;

    case 'game:register':
      let gameRegisterInput = valueHelper.gatherInput(params.input)
      let gameRegisterCallback = function () {
        let nav = {
          action: 'main',
          params: {},
          input: []
        }
        navigate(nav)
      }
      dataChannel.create("game", gameRegisterInput, gameRegisterCallback)

    case 'log':
      console.log('executed by:' + id)
      console.log(params)
      break;

    default:
      console.log(action)
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
        action: 'render',
        template: 'main',
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
  templates, behaviours, datas,
  login, navigate, execute, insert)


const showTemplates = document.getElementById('show-templates');
showTemplates.addEventListener('click', () => { console.log(templates) }, false);

const showBehaviours = document.getElementById('show-behaviours');
showBehaviours.addEventListener('click', () => { console.log(behaviours) }, false);

const showData = document.getElementById('show-data');
showData.addEventListener('click', () => { console.log(datas) }, false);

//Start with login view
viewRender.renderPage('login', 'mr', {}, [])