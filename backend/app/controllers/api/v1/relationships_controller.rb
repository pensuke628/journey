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
      response_success(:relationship, :create)
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
