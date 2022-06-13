class Like < ApplicationRecord
  # validation
  validates :user_id, presence: true
  validates :review_id, presence: true
  # association
  belongs_to :user
  belongs_to :review
end
