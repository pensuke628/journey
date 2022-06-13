class Api::V1::LikesController < ApplicationController
  before_action :authenticate_api_v1_user!

  def index
    render json: {
      status: 200,
      like_reviews: current_api_v1_user.like_reviews
      # 自分がいいねした口コミ
    }
  end

  def create
    like = current_api_v1_user.likes.build(like_params)
    if like.save
      render status: :ok, json: { status: 200,
                                  data: like.review,
                                  message: 'Success Like Create' }
    else
      response_internal_server_error
    end
  end

  def destroy
    like = current_api_v1_user.likes.find_by(like_params)
    # bookmarkがnilであれば、NoMethodErrorを投げずにnilを返してくれる(Safe Navigation Operator)
    if like&.destroy
      response_success(:like, :destroy)
    else
      response_internal_server_error
    end
  end

  private

    def like_params
      params.permit(:review_id)
    end
end
