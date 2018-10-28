
import { Socket } from "phoenix"

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

    get: function (name, callback) {
      console.log("getting template")
      var template = ''
      channel.push('template', "main")
        .receive("ok", (data) => callback(data.template))
    }
  }
})()

function createUuid() {
  return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
    (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
  )
}

export { templateChannel }