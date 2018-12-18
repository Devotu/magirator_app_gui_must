defmodule MagiratorAppGuiMustWeb.DeckNew do

  def html do
    """
    <div id="deck:new">
      Name: <input type="text" name="name"></br>
      Theme: <input type="text" name="theme"></br>
      Format: <input type="text" name="format"></br>
      Black: <input type="checkbox" name="black"></br>
      White: <input type="checkbox" name="white"></br>
      Red: <input type="checkbox" name="red"></br>
      Green: <input type="checkbox" name="green"></br>
      Blue: <input type="checkbox" name="blue"></br>
      Colorless: <input type="checkbox" name="colorless"></br>
      <button type="button" name="create">Create</button>
      </br><button type="button" name="back">Main</button>
    </div>
    """
  end
  
  def behaviour do
    %{
      actions: [
        %{
          element: "create",
          action: "click",
          funct: "execute",
          params: %{
            action: "deck:create",
            params: %{},
            input: [
              %{
                inputtype: "single",
                valuetype: "string",
                name: "conclusion"
              },
              %{
                inputtype: "single",
                valuetype: "string",
                name: "name"
              },
              %{
                inputtype: "single",
                valuetype: "string",
                name: "theme"
              },
              %{
                inputtype: "single",
                valuetype: "string",
                name: "format"
              },
              %{
                inputtype: "single",
                valuetype: "string",
                name: "black"
              },
              %{
                inputtype: "single",
                valuetype: "string",
                name: "white"
              },
              %{
                inputtype: "single",
                valuetype: "string",
                name: "red"
              },
              %{
                inputtype: "single",
                valuetype: "string",
                name: "green"
              },
              %{
                inputtype: "single",
                valuetype: "string",
                name: "blue"
              },
              %{
                inputtype: "single",
                valuetype: "string",
                name: "colorless"
              }
            ]
          }          
        },
        %{
          element: "back",
          action: "click",
          funct: "navigate",
          params: %{
            action: "render",
            template: "main",
            params: %{},
            input: []
          }          
        }
      ]
    }
  end

  def data do
    %{
      objects: []
    }
  end

  def components do
    %{
      components: []
    }
  end
end