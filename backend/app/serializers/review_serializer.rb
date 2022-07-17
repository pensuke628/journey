class ReviewSerializer < ActiveModel::Serializer
  attributes :id,
             :content,
             :date,
             :evaluation,
             :user_id,
             :house_id

  belongs_to :user
  has_many :comments
  has_many :tags
  has_many :images
end
