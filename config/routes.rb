Rails.application.routes.draw do
  mount JasmineRails::Engine => '/specs' if defined?(JasmineRails)

  root 'map#index'
  get 'trip_for/:bike_id/after/:offset' => 'map#trip'
  get 'bike_for/:trip_id' => 'map#bike'
end
