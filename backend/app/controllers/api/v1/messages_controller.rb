class Api::V1::MessagesController < ApplicationController
  before_action :authenticate_api_v1_user!

  def create
    message = Message.new(message_params)
    message_room = MessageRoom.find(params[:message_room_id])
    other_user = message_room.message_room_users.where.not(id: current_api_v1_user.id)[0]
    if message.save
      render json: { status: 200, message: message, other: other_user }
    else
      response_internal_server_error
    end
  end

  private

    def message_params
      params.permit(:content, :user_id, :message_room_id)
    end
end
