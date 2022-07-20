class UserSerializer < ActiveModel::Serializer
  attributes :id,
             :name,
             :email,
             :avatar,
             :profile,
             :background_image,
             :provider,
             :uid

  has_many :reviews, serializer: ReviewSerializer do
    object.reviews.visit_new
  end
  has_many :following
  has_many :followers
end
