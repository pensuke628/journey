class Bookmark < ApplicationRecord
  # validation
  validates :user_id, presence: true
  validates :house_id, presence: true
  # association
  belongs_to :user
  belongs_to :house
end
