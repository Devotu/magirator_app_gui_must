
import { Socket } from "phoenix"

var dataChannel = (function () {

  let url = ""
  let socket = null
  let channel = null
  let data = null

  return {
    init: function (globalData, socketUrl) {
      data = globalData
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

    get: function (fetchPacket, callback) {
      console.log("getting data")
      channel.push('template', "main")
        .receive("data", (data) => callback(fetchPacket, data))
    }
  }
})()

export { dataChannel }
