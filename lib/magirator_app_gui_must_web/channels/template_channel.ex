defmodule MagiratorAppGuiMustWeb.TemplateChannel do
    use Phoenix.Channel
    
    alias MagiratorAppGuiMustWeb.Main
    alias MagiratorAppGuiMustWeb.Login
    alias MagiratorAppGuiMustWeb.DeckNew
    alias MagiratorAppGuiMustWeb.DeckList

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
    def handle_in("template", "login", socket) do
        {:reply, {:ok, %{template: Login.html, behaviour: Login.behaviour}}, socket}
    end
    
    def handle_in("template", "main", socket) do
        {:reply, {:ok, %{template: Main.html, behaviour: Main.behaviour}}, socket}
    end
    
    def handle_in("template", "deck:new", socket) do
        {:reply, {:ok, %{template: DeckNew.html, behaviour: DeckNew.behaviour}}, socket}
    end
    
    def handle_in("template", "deck:list", socket) do
        {:reply, {:ok, %{template: DeckList.html, behaviour: DeckList.behaviour}}, socket}
    end

    def handle_in(_, _, socket) do
        Logger.debug "No such template"        
        {:reply, :error, socket}
    end
end