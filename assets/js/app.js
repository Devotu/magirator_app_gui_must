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

let templates = {}

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

function renderView(template) {
  var rendered = Mustache.render(template, {msg: "got it!"})
  newEl.innerHTML = rendered;
}

function get(templateName, domain, content) {
  templates['main'] = templateChannel.get(templateName, renderView)
  //dataChannel.get(domain, content)
}

function navigate(route) {
  switch (route) {
    case 'main':
      get('main', null)
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

const getDecksButton = document.getElementById('get-decks');
getDecksButton.addEventListener('click', () => { templateChannel.get('main', doIt) }, false);

const showTemplates = document.getElementById('get-templates');
showTemplates.addEventListener('click', () => { console.log(templates) }, false);

const navigateMain = document.getElementById('navigate-main');
navigateMain.addEventListener('click', () => { navigate('main') }, false);