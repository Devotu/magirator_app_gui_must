defmodule MagiratorAppGuiMustWeb.Main do

  def html do
    "<div>Hello {{name}} from main.html.</div>"
  end

  def behaviour do
    %{
      actions: []
    }
  end
end
