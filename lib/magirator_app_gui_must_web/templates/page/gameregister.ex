defmodule MagiratorAppGuiMustWeb.GameRegister do

  def html do
    """
    <div id="game:register">
    <br>
    Deck: <br>
    <select name="deck-select">
      <option value="0">Select deck</option>
      {{#deck:list}}
      <option value="{{id}}">{{name}}</option>
      {{/deck:list}}
    </select>

    <br><br>

    Opponent:<br>
    <div name="opponent-select" id="opponent:select"></div>

    Opponent deck:<br>
    <div name="opponent-deck" id="opponent:deck"></div>

    <br><br>

    <input type="radio" name="result" value="win"> Win
    <input type="radio" name="result" value="draw"> Draw
    <input type="radio" name="result" value="loss"> Loss
    
    <br><br>

    <input type="button" name="register" value="Register"></button>

    <br><br>

    <input type="button" name="cancel" value="Cancel"></button>
    </div>
    """
  end

  def behaviour do
    %{
      actions: [
        %{
          element: "register",
          action: "click",
          function: "execute",
          params: %{
            action: "game:register",
            params: %{},
            input: []
          }   
        },
        %{
          element: "cancel",
          action: "click",
          function: "navigate",
          params: %{
            action: "main",
            params: %{},
            input: []
          }   
        },
        %{
          element: "opponent-select",
          action: "change",
          function: "insert",
          params: %{
            target: "opponent:deck",
            action: "player:select",
            params: %{},
            input: []
          }
        }
      ]
    }
  end

  def data do
    %{
      objects: ["deck:list", "player:list"]
    }
  end

  def components do
    %{
      components: [
        %{
          name: "player:select",
          target: "opponent:select",
          params: %{},
          components: []
        },
        %{
          name: "deck:select",
          target: "opponent:deck",
          params: %{},
          components: []
        }
      ]
    }
  end
end