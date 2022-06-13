class NotificationChannel < ApplicationCable::Channel
  def subscribed
    user = User.find(params[:user_id])
    channel = "notification_channel_#{params[:user_id]}"
    stream_from channel if user.present?
    ActionCable.server.broadcast "notification_channel_#{params[:user_id]}", { message: user.passive_notifications }
    # NotificationChannel.broadcast_to(channel, { message: user.passive_notifications })
  end

  def unsubscribed
    # Any cleanup needed when channel is unsubscribed
  end

  def broadcast_messages
    channel = "notification_channel_#{params[:user_id]}"
    # ActionCable.server.broadcast channel, { message: 'ブロードキャストのテスト' }
    NotificationChannel.broadcast_to(channel, { massage: 'ブロードキャストのテスト' })
  end
end
