class ReviewSerializer < ActiveModel::Serializer
  attributes :id,
             :content,
             :date,
             :evaluation,
             :house_id

  belongs_to :user
  has_many :comments
  has_many :tags
  has_many :images
end
