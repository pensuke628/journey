class ReviewSerializer < ActiveModel::Serializer
  attributes :id,
             :content,
             :date,
             :evaluation

  belongs_to :user
  belongs_to :house
  has_many :comments
  has_many :tags
  has_many :images
end
