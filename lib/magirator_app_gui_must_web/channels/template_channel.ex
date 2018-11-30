defmodule MagiratorAppGuiMustWeb.TemplateChannel do
    use Phoenix.Channel
    
    alias MagiratorAppGuiMustWeb.Main
    alias MagiratorAppGuiMustWeb.Login
    alias MagiratorAppGuiMustWeb.DeckNew
    alias MagiratorAppGuiMustWeb.DeckList
    alias MagiratorAppGuiMustWeb.DeckShow
    alias MagiratorAppGuiMustWeb.GameRegister
    alias MagiratorAppGuiMustWeb.PlayerSelect
    alias MagiratorAppGuiMustWeb.DeckSelect
    alias MagiratorAppGuiMustWeb.PlayerDeckSelect

    require Logger

    #Join
    def join("templates:" <> user, _params, socket) do
        Logger.debug("Joining channel templates:#{user}");
        {:ok, socket}
    end

    defp join( _, _ ) do        
        {:error, %{reason: "unknown error"}}
    end

    
    #In

    ## Views
    def handle_in("template", "login", socket) do
        {:reply, {:ok, %{
            template: Login.html, 
            behaviour: Login.behaviour, 
            data: Login.data,
            components: Login.components
            }}, socket}
    end
    
    def handle_in("template", "main", socket) do
        {:reply, {:ok, %{
            template: Main.html, 
            behaviour: Main.behaviour, 
            data: Main.data,
            components: Main.components
            }}, socket}
    end
    
    def handle_in("template", "deck:new", socket) do
        {:reply, {:ok, %{
            template: DeckNew.html, 
            behaviour: DeckNew.behaviour, 
            data: DeckNew.data,
            components: DeckNew.components
            }}, socket}
    end
    
    def handle_in("template", "deck:list", socket) do
        {:reply, {:ok, %{
            template: DeckList.html, 
            behaviour: DeckList.behaviour,  
            data: DeckList.data,
            components: DeckList.components
            }}, socket}
    end
    
    def handle_in("template", "deck:show", socket) do
        {:reply, {:ok, %{
            template: DeckShow.html, 
            behaviour: DeckShow.behaviour,  
            data: DeckShow.data,
            components: DeckShow.components
            }}, socket}
    end
    
    def handle_in("template", "game:register", socket) do
        {:reply, {:ok, %{
            template: GameRegister.html, 
            behaviour: GameRegister.behaviour, 
            data: GameRegister.data,
            components: GameRegister.components
            }}, socket}
    end
    

    ## Components
    def handle_in("template", "player:select", socket) do
        {:reply, {:ok, %{
            template: PlayerSelect.html, 
            behaviour: PlayerSelect.behaviour, 
            data: PlayerSelect.data,
            components: PlayerSelect.components
            }}, socket}
    end

    def handle_in("template", "deck:select", socket) do
        {:reply, {:ok, %{
            template: DeckSelect.html, 
            behaviour: DeckSelect.behaviour, 
            data: DeckSelect.data,
            components: DeckSelect.components
            }}, socket}
    end

    def handle_in("template", "player:decks", socket) do
        {:reply, {:ok, %{
            template: PlayerDeckSelect.html, 
            behaviour: PlayerDeckSelect.behaviour, 
            data: PlayerDeckSelect.data,
            components: PlayerDeckSelect.components
            }}, socket}
    end


    def handle_in(_, _, socket) do
        Logger.debug "No such template"        
        {:reply, :error, socket}
    end
end