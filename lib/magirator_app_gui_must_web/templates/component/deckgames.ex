defmodule MagiratorAppGuiMustWeb.DeckGames do

    def html do
        """
        <div id="deck:games">
          <ul>
            {{#deck:games}}
            <li name="game" id="{{id}}">
              Conclusion: {{game.conclusion}}
              Against: {{deck.name}}
            </li>
            {{/deck:games}}
          </ul>
        </div>
        """
      end
      
    def behaviour do
      %{
        actions: []
      }
    end
  
    def data do
      %{
        objects: ["deck:games"]
      }
    end
  
    def components do
      %{
        components: []
      }
    end
  end