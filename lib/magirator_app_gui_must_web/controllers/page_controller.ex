defmodule MagiratorAppGuiMustWeb.PageController do
  use MagiratorAppGuiMustWeb, :controller

  def index(conn, _params) do
    render conn, "index.html"
  end
end
