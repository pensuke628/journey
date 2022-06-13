class Api::V1::CommentsController < ApplicationController
  before_action :authenticate_api_v1_user!
  before_action :check_owner, only: %i[create update]
  before_action :set_comment, only: %i[update destroy]

  def create
    comment = current_api_v1_user.comments.build(comment_params)
    other_user = comment.review.user
    if @owner_auth && comment.save!
      render json: { status: 200, comment: comment, other: other_user }
    else
      render json: comment.errors, status: :unprocessable_entity
    end
  end

  def update
    if @owner_auth && @comment.update(comment_params)
      render json: { status: 200, comment: @comment }
    else
      render json: @comment.errors, status: :unprocessable_entity
    end
  end

  def destroy
    if @comment.destroy
      response_success(:comment, :destroy)
    else
      render json: @comment.errors, status: :unprocessable_entity
    end
  end

  private

    def comment_params
      params.permit(:content, :user_id, :review_id)
    end

    def check_owner
      # オーナーであるかどうかを判定するフラグ
      @owner_auth = false

      review = Review.find(params[:review_id])
      house = review.house
      # 施設のオーナー一覧に含まれていれば、オーナー権限をtrueにする
      @owner_auth = true if house.owner_users.include?(current_api_v1_user)
    end

    def set_comment
      @comment = Comment.find(params[:id])
    end
end
