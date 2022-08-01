class Api::V1::ReviewsController < ApplicationController
  before_action :authenticate_api_v1_user!, except: %i[show]
  before_action :set_review, only: %i[show update]
  before_action :set_tag_list, only: %i[create update]

  def create
    review = current_api_v1_user.reviews.build(review_params)
    if review.save
      review.save_tag(@tag_list) if @tag_list.present?
      render status: :ok, json: { status: 200,
                                  review: review,
                                  tags: review.tags,
                                  message: 'Success Review Create' }
    else
      render json: review.errors, status: :unprocessable_entity
    end
  end

  def show
    render json: @review,
           status: :ok,
           each_serializer: ReviewSerializer,
           include: [{ comments: :user }, :user, :house, :tags, :images]
  end

  def update
    if @review.update(review_params)
      @review.save_tag(@tag_list)
      response_success(:review, :update)
    else
      render json: @review.errors, status: :unprocessable_entity
    end
  end

  def destroy
    @review = Review.find(params[:id])
    # before_actionで定義すると、Userモデルを探しにいくバグ？
    if @review.user_id == current_api_v1_user.id
      @review.destroy
      response_success(:review, :destroy)
    else
      response_internal_server_error
    end
  end

  private

    def review_params
      params.permit(:content, :date, :user_id, :house_id, :evaluation)
    end

    def set_review
      @review = Review.find(params[:id])
    end

    def set_tag_list
      @tag_list = params[:tags].split(nil) if params[:tags].present?
    end
end
