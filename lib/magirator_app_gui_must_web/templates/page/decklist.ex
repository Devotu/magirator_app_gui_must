defmodule MagiratorAppGuiMustWeb.DeckList do

  def html do
    """
    <div id="deck:new">
      <ul>
        {{#deck:list}}
        <li>
          {{name}}
        </li>
        {{/deck:list}}
      </ul>
    </div>
    """
  end
    
  def behaviour do
    %{
      actions: [ ]
    }
  end
end