defmodule MagiratorAppGuiMustWeb.DeckList do

  def html do
    """
    <div id="deck:new">
      <ul>
        {{#deck:list}}
        <li name="deck" id="{{id}}">
          {{name}}
        </li>
        {{/deck:list}}
      </ul>
    </div>
    """
  end
    
  def behaviour do
    %{
      actions: [
        %{
          element: "deck",
          action: "onclick",
          function: "execute",
          params: %{
            action: "log",
            params: %{}
          }          
        }
      ]
    }
  end
end