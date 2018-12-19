// Renders and replaces the requested view in the target view
//
//              
//             / getTemplate \
//                                     -behaviours
// -> renderView  > getTemplate        -template
//    Page/Template templateChannel > updateTemplate
//                                    updateTemplateData     -data
//                                    fetchData           *> updateData > renderContent > replaceView
//                                                                                        addBehaviours
//                                                                                        addComponents


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
    bStore[fetchPacket.target] = behaviour

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

  //which of these available actions is supplied
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

      case 'append':
        return 'append'

      case 'none':
        return 'none'

      default:
        break;
    }
  }

  //add behavious to the given element
  function addBehaviours(fetchPacket, element) {
    let templateBehaviours = bStore[fetchPacket.target]

    templateBehaviours.actions.forEach(action => {

      //If an action is open to be overridden and such an overriding action exist
      if (action.funct === 'append' && typeof fetchPacket.componentFunction !== 'undefined') {
        action = fetchPacket.componentFunction
      }

      let funct = selectFunction(action.funct)
      let els = document.getElementsByName(action.element)

      if (funct !== 'none') {
        els.forEach((el) => {
          el.addEventListener(action.action, () => { funct(action.params, el.id, el.value) }, false)
        })
      } else {
        console.log('no functions to register')
      }
    });

    return element
  }

  function addComponents(fetchPacket) {
    fetchPacket.components.forEach(c => {
      renderTargetTemplate(c.template, c.target, c.params, c.components, c.cfunct, c.name)
    })
  }

  //finds the target
  //replaces with genereated content
  //when all is done add behaviours and components
  function replaceView(fetchPacket, content) {
    let el = document.getElementById(fetchPacket.target)
    let newElement = createElement(fetchPacket, content)

    if (fetchPacket.elementName !== undefined) {
      let actualElement = newElement.firstChild
      actualElement.setAttribute("name", fetchPacket.elementName)
    }

    el.parentNode.replaceChild(newElement, el)
    addBehaviours(fetchPacket)
    addComponents(fetchPacket)
  }

  //Not returned to be locally available
  function renderTargetTemplate(name, target, params, components, componentFunction, elementName) {

    //If no element name specified, use same as template
    if (elementName == undefined) {
      elementName = name
    }

    let fetchPacket = {
      templateName: name,
      elementName: elementName,   //this will be the name of the rendered element
      target: target,     //target to be replaced
      params: params,
      components: components,
      componentFunction: componentFunction,
      uuid: createUuid()  //used to unify the results from this track
    }

    getTemplate(fetchPacket)
  }

  return {

    //Load with app specific template selectors
    init: function (
      appTemplateChannel, appDataChannel,
      appTemplates, appBehaviours, appDatas,
      appLogin, appNavigator, appExecutor, appInserter) {
      tChannel = appTemplateChannel
      dChannel = appDataChannel
      tStore = appTemplates
      bStore = appBehaviours
      dStore = appDatas
      login = appLogin
      navigator = appNavigator
      executor = appExecutor
      inserter = appInserter
    },

    //Renders an entire view including components etc.
    renderPage: function (viewName, target, params, components) {
      renderTargetTemplate(viewName, target, params, components)
    },

    //Renders a single template
    renderTemplate(name, target, params, components, componentFunction, elementName) {
      renderTargetTemplate(name, target, params, components, componentFunction, elementName)
    }
  }
})()

export { viewRender }