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

    <input type="text" name="comment">
    
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
            action: "create",
            item: "game",
            params: %{},
            input: [
              %{
                inputtype: "single",
                valuetype: "string",
                name: "conclusion"
              },
              %{
                inputtype: "single",
                valuetype: "string",
                name: "comment"
              },
              %{
                inputtype: "list",
                valuetype: "number",
                name: "decks",
                values: [
                  "player-deck", 
                  "opponent-deck"
                ]
              }
            ],
            then: %{
              action: "render",
              template: "main",
              params: %{},
              input: []
            }
          }   
        },
        %{
          element: "cancel",
          action: "click",
          funct: "navigate",
          params: %{
            action: "render",
            template: "main",
            params: %{},
            input: []
          }          
        }
      ]
    }
  end

  def data do
    %{
      objects: []
    }
  end

  def components do
    %{
      components: [
        %{
          target: "opponent:select",
          action: "render",
          template: "player:select",
          name: "opponent",
          params: %{},
          cfunct: %{
            element: "opponent",
            action: "change",
            funct: "insert",
            params: %{
              target: "opponent:deck",
              action: "deck:select",
              name: "opponent-deck",
              params: %{value: "player_id"},
              cfunct: %{
                funct: "none"
              },
              components: []
            }
          },
          components: []
        },
        %{
          target: "played:deck",
          action: "render",
          template: "deck:select",
          name: "player-deck",
          params: %{self: true},
          cfunct: %{
            funct: "none"
          },
          components: []
        }
      ]
    }
  end
end
