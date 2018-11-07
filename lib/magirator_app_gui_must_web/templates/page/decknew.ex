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
      <button type="button" id="create">Create</button>
    </div>
    """
  end
  
  def behaviour do
    %{
      actions: [
        %{
          element: "create",
          action: "onclick",
          function: "execute",
          params: %{
            action: "deck:create",
            params: %{},
            input: ["name", "theme", "format", "black", "white", "red", "green", "blue", "colorless"]
          }          
        }
      ]
    }
  end
end