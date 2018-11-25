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
  //then calls getData to fetch all data requirements described by the template
  function updateTemplate(fetchPacket, template, behaviour, dataNames, components) {

    //Store associated template and behaviour
    tStore[fetchPacket.templateName] = template
    bStore[fetchPacket.templateName] = behaviour

    //Add the components to the render data
    fetchPacket.components = components

    //Fetch and update data requried by the template
    updateTemplateData(fetchPacket, dataNames)
  }

  function updateTemplateData(fetchPacket, dataNames) {

    //Record how many data sources are expected to be fetched
    tracksReady[fetchPacket.uuid] = dataNames.length

    //Inform the packet which data is expected to be present when tracks are finished
    fetchPacket.dataNames = dataNames

    //With expected data recorded set of the fetch procedure
    fetchData(fetchPacket, dataNames)
  }

  //fires the dChannel.get function
  //provides a function that can register the data as callback
  function fetchData(fetchPacket, dataNames) {

    //If there is data to fetch
    if (dataNames.length > 0) {
      dataNames.forEach(name => {
        dChannel.show(name, fetchPacket.params, updateData, fetchPacket)
      })
    }
    //Otherwise just get on with render 
    else {
      renderContent(fetchPacket)
    }
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

    //If there are no expected tracks left
    //Generate composite data
    //Replace view
    if (dataReady(fetchPacket)) {

      let contentData = {}
      fetchPacket.dataNames.forEach(dn => {
        contentData[dn] = dStore[dn][dn]
      })

      var content = Mustache.render(tStore[fetchPacket.templateName], contentData)
      replaceView(fetchPacket, content)
    }
  }

  function dataReady(fetchPacket) {

    //If there was no need for data 
    if (tracksReady[fetchPacket.uuid] === 0) {
      return true
    }

    //Otherwise reduce the number of expected by one as this track is done
    tracksReady[fetchPacket.uuid]--

    //Ready if there then are no further data sources expected
    return tracksReady[fetchPacket.uuid] === 0
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

  function addComponents(fetchPacket) {
    console.log(fetchPacket.components)
    fetchPacket.components.forEach(c => {
      renderTemplate(c.name, c.target, c.params, c.components)
    })
  }

  //finds the target
  //replaces with genereated content
  function replaceView(fetchPacket, content) {
    var el = document.getElementById(fetchPacket.target)
    var newElement = createElement(fetchPacket, content)
    el.parentNode.replaceChild(newElement, el)
    addBehaviours(fetchPacket)
    addComponents(fetchPacket)
  }

  //Not returned to be locally available
  function renderTemplate(name, target, params, components) {

    let templateName = tSelector(name)

    let fetchPacket = {
      templateName: templateName,
      target: target,     //target to be replaced
      params: params,
      components: components,
      uuid: createUuid()  //used to unify the results from this track
    }

    getTemplate(fetchPacket)
  }

  return {

    //Load with app specific template selectors
    init: function (
      appTemplateChannel, appDataChannel,
      appTemplateSelector,
      appTemplates, appBehaviours, appDatas,
      appLogin, appNavigator, appExecutor, appInserter) {
      tChannel = appTemplateChannel
      dChannel = appDataChannel
      tSelector = appTemplateSelector
      tStore = appTemplates
      bStore = appBehaviours
      dStore = appDatas
      login = appLogin
      navigator = appNavigator
      executor = appExecutor
      inserter = appInserter
    },

    renderView: function (viewName, target, params, components) {
      renderTemplate(viewName, target, params, components)
    }
  }
})()

export { viewRender }