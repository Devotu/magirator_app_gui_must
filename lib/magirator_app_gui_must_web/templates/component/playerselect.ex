defmodule MagiratorAppGuiMustWeb.PlayerSelect do

  def html do
    """
    <select id="player:select" name="player-select">
      <option value="0">Select player</option>
      {{#player:list}}
      <option value="{{id}}">{{name}}</option>
      {{/player:list}}
    </select>
    """
  end
 
  def behaviour do
    %{
      actions: [
      %{
        element: "player-select",
        action: "change",
        function: "insert",
        params: %{
          target: "opponent:deck",
          action: "deck:select",
          params: %{},
          input: []
        }
      }]
    }
  end   

  def data do
    %{
      objects: ["player:list"]
    }
  end

  def components do
    %{
      components: []
    }
  end
end