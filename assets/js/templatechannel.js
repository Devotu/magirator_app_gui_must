
import { Socket } from "phoenix"
import { createUuid } from './helpers'

var templateChannel = (function () {

  let socket = null
  let channel = null

  return {
    init: function (socketUrl) {

      socket = new Socket(socketUrl, { params: {} })

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
      console.log("getting template " + fetchPacket.templateName)
      channel.push('template', fetchPacket.templateName)
        .receive("ok", (data) => callback(fetchPacket, data.template))
    }
  }
})()

export { templateChannel }