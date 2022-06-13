class Api::V1::UsersController < ApplicationController
  before_action :set_user, only: %i[show]

  def index
    users = User.all
    render json: users
  end

  def show
    render json: @user, each_serializer: UserSerializer, include: [:reviews]
  end

  private

    def set_user
      @user = User.find(params[:id])
    end
end
