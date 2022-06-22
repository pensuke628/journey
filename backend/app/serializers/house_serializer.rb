class HouseSerializer < ActiveModel::Serializer
  attributes :id,
             :name,
             :postal_code,
             :prefectures,
             :municipalities,
             :latitude,
             :longitude,
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

  has_many :reviews, serializer: ReviewSerializer do
    object.reviews.order_new
  end
  has_many :tags
end
