class UserSerializer < ActiveModel::Serializer
  attributes :id,
             :name,
             :email,
             :avatar,
             :profile,
             :background_image,
             :provider,
             :uid

  has_many :reviews
end
