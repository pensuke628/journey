class Owner < ApplicationRecord
  # validation
  validates :user_id, :house_id, presence: true
  # association
  belongs_to :user
  belongs_to :house
end
