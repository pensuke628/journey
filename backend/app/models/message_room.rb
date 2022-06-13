class MessageRoom < ApplicationRecord
  # associsation
  has_many :message_room_users, dependent: :nullify
  has_many :users, through: :message_room_users
  has_many :messages, dependent: :nullify
  # dependent: :nullify => messageroomが削除された場合は、外部キーにnullが入る
end
