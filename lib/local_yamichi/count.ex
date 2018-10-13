defmodule LocalYamichi.Count do
  @moduledoc "The store, based on `Agent`."

  import Logger
  @file_name "count.txt"

  def start_link do
    count = case File.open(@file_name, [:read, :utf8]) do
      {:ok, file} -> 
        count = IO.read(file, :all) |> String.to_integer
        Logger.debug "read count #{count}"
        count
      {:error, _} -> 0
    end
    Logger.debug "count is #{count}"
    Agent.start_link(fn -> count end, name: __MODULE__)
  end

  @doc "Gets a value"
  def get() do
    Agent.get(__MODULE__, fn state -> state end)
  end

  def get_and_update() do
    count = Agent.get_and_update(__MODULE__, fn state -> {state, state + 1} end)
    counter = Integer.to_string count
    
    Task.start_link(fn -> 
      case File.open(@file_name, [:write, :utf8]) do
        {:ok, file} -> 
          IO.write(file, counter)
          Logger.debug "writing to file, count is #{count}"
        {:error, _} -> Logger.debug "did not manage to write to file, count was #{count}"
      end
    end)

    cond do
      String.length(counter) == 3 -> counter
      String.length(counter) == 2 -> "0" <> counter
      String.length(counter) == 1 -> "00" <> counter
    end
  end
end
