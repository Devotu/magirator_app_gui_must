defmodule MagiratorAppGuiMustWeb.Login do

  def html do
    """
    <div id="login">
      Name: <input type="text" id="name" value="Adam"><br>
      Pass: <input type="text" id="pass" value="Hemligt"><br>
      <button name="login">Login</button>
    </div>
    """
  end

  def behaviour do
    %{
      actions: [
        %{
          element: "login",
          action: "click",
          function: "execute",
          params: %{
            action: "login",
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
end