defmodule LocalYamichiWeb.PageController do
  use LocalYamichiWeb, :controller

  require Logger

  @send_stats Application.get_env(:local_yamichi, :send_stats)

  def index(conn, _params) do
    render conn, "index.html"
  end

  def stats(con, %{"action" => this_action}) do
    Logger.debug "send_stats is #{@send_stats}"

    case @send_stats do
      true -> HTTPoison.request(:post, "https://tofu.wtf/stats", URI.encode_query(%{ domain: "silly-words", action: this_action }), ["Content-Type": "application/x-www-form-urlencoded"])
      false -> Logger.debug "not sending #{this_action} stats"
    end
  	text con, "ok"
  end

  def stats(con, _params) do
  	text con, "not okay"
  end
end
