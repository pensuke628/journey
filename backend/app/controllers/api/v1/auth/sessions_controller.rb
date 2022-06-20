class Api::V1::Auth::SessionsController < ApplicationController
  def index
    if current_api_v1_user
      render json: { is_login: true,
                     data: current_api_v1_user,
                     bookmarks: current_api_v1_user.bookmark_houses,
                     followers: current_api_v1_user.followers,
                     following: current_api_v1_user.following,
                     likes: current_api_v1_user.like_reviews,
                     notifications: current_api_v1_user.passive_notifications.order_new,
                     owners: current_api_v1_user.owner_houses }
    else
      render json: { is_login: false, message: 'ユーザーが存在しません' }
    end
  end
end
