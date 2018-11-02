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
end