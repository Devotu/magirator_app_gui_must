
import { Socket } from "phoenix"
import { createUuid } from './helpers'

var templateChannel = (function () {

  let socket = null
  let channel = null
  let templates = null

  return {
    init: function (globalTemplates) {
      templates = globalTemplates
      console.log(templates)

      socket = new Socket("ws://localhost:4100/socket", { params: {} })

      socket.connect()

      let uuid = createUuid();

      channel = socket.channel("templates:" + uuid, {})
      channel.join()
        .receive("ok", resp => { console.log("Joined template successfully", resp) })
        .receive("error", resp => { console.log("Unable to join template", resp) })

      channel.on("main", payload => {
        console.log(payload)
        templates['main'] = { main: payload.template }
      })
    },

    get: function (fetchPacket, callback) {
      console.log("getting template")
      var template = ''
      channel.push('template', "main")
        .receive("ok", (data) => callback(fetchPacket, data.template))
    }
  }
})()



export { templateChannel }