class Api::V1::Auth::SessionsController < ApplicationController
  def index
    if current_api_v1_user
      notifications = Notification.where(receiver_id: current_api_v1_user.id)
                                  .order_new
                                  .limit(9)
                                  .as_json(except: [:sender_id], include: 'sender')
      render json: { is_login: true,
                     data: current_api_v1_user,
                     bookmarks: current_api_v1_user.bookmark_houses,
                     followers: current_api_v1_user.followers,
                     following: current_api_v1_user.following,
                     likes: current_api_v1_user.like_reviews,
                     notifications: notifications,
                     owners: current_api_v1_user.owner_houses }
    else
      render json: { is_login: false, message: 'ユーザーが存在しません' }
    end
  end
end
