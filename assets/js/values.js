
var values = (function () {

  return {
    gatherInput: function (names) {
      let data = {}

      //Names
      names.forEach(n => {
        let elements = document.getElementsByName(n)

        elements.forEach(e => {
          if (e != null && e != undefined) {

            if (e.type === "text" ) {
              let value = e.value
              if (value != null && value != undefined) {
                data[n] = value
              }
            }
        
            if (e.type === "checkbox") {
              data[n] = e.checked
            }
        
            if (e.type === "radio") {
              if (e.checked)
              {
                data[n] = e.value
              }
            }

            if (e.type === "select-one") {
              data[n] = e.value
            }

          } else {
            console.log("could still not find " + n)
            notFound.push(n)
          }
        })
      })

      return data
    }
  }
})()

export { values }