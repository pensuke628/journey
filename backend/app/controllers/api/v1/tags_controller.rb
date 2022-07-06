class Api::V1::TagsController < ApplicationController
  before_action :set_tag

  def searchhouses
    if @tag
      render json: @tag.tagging_houses
    else
      response_internal_server_error
    end
  end

  def searchreviews
    if @tag
      render json: @tag.tagging_reviews
    else
      response_internal_server_error
    end
  end

  private

    def set_tag
      @tag = Tag.find_by(name: params[:name])
    end
end
