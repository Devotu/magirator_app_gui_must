defmodule MagiratorAppGuiMustWeb.DeckSelect do

  def html do
    """
    <select id="deck:select" name="deck-select">
      <option value="0">Select deck</option>
      {{#deck:list}}
      <option value="{{id}}">{{name}}</option>
      {{/deck:list}}
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
      objects: ["deck:list"]
    }
  end

  def components do
    %{
      components: []
    }
  end
end