defmodule LocalYamichiWeb.Router do
  use LocalYamichiWeb, :router

  pipeline :browser do
    plug :accepts, ["html"]
    plug :fetch_session
    # plug :fetch_flash
    # plug :protect_from_forgery
    plug :put_secure_browser_headers
  end

  pipeline :api do
    plug :accepts, ["json"]
  end

  scope "/", LocalYamichiWeb do
    pipe_through :browser # Use the default browser stack

    get "/", PageController, :index
    post "/like", LikeController, :like
    post "/stats", PageController, :stats
  end

end
