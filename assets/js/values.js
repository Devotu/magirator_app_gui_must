
var values = (function () {

  function extractValue(element) {
    let value = element.value

    if (value != null && value != undefined) {

      //Is checkbox
      if (value === "on") {
        return document.getElementById(element.id).checked
      }

      return value
    }
  }

  return {
    gatherInput: function (paramList) {
      let data = {}

      paramList.forEach(p => {
        let element = document.getElementById(p)

        if (element != null && element != undefined) {
          data[p] = extractValue(element)
        } else {
          console.log("could not find " + p)
        }
      });

      return data
    }
  }
})()

export { values }