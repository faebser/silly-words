defmodule LocalYamichiWeb.LikeController do
  use LocalYamichiWeb, :controller
  alias LocalYamichi.Count

  @printer_path Application.get_env(:local_yamichi, :printer)

  def like(conn, %{"name" => name, "phrase" => phrase}) do
  	counter = Count.get_and_update
  	port = Port.open({:spawn, @printer_path}, [:binary])
  	send port, {self(), {:command, counter <> "\n"}}
  	send port, {self(), {:command, phrase <> "\n"}}
  	send port, {self(), :close}
    # just set name to linz
  	# HTTPoison.request(:post, "https://tofu.wtf/buzzwords", URI.encode_query(%{ name: name, phrase: phrase }), ["Content-Type": "application/x-www-form-urlencoded"])
  	# HTTPoison.request(:post, "http://localhost:8081/buzzwords", URI.encode_query(%{ name: name, phrase: phrase }), ["Content-Type": "application/x-www-form-urlencoded"])
    text conn, "ok"
  end

   def like(conn, _params) do
    text conn, "not ok"
  end
end
