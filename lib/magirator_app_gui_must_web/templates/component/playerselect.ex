defmodule MagiratorAppGuiMustWeb.PlayerSelect do

  def html do
    """
    <select id="player:select">
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
      ]
    }
  end
end