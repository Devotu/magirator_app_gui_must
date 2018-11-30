
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
    },

    get: function (fetchPacket, callback) {
      console.log("getting template " + fetchPacket.templateName)
      channel.push('template', fetchPacket.templateName)
        .receive("ok", (data) => callback(fetchPacket, data.template, data.behaviour, data.data.objects, data.components.components))
    }
  }
})()

export { templateChannel }