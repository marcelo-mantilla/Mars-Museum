Rails.application.routes.draw do
  root 'home#ponder'
  get 'mars-museum' => 'museum#index'
  get 'world-within' => 'world_within#index'
  get 'about' => 'about#index'
end
