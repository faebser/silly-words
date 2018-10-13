defmodule LocalYamichiWeb.LikeController do
  use LocalYamichiWeb, :controller
  alias LocalYamichi.Count

  def like(conn, %{"name" => name, "phrase" => phrase}) do
  	counter = Count.get_and_update
  	port = Port.open({:spawn, "python2.7 /home/faebser/workspace/yamichi/printer.py"}, [:binary])
  	send port, {self(), {:command, counter <> "\n"}}
  	send port, {self(), {:command, phrase <> "\n"}}
  	send port, {self(), :close}
  	# HTTPoison.request(:post, "https://tofu.wtf/buzzwords", URI.encode_query(%{ name: name, phrase: phrase }), ["Content-Type": "application/x-www-form-urlencoded"])
  	# HTTPoison.request(:post, "http://localhost:8081/buzzwords", URI.encode_query(%{ name: name, phrase: phrase }), ["Content-Type": "application/x-www-form-urlencoded"])
    text conn, "ok"
  end

   def like(conn, _params) do
    text conn, "not ok"
  end
end
