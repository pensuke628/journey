class Api::V1::ImagesController < ApplicationController
  before_action :authenticate_api_v1_user!

  def create
    image = Image.create(image_params)
    if image.save!
      response_success(:image, :create)
    else
      render json: image.errors, status: :unprocessable_entity
    end
  end

  private

    def image_params
      params.permit(:image, :review_id)
    end
end
