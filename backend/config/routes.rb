Rails.application.routes.draw do
  mount ActionCable.server => '/cable'
  root 'api/v1/houses#index'
  namespace :api do
    namespace :v1 do
      get :health_check, to: 'health_check#index'
      mount_devise_token_auth_for 'User', at: 'auth', controllers: {
        registrations: 'api/v1/auth/registrations'
      }
      namespace :auth do
        resources :sessions, only: %i[index]
      end
      resources :users, only: %i[index show]
      resources :bookmarks, only: %i[index create] do
        collection do
          delete :destroy
        end
      end
      resources :comments, only: %i[create update destroy]
      resources :images, only: %i[create destroy]
      resources :likes, only: %i[index create] do
        collection do
          delete :destroy
        end
      end
      resources :houses, only: %i[index create show update destroy]
      resources :relationships, only: %i[index create] do
        collection do
          delete :unfollow
        end
      end
      resources :messages, only: %i[create]
      resources :message_rooms, only: %i[index show]
      resources :notifications, only: %i[index create] do
        collection do
          post :follower_notification
        end
      end
      resources :owners, only: %i[index create] do
        collection do
          post :delete_request
        end
      end
      resources :reviews, only: %i[create show update destroy]
    end
  end
  # For details on the DSL available within this file, see https://guides.rubyonrails.org/routing.html
end
