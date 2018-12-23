defmodule MagiratorAppGuiMustWeb.DeckShow do

  def html do
    """
    <div id="deck:show">
      This is -{{deck:show.name}}- with id -{{deck:show.id}}-
    </div>
    </br>
    <button type="button" name="games" value={{deck:show.id}}>Games</button>
    <button type="button" name="statistics" {{deck:show.id}}>Statistics</button>
    <div name="deck-info" id="deck:info"></div>
    </br>
    <button type="button" name="back">List</button>
    """
  end
    
  def behaviour do
    %{
      actions: [
        %{
          element: "back",
          action: "click",
          funct: "navigate",
          params: %{
            action: "render",
            template: "deck:list",
            params: %{self: true},
            input: []
          }          
        },
        %{
          element: "games",
          action: "click",
          funct: "insert",
          params: %{
            target: "deck:info",
            action: "deck:games",
            name: "deck-games",
            params: %{value: "deck_id"},
            components: []
          }         
        }
      ]
    }
  end

  def data do
    %{
      objects: ["deck:show"]
    }
  end

  def components do
    %{
      components: []
    }
  end
end