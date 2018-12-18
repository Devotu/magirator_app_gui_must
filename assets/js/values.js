
var values = (function () {

  function collectValues(name, valueType) { 
    let elements = document.getElementsByName(name)
    let data = {}

    elements.forEach(e => {
      if (e != null && e != undefined) {

        if (e.type === "text") {
          let value = e.value
          if (value != null && value != undefined) {
            data[name] = value
          }
        }

        if (e.type === "checkbox") {
          data[name] = e.checked
        }

        if (e.type === "radio") {
          if (e.checked) {
            data[name] = e.value
          }
        }

        if (e.type === "select-one") {
          data[name] = e.value
        }

        //type conversion
        if (valueType === "number") {
          data[name] = Number(data[name])
        }

      } else {
        console.log("could not find " + name)
      }
    })

    return data
  }

  return {
    gatherInput: function (requestedDataObjects) {
      let data = {}

      requestedDataObjects.forEach(obj => {

        switch (obj.inputtype) {
          case "single":
            let objData = collectValues(obj.name, obj.valuetype)
            data[obj.name] = objData[obj.name]
            break;
          case "list":
            let listData = []
            obj.values.forEach(v => {
              let objData = collectValues(v, obj.valuetype)
              listData.push(objData[v])
            })
            data[obj.name] = listData
            break;
          default:
            break;
        }
      })

      return data
    }
  }
})()

export { values }