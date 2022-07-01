class Api::V1::TagsController < ApplicationController
  before_action :set_tag

  def searchhouses
    render json: @tag.tagging_houses
  end

  def searchreviews
    render json: @tag.tagging_reviews
  end

  private

    def set_tag
      @tag = Tag.find_by(name: params[:name])
    end
end
