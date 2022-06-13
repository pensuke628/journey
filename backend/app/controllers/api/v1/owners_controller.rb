class Api::V1::OwnersController < ApplicationController
  before_action :authenticate_api_v1_user!
  before_action :check_or_create_message_room, only: [:delete_request]

  def index
    render json: {
      status: 200,
      owner_houses: current_api_v1_user.owner_houses
      # 自分が管理者である施設
    }
  end

  def create
    owner = current_api_v1_user.owners.build(owner_params)
    if owner.save
      response_success(:owner, :create)
    else
      render json: owner.errors, status: :unprocessable_entity
    end
  end

  def delete_request
    message = Message.new(message_params)
    message.content = '口コミの削除依頼です'
    message.message_room_id = @message_room_id || @newroom.id

    if message.save
      response_success(:owner, :delete_request)
    else
      render json: message.errors, status: :unprocessable_entity
    end
  end

  private

    def owner_params
      params.permit(:user_id, :house_id)
    end

    def message_params
      params.permit(:user_id, :review_id)
    end

    def check_or_create_message_room
      admin = User.find(1)
      sender = User.find(params[:user_id])
      # idが1である管理者とメッセージ作成者の属するMessageRoomのidを取得する
      if (admin.message_rooms && sender.message_rooms).present?
        @message_room_id = (admin.message_rooms && sender.message_rooms).ids[0]
      else
        # MessageRoomがnilの場合は、MessageRoomを作成する
        MessageRoom.create
        @newroom = MessageRoom.last
        @newroom.message_room_users.create(user_id: admin.id)
        @newroom.message_room_users.create(user_id: params[:user_id])
      end
    end
end
