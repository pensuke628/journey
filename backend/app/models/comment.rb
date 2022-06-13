class Comment < ApplicationRecord
  # validation
  validates :content, :user_id, :review_id, presence: true
  # association
  belongs_to :user
  belongs_to :review

  has_many :notifications, dependent: :destroy
end
