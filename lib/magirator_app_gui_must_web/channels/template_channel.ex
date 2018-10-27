defmodule MagiratorAppGuiMustWeb.TemplateChannel do
    use Phoenix.Channel

    # alias MagiratorAppChannel.RoutingPacket
    # import MagiratorAppChannel.DomainRouter

    alias MagiratorAppGuiMustWeb.Main

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
    def handle_in("main", _, socket) do

        html = Main.html

        broadcast(socket, "main", %{template: html})
        {:reply, :ok, socket}
    end
end