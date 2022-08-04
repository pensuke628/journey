class Api::V1::NotificationsController < ApplicationController
  before_action :authenticate_api_v1_user!

  def index
    render json: {
      status: 200,
      notifications: current_api_v1_user.passive_notifications.order_new.limit(9)
      # 自分宛の通知を日付が新しい順で最大9件返す
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

  def checked_notification
    current_user = User.find(params[:id])
    notifications = current_user.passive_notifications.unread_only
    notifications.each do |notification|
      notification.update!(checked: true)
    end
    if current_user.passive_notifications.unread_only.count.zero?
      render json: { status: 200 }
    else
      render json: { status: :unprocessable_entity }
    end
  end

  # デバッグ用
  def reset_notification
    current_user = User.find(1)
    notifications = current_user.passive_notifications
    notifications.each do |notification|
      notification.update!(checked: false)
    end
  end

  private

    def notification_params
      params.permit(:sender_id, :receiver_id, :review_id, :comment_id, :message_id, :act)
    end

    def notification_update_params
      params.permit(:id, :checked)
    end
end
