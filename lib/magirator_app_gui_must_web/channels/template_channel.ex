defmodule MagiratorAppGuiMustWeb.TemplateChannel do
    use Phoenix.Channel
    
    alias MagiratorAppGuiMustWeb.Main
    alias MagiratorAppGuiMustWeb.Login
    alias MagiratorAppGuiMustWeb.NewDeck

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
        {:reply, {:ok, %{template: NewDeck.html, behaviour: NewDeck.behaviour}}, socket}
    end

    def handle_in(_, _, socket) do
        Logger.debug "No such template"        
        {:reply, :error, socket}
    end
end