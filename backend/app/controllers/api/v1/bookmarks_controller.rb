class Api::V1::BookmarksController < ApplicationController
  before_action :authenticate_api_v1_user!

  def index
    render json: {
      status: 200,
      bookmark_houses: current_api_v1_user.bookmark_houses
      # 自分がお気に入りしているハウス
    }
  end

  def create
    if current_api_v1_user.bookmarks.create(bookmark_params)
      response_success(:bookmark, :create)
    else
      response_internal_server_error
    end
  end

  def destroy
    bookmark = current_api_v1_user.bookmarks.find_by(bookmark_params)
    # bookmarkがnilであれば、NoMethodErrorを投げずにnilを返してくれる(Safe Navigation Operator)
    if bookmark&.destroy
      response_success(:bookmark, :destroy)
    else
      response_internal_server_error
    end
  end

  private

    def bookmark_params
      params.permit(:house_id)
    end
end
