defmodule MagiratorAppGuiMustWeb.DeckNew do

  def html do
    """
    <div id="deck:new">
      Name: <input type="text" id="name"></br>
      Theme: <input type="text" id="theme"></br>
      Format: <input type="text" id="format"></br>
      Black: <input type="checkbox" id="black"></br>
      White: <input type="checkbox" id="white"></br>
      Red: <input type="checkbox" id="red"></br>
      Green: <input type="checkbox" id="green"></br>
      Blue: <input type="checkbox" id="blue"></br>
      Colorless: <input type="checkbox" id="colorless"></br>
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
          function: "execute",
          params: %{
            action: "deck:create",
            params: %{},
            input: ["name", "theme", "format", "black", "white", "red", "green", "blue", "colorless"]
          }          
        },
        %{
          element: "back",
          action: "click",
          function: "navigate",
          params: %{
            action: "main",
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
end