class Api::V1::RelationshipsController < ApplicationController
  before_action :authenticate_api_v1_user!

  def index
    render json: {
      status: 200,
      active_relationships: current_api_v1_user.following.ids,
      # 自分がフォローしているユーザー
      passive_relationships: current_api_v1_user.followers.ids
      # 自分がフォローされているユーザー
    }
  end

  def create
    user = User.find(params[:follower_id])
    other = User.find(params[:followed_id])
    # return unless current_api_v1_user

    follow = user.following_relationships.build(follow_params)
    if user == other
      response_bad_request
    elsif follow.save
      # 相互フォローしているかどうかのフラグ
      @is_mutual = false

      active_follow = Relationship.find_or_initialize_by(follow_params)
      passive_follow = Relationship.find_by(
        follower_id: active_follow.followed_id,
        followed_id: active_follow.follower_id
      )

      # 相手からのフォローが存在していれば、メッセージを送れるようになる
      if passive_follow

        # メッセージやりとりする部屋を作成する
        message_room = MessageRoom.create

        MessageRoomUser.find_or_create_by(
          user_id: active_follow.follower_id,
          message_room_id: message_room.id
        )

        MessageRoomUser.find_or_create_by(
          user_id: passive_follow.follower_id,
          message_room_id: message_room.id
        )
        @is_mutual = true
      end
      response_success(:relationship, :create)
      render status: :ok, json: { status: 200, message: 'Success Relationship create', is_mutual: @is_mutual }
    else
      response_internal_server_error
    end
  end

  def unfollow
    # user = User.find(params[:follower_id])
    # other = User.find(params[:followed_id])
    data = Relationship.find_by(
      follower_id: params[:data][:follower_id],
      followed_id: params[:data][:followed_id]
    )
    data.destroy
    response_success(:relationship, :destroy)
  end

  private

    def follow_params
      params.permit(:followed_id, :follower_id)
    end
end
