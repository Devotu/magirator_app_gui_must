defmodule MagiratorAppGuiMustWeb.Main do

  def html do
    """
    <div id="main">
      <div>Hello {{player:current.name}} from main.html.</div><br>
      <button name='new-deck'>New deck</button><br>
      <button name='deck-list'>Deck list</button><br>
      <button name='game-register'>Register game</button><br>
    </div>
    """
  end

  def behaviour do
    %{
      actions: [
        %{
          element: "new-deck",
          action: "click",
          funct: "navigate",
          params: %{
            action: "deck:new",
            params: %{},
            input: []
          }   
        },
        %{
          element: "deck-list",
          action: "click",
          funct: "navigate",
          params: %{
            action: "deck:list",
            params: %{},
            input: []
          }   
        },
        %{
          element: "game-register",
          action: "click",
          funct: "navigate",
          params: %{
            action: "game:register",
            params: %{},
            input: []
          }
        }
      ]
    }
  end

  def data do
    %{
      objects: ["player:current"]
    }
  end

  def components do
    %{
      components: []
    }
  end
end
