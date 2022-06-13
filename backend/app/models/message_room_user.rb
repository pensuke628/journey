class MessageRoomUser < ApplicationRecord
  # validation
  validates :user_id, :message_room_id, presence: true
  # association
  belongs_to :user
  belongs_to :message_room
end
