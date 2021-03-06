class Api::V1::UsersController < ApplicationController
  before_action :set_user, only: %i[show update]

  def index
    users = User.all
    render json: users
  end

  def show
    render json: @user, each_serializer: UserSerializer, include: [{ reviews: :house }, :following, :followers]
  end

  def update
    # ゲストユーザーはユーザー名とemailを変更できないようにする
    if @user.name == 'ゲストユーザー'
      @user.update(guest_user_params)
    else
      @user.update(user_params)
    end
    response_success(:user, :update)
  end

  private

    def user_params
      params.permit(:id, :name, :email, :profile, :avatar, :background_image)
    end

    def guest_user_params
      params.permit(:id, :profile, :avatar, :background_image)
    end

    def set_user
      @user = User.find(params[:id])
    end
end
