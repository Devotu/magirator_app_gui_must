defmodule MagiratorAppGuiMustWeb.GameRegister do

  def html do
    """
    <div id="game:register">
    <br>
    Deck: <br>
    <div name="played-deck" id="played:deck"></div>

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
          templateName: "player:select",
          target: "opponent:select",
          params: %{},
          function: %{
            function: "insert",
            params: %{
              templateName: "deck:select",
              target: "opponent:deck",
              params: %{}
            }
          },
          components: []
        },
        %{
          templateName: "deck:select",
          target: "played:deck",
          params: %{},
          function: %{},
          components: []
        }
      ]
    }
  end
end