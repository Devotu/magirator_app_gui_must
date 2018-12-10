
var values = (function () {

  function extractValue(element) {
    let value = element.value

    if (value != null && value != undefined) {

      //Is checkbox
      if (element.type === "checkbox") {
        return element.checked
      }

      return value
    }
  }

  return {
    gatherInput: function (names) {
      let data = {}

      //Names
      names.forEach(n => {
        let elements = document.getElementsByName(n)

        elements.forEach(e => {
          if (e != null && e != undefined) {
            data[n] = extractValue(e)
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