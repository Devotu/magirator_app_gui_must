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

import { templateChannel } from "./templatechannel"
//import { login as dataLogin, get as getData } from "./datasocket"



var view = {
  title: "Joe",
  calc: function () {
    return 3 + 4;
  }
}



var output = Mustache.render("{{title}} spends {{calc}}", view)
console.log(output)

var el = document.getElementById('mr');

// <a href="/javascript/manipulation/creating-a-dom-element-51/">create a new element</a> that will take the place of "el"
var newEl = document.createElement('div');
newEl.innerHTML = output;

// replace el with newEL
el.parentNode.replaceChild(newEl, el);

//channel.push("main", "")

//console.log("this is teh template: " + getTemplate())

document.getElementById('name').value = 'Adam'
document.getElementById('pass').value = 'Hemligt';

//App template storage
let templates = {}

//App data storage
let data = {
  user: {
    name: "Knut-Kenneth Karlsson"
  }
}

//Set up a templateChannel and let it get access to the template storage
templateChannel.init(templates)

/*
function login() {
  const Http = new XMLHttpRequest();

  let name = document.getElementById('name').value;
  let pass = document.getElementById('pass').value;

  const url = 'http://localhost:4000/api/token/' + name + '/' + pass;
  console.log('getting token at ' + url)

  Http.open("GET", url);
  Http.send();
  Http.onreadystatechange = (e) => {
    console.log('State: ' + Http.readyState + ', status: ' + Http.status)
    if (Http.readyState == 4 && Http.status == 200) {
      console.log(JSON.parse(Http.responseText))
    }
  }
}
*/

function doIt(it) {
  console.log('this is it: ' + it)
}

//Run when a template has been fetched
function updateTemplate(templateName, template) {
  templates[templateName] = template
  renderView(templateName)
}

//Renders the given view with the current data
function renderView(templateName) {
  var viewData = {}
  switch (templateName) {
    case 'main':
      viewData = data.user
      break;
  
    default:
      console.log('could not find template')
      break;
  }

  console.log('rendering ' + templateName + ' with ')
  console.log(viewData)
  var rendered = Mustache.render(templates[templateName], viewData)
  newEl.innerHTML = rendered;
}

//Gets the given template and data
function getViewContent(templateName, domain, content) {
  templates['main'] = templateChannel.get(templateName, updateTemplate)
  //dataChannel.get(domain, content)
}

//Selects what template and what data to get
function navigate(route) {
  switch (route) {
    case 'main':
      getViewContent('main')
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
showData.addEventListener('click', () => { console.log(data) }, false);

const navigateMain = document.getElementById('navigate-main');
navigateMain.addEventListener('click', () => { navigate('main') }, false);