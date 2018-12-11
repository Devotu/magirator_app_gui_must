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

    <input type="radio" name="conclusion" value="win"> Win
    <input type="radio" name="conclusion" value="draw"> Draw
    <input type="radio" name="conclusion" value="loss"> Loss
    
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
          funct: "execute",
          params: %{
            action: "game:register",
            params: %{},
            input: ["conclusion", "player-deck", "opponent", "opponent-deck"]
          }   
        },
        %{
          element: "cancel",
          action: "click",
          funct: "navigate",
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
          target: "opponent:select",
          action: "player:select",
          name: "opponent",
          params: %{},
          cfunct: %{
            element: "player-select",
            action: "change",
            funct: "insert",
            params: %{
              target: "opponent:deck",
              action: "player:decks",
              name: "opponent-deck",
              params: %{value: "id"},
              input: []
            }
          },
          components: []
        },
        %{
          target: "played:deck",
          action: "deck:select",
          name: "player-deck",
          params: %{},
          cfunct: %{
            funct: "none"
          },
          components: []
        }
      ]
    }
  end
end
