class Image < ApplicationRecord
  mount_uploader :image, ImageUploader
  # validation
  validates :image, :review_id, presence: true
  # association
  belongs_to :review
end
