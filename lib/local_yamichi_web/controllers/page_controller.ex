defmodule LocalYamichiWeb.PageController do
  use LocalYamichiWeb, :controller

  def index(conn, _params) do
    render conn, "index.html"
  end

  def stats(con, %{"action" => this_action}) do
  	HTTPoison.request(:post, "https://tofu.wtf/stats", URI.encode_query(%{ domain: "silly-words", action: this_action }), ["Content-Type": "application/x-www-form-urlencoded"])
  	text con, "ok"
  end

  def stats(con, _params) do
  	text con, "not okay"
  end
end
