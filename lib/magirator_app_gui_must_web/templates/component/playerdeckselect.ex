defmodule MagiratorAppGuiMustWeb.PlayerDeckSelect do

  def html do
    """
    <select id="deck:select" name="deck-select">
      <option value="0">Select deck</option>
      {{#player:decks}}
      <option value="{{id}}">{{name}}</option>
      {{/player:decks}}
    </select>
    """
  end
    
  def behaviour do
    %{
      actions: [
        %{
          funct: "append"
        }
      ]
    }
  end

  def data do
    %{
      objects: ["player:decks"]
    }
  end

  def components do
    %{
      components: []
    }
  end
end