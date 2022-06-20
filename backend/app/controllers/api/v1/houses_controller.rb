class Api::V1::HousesController < ApplicationController
  before_action :set_house, only: %i[show update destroy]
  before_action :set_tag_list, only: %i[create update]

  def index
    houses = House.all
    # render json: houses, each_serializer: HouseSerializer
    render json: houses
  end

  def create
    house = House.new(house_params)
    if house.save
      house.save_tag(@tag_list) if @tag_list.present?
      response_success(:house, :create)
    else
      render json: house.errors, status: :unprocessable_entity
    end
  end

  def show
    render json: @house, each_serializer: HouseSerializer, include: [{ reviews: %i[tags images] }, :tags]
  end

  def update
    if @house.update!(house_params)
      @house.save_tag(@tag_list)
      response_success(:house, :update)
    else
      render json: @house.errors, status: :unprocessable_entity
    end
  end

  def destroy
    response_success(:house, :destroy) if @house.destroy
  end

  private

    def set_house
      @house = House.find(params[:id])
    end

    def house_params
      params.permit(
        :name,
        :postal_code,
        :prefectures,
        :municipalities,
        :image,
        :profile,
        :phone_number,
        :email,
        :related_website,
        :price,
        :period,
        :check_in_time,
        :check_out_time,
        :capacity,
        :parking,
        :bath,
        :shopping,
        :note
      )
    end

    def set_tag_list
      @tag_list = params[:tags].split(nil) if params[:tags].present?
    end
end
