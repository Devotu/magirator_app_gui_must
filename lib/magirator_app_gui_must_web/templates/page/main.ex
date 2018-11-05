defmodule MagiratorAppGuiMustWeb.Main do

  def html do
    """
    <div>Hello {{name}} from main.html.</div>
    <button id='new-deck'>New deck</button>
    <button id='deck-list'>Deck list</button>
    """
  end

  def behaviour do
    %{
      actions: [
        %{
          element: "new-deck",
          action: "onclick",
          function: "navigate",
          params: ["deck:new", %{}]
        },
        %{
          element: "deck-list",
          action: "onclick",
          function: "navigate",
          params: ["deck:list", %{}]
        }
      ]
    }
  end
end
