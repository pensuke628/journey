class Api::V1::NotificationsController < ApplicationController
  before_action :authenticate_api_v1_user!

  def index
    render json: {
      status: 200,
      notifications: current_api_v1_user.passive_notifications.order_new
      # 自分宛の通知を日付が新しい順で返す
    }
  end

  def create
    notification = Notification.new(notification_params)
    # 自分から自分への通知はチェック済みとする
    notification.checked = true if notification.sender_id == notification.receiver_id
    if notification.save!
      response_success(:notification, :create)
    else
      render json: notification.errors, status: :unprocessable_entity
    end
  end

  def follower_notification
    current_user = User.find(params[:sender_id])
    followers = current_user.followers
    followers.each do |follower|
      notification = Notification.new(notification_params)
      notification.receiver_id = follower.id
      notification.save
    end
    render json: { status: 200 }
  end

  private

    def notification_params
      params.permit(:sender_id, :receiver_id, :review_id, :comment_id, :message_id, :act)
    end
end
