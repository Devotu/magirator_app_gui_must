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
          funct: "navigate",
          params: %{
            action: "deck:list",
            params: %{},
            input: []
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