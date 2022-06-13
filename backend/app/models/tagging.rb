class Tagging < ApplicationRecord
  validates :tag_id, presence: true

  belongs_to :house, optional: true
  belongs_to :review, optional: true
  belongs_to :tag
end
