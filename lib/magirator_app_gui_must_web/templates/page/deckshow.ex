defmodule MagiratorAppGuiMustWeb.DeckShow do

  def html do
    """
    <div id="deck:show">
      This is -{{deck:show.name}}- with id -{{deck:show.id}}-
    </div>
    </br><button type="button" name="back">List</button>
    """
  end
    
  def behaviour do
    %{
      actions: [
        %{
          element: "back",
          action: "click",
          function: "navigate",
          params: %{
            action: "deck:list",
            params: %{},
            input: []
          }   
        }
      ]
    }
  end
end