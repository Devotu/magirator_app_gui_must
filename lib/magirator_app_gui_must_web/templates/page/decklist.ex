defmodule MagiratorAppGuiMustWeb.DeckList do

  def html do
    """
    <div id="deck:list">
      <ul>
        {{#deck:list}}
        <li name="deck" id="{{id}}">
          {{name}}
        </li>
        {{/deck:list}}
      </ul>
    </div>
    </br><button type="button" name="back">Main</button>
    """
  end
    
  def behaviour do
    %{
      actions: [
        %{
          element: "deck",
          action: "onclick",
          function: "navigate",
          params: %{
            action: "deck:show",
            params: %{},
            input: []
          }          
        },
        %{
          element: "back",
          action: "onclick",
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
end