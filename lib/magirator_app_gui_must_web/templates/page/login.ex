defmodule MagiratorAppGuiMustWeb.Login do

  def html do
      """
      <div>
        Name: <input type="text" id="name"><br>
        Pass: <input type="text" id="pass"><br>
        <button id="login">Login</button>
    </div>
    """
  end

  def behaviour do
    %{
      actions: [
        %{
          element: "login",
          action: "onclick",
          function: "execute",
          params: ["login", %{}]
        }
      ]
    }
  end
end