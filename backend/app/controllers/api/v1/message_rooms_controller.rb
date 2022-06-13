class Api::V1::MessageRoomsController < ApplicationController
  before_action :authenticate_api_v1_user!
  before_action :set_message_room, only: %i[show]

  def index
    message_rooms = []
    current_api_v1_user.message_rooms.order('created_at DESC').each do |message_room|
      # 部屋の情報（相手のユーザーは誰か、最後に送信されたメッセージはどれか）をJSON形式で作成
      message_rooms << {
        message_room: message_room,
        other_user: message_room.users.where.not(id: current_api_v1_user.id)[0],
        last_message: message_room.messages[-1]
      }
    end

    render json: { status: 200, message_rooms: message_rooms }
  end

  def show
    other_user = @message_room.users.where.not(id: current_api_v1_user.id)[0]
    messages = @message_room.messages.order('created_at ASC')

    render json: { status: 200, other_user: other_user, messages: messages }
  end

  private

    def set_message_room
      @message_room = MessageRoom.find(params[:id])
    end
end
