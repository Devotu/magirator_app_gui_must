defmodule MagiratorAppGuiMustWeb.Main do

  def html do
    """
    <div id="main">
      <div>Hello {{player:current.name}} from main.html.</div>
      <button id='new-deck'>New deck</button>
      <button id='deck-list'>Deck list</button>
    </div>
    """
  end

  def behaviour do
    %{
      actions: [
        %{
          element: "new-deck",
          action: "onclick",
          function: "navigate",
          params: %{
            action: "deck:new",
            params: %{},
            input: []
          }   
        },
        %{
          element: "deck-list",
          action: "onclick",
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
