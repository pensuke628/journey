class Tag < ApplicationRecord
  validates :name, uniqueness: true, presence: true, length: { maximum: 20 }

  has_many :taggings, dependent: :destroy
  has_many :tagging_houses, through: :taggings, source: :house
  has_many :tagging_reviews, through: :taggings, source: :review
end
