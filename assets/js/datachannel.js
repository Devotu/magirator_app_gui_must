
import { Socket } from "phoenix"

var dataChannel = (function () {

  let url = ""
  let socket = null
  let channel = null

  return {
    init: function (socketUrl) {
      url = socketUrl
    },

    connect: function (token) {
      socket = new Socket(url, {params: {token: token}})
    
      socket.connect()
    
      channel = socket.channel("app:main" , {})
      channel.join()
        .receive("ok", resp => { console.log("Joined data successfully", resp) })
        .receive("error", resp => { console.log("Unable to join data", resp) })
    },

    show: function (fetchPacket, params, callback) {
      console.log("showing data " + fetchPacket.dataName)
      console.log(params)
      channel.push(fetchPacket.dataName, params)
        .receive("ok", (data) => callback(fetchPacket, data.data))
    },

    create: function (target, params, callback) {
      console.log("creating data " + target)
      console.log(params)
      channel.push(target + ":create", params)
        // .receive("ok", (data) => callback(data.data))
        .receive("ok", () => callback())
        .receive("error", (data) => console.log(data))
    }
  }
})()

export { dataChannel }
