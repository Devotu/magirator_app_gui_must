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
  let tracksReady = {} //Template/data tracks completed


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

    fetchPacket.dataNames.forEach(name => {
      dChannel.show(name, params, updateData, fetchPacket)
    })

    // if (fetchPacket.dataNames == 0) {
    //   fetchPacket.dataNames = fetchPacket.templateName
    //   updateData(fetchPacket.templateName, {}, fetchPacket) //View has no data need
    // }
    // else {
    //   fetchPacket.dataNames.forEach(name => {
    //     dChannel.show(name, params, updateData, fetchPacket)
    //   })
    // }
  }

  //provided as callback to function that gets the data
  //updates local data
  //then calls renderContent as the data track is done
  function updateData(dataName, data, fetchPacket) {
    let dataContent = {}
    dataContent[dataName] = data
    dStore[dataName] = dataContent
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

    //If the packet uuid does not exist
    //Add the packet uuid with number of expected tracks not yet finished
    if (typeof tracksReady[fetchPacket.uuid] === 'undefined') {
      tracksReady[fetchPacket.uuid] = fetchPacket.tracks
    }

    //Reduce the number of expected tracks by one
    tracksReady[fetchPacket.uuid]--

    //If there are no expected tracks left
    //Remove the uuid
    //Replace view
    if (tracksReady[fetchPacket.uuid] == 0) {
      tracksReady[fetchPacket.uuid] = fetchPacket.tracks

      let contentData = {}
      fetchPacket.dataNames.forEach(dn => {
        contentData[dn] = dStore[dn][dn]
      })

      var content = Mustache.render(tStore[fetchPacket.templateName], contentData)
      replaceView(fetchPacket, content)
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
        e.addEventListener(action.action, () => { funct(action.params, e.id) }, false)
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

      let templateName =  tSelector(viewName)
      let dataNames = dSelector(viewName)

      var fetchPacket = {
        templateName: templateName,
        dataNames: dataNames,
        target: target,     //target to be replaced
        tracks: 1 + dataNames.length, //number of expected task tracks
        uuid: createUuid()  //used to unify the results from both tracks
      }

      getTemplate(fetchPacket)
      getData(fetchPacket, params)
    }
  }
})()

export { viewRender }