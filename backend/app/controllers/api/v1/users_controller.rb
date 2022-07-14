class Api::V1::UsersController < ApplicationController
  before_action :set_user, only: %i[show update]

  def index
    users = User.all
    render json: users
  end

  def show
    render json: @user, each_serializer: UserSerializer, include: %i[reviews following followers]
  end

  def update
    if @user.update(user_params)
      response_success(:user, :update)
    else
      render json: @user.errors, status: :unprocessable_entity
    end
  end

  private

    def user_params
      params.permit(:id, :name, :email, :profile, :avatar, :background_image)
    end

    def set_user
      @user = User.find(params[:id])
    end
end
