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

import { createUuid } from './helpers'

import { templateChannel } from "./templatechannel"
import { dataChannel } from "./datachannel"


document.getElementById('name').value = 'Adam'
document.getElementById('pass').value = 'Hemligt';

const templateSocketUrl = "ws://localhost:4100/socket"
const dataSocketUrl = "ws://localhost:4000/socket"
const tokenUrl = "http://localhost:4000/api/token/"

//App template storage
let templates = {}

//App data storage
let datas = {}

let ready = []

//Set up a templateChannel and let it get access to the template storage
templateChannel.init(templates, templateSocketUrl)
dataChannel.init(datas, dataSocketUrl)


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


//Selects what template to render and where (should perhaps be by requesting el?)
function navigate(route) {
  switch (route) {
    case 'main':
      renderView('main', 'mr')
      break;
    case 'deck:list':
      console.log('decklist')
      break;
    default:
      console.log(route)
  }
}

const loginButton = document.getElementById('login');
loginButton.addEventListener('click', login, false);

const showTemplates = document.getElementById('show-templates');
showTemplates.addEventListener('click', () => { console.log(templates) }, false);

const showData = document.getElementById('show-data');
showData.addEventListener('click', () => { console.log(datas) }, false);

const navigateMain = document.getElementById('navigate-main');
navigateMain.addEventListener('click', () => { navigate('main') }, false);

//              updateTemplate
//             / getTemplate \
//-> renderView                renderContent - replaceView
//  selectContent \ getData /
//                 updateData

//main function to render a view at target
//decides what should be done and delegates
//creates a meta packet that will follow through subsequent calls
//sets of two independent tracks both provided with the same packet
//one to get the template
//one to get the data
function renderView(viewName, target) {

  var fetchPacket = {
    templateName: selectTemplate(viewName),
    dataName: selectData(viewName),
    target: target,     //target to be replaced
    uuid: createUuid()  //used to unify the results from both tracks
  }

  console.log(fetchPacket)

  getTemplate(fetchPacket)
  getData(fetchPacket)
}


//selects which template belongs to the requested view
function selectTemplate(viewName) {

  switch (viewName) {
    case 'main':
      return 'main'

    default:
      break;
  }
}


//selects which data belongs to the requested view
function selectData(viewName) {

  switch (viewName) {
    case 'main':
      return 'main'

    default:
      break;
  }
}


//fires the templateChannel.get 
//provides a function that can register the template as callback
function getTemplate(fetchPacket) {
  templateChannel.get(fetchPacket, updateTemplate)
}


//provided as callback to function that gets the template
//updates local template
//then calls renderContent as the template track is done
function updateTemplate(fetchPacket, template) {
  templates[fetchPacket.templateName] = template
  renderContent(fetchPacket)
}


//fires the dataChannel.get function
//provides a function that can register the data as callback
function getData(fetchPacket) {

  //not in list of views with empty/without data 
  if (fetchPacket.dataName !== 'main') { 
    dataChannel.get(fetchPacket, updateData)
  }
  else {
    updateData(fetchPacket, {name: "Wolmar den röde"}) //POC data
  }
}


//provided as callback to function that gets the data
//updates local data
//then calls renderContent as the data track is done
function updateData(fetchPacket, data) {
  datas[fetchPacket.dataName] = data
  renderContent(fetchPacket)
}


//main function to execute requested render
//called separate by both tracks as they finish
//uses the fetchPacket's uuid to match tracks
//if the other track has been registerd as done
//    template and data should both be available
//    render the template with the data
//    call replaceView with new content
//else the other track is not done 
//    register this track as done
function renderContent(fetchPacket) {

  //The other track template/data has already finished loading
  if (ready.indexOf(fetchPacket.uuid) >= 0) {

    ready = ready.filter(e => e !== fetchPacket.uuid)
    var content = Mustache.render(templates[fetchPacket.templateName], datas[fetchPacket.dataName])
    replaceView(fetchPacket, content)
  }
  else {

    //Registers this template/data track to the items ready to use
    ready.push(fetchPacket.uuid)
  }
}


//finds the target
//replaces with genereated content
function replaceView(fetchPacket, content) {
  var el = document.getElementById(fetchPacket.target)
  var ne = document.createElement('div')
  ne.innerHTML = content
  ne.id = fetchPacket.target
  el.parentNode.replaceChild(ne, el)
}