Rails.application.routes.draw do
  root to: 'categories#index'

  resources :categories, only: :index

  namespace :api do
    resources :categories, only: :index
  end
  # For details on the DSL available within this file, see https://guides.rubyonrails.org/routing.html
end
