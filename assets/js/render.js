// Renders and replaces the requested view in the target view
//
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

import { createUuid } from './helpers'

var viewRender = (function () {

  //Variables declared by running app
  //t:template, b:behaviour, d:data
  let tSelector = null
  let dSelector = null
  let tChannel = null
  let dChannel = null
  let tStore = null
  let bStore = null
  let dStore = null
  let login = null
  let navigator = null
  let executor = null
  let inserter = null

  //Internal variables
  let tracksReady = [] //Template/data tracks completed


  //fires the tChannel.get 
  //provides a function that can register the template as callback
  function getTemplate(fetchPacket) {
    tChannel.get(fetchPacket, updateTemplate)
  }

  //provided as callback to function that gets the template
  //updates local template
  //then calls renderContent as the template track is done
  function updateTemplate(fetchPacket, template, behaviour) {
    bStore[fetchPacket.templateName] = behaviour
    tStore[fetchPacket.templateName] = template
    renderContent(fetchPacket)
  }

  //fires the dChannel.get function
  //provides a function that can register the data as callback
  function getData(fetchPacket, params) {

    if (fetchPacket.dataName === 'none') {
      fetchPacket.dataName = fetchPacket.templateName
      updateData(fetchPacket, params) //View has no data need
    }
    else {
      dChannel.show(fetchPacket, params, updateData)
    }
  }

  //provided as callback to function that gets the data
  //updates local data
  //then calls renderContent as the data track is done
  function updateData(fetchPacket, data) {
    let dataContent = {}
    dataContent[fetchPacket.dataName] = data
    dStore[fetchPacket.dataName] = dataContent
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
    if (tracksReady.indexOf(fetchPacket.uuid) >= 0) {

      tracksReady = tracksReady.filter(e => e !== fetchPacket.uuid)
      var content = Mustache.render(tStore[fetchPacket.templateName], dStore[fetchPacket.dataName])
      replaceView(fetchPacket, content)
    }
    else {

      //Registers this template/data track to the items ready to use
      tracksReady.push(fetchPacket.uuid)
    }
  }

  //creates a new element from the given content
  function createElement(fetchPacket, content) {
    var newElement = document.createElement('div')
    newElement.innerHTML = content
    newElement.id = fetchPacket.target
    return newElement
  }

  function selectFunction(requestedFunctionName) {
    switch (requestedFunctionName) {
      case 'navigate':
        return navigator

      case 'login':
        return login

      case 'execute':
        return executor

      case 'insert':
        return inserter

      default:
        break;
    }
  }

  //add behavious to the given element
  function addBehaviours(fetchPacket, element) {
    let templateBehaviours = bStore[fetchPacket.templateName]

    templateBehaviours.actions.forEach(action => {
      let funct = selectFunction(action.function)
      let els = document.getElementsByName(action.element)

      els.forEach(function (e) {
        console.log(e)
        console.log(action)
        console.log(funct)
        e.addEventListener(action.action, () => { funct(action.params, e.id, action.target) }, false)
      })
    });

    return element
  }

  //finds the target
  //replaces with genereated content
  function replaceView(fetchPacket, content) {
    var el = document.getElementById(fetchPacket.target)
    var newElement = createElement(fetchPacket, content)
    el.parentNode.replaceChild(newElement, el)
    addBehaviours(fetchPacket)
  }

  return {

    //Load with app specific template selectors
    init: function (
      appTemplateChannel, appDataChannel,
      appTemplateSelector, appDataSelector,
      appTemplates, appBehaviours, appDatas,
      appLogin, appNavigator, appExecutor, appInserter) {
      tChannel = appTemplateChannel
      dChannel = appDataChannel
      tSelector = appTemplateSelector
      dSelector = appDataSelector
      tStore = appTemplates
      bStore = appBehaviours
      dStore = appDatas
      login = appLogin
      navigator = appNavigator
      executor = appExecutor
      inserter = appInserter
    },

    renderView: function (viewName, target, params) {

      var fetchPacket = {
        templateName: tSelector(viewName),
        dataName: dSelector(viewName),
        target: target,     //target to be replaced
        uuid: createUuid()  //used to unify the results from both tracks
      }

      getTemplate(fetchPacket)
      getData(fetchPacket, params)
    }
  }
})()

export { viewRender }