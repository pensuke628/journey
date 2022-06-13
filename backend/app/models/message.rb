class Message < ApplicationRecord
  # validation
  validates :content, :user_id, :message_room_id, presence: true
  # review_idに値を含む場合、reviewテーブルに存在するか確認する
  validates :review, presence: true, if: :review_id?

  # association
  belongs_to :user
  belongs_to :message_room
  belongs_to :review, optional: true

  has_many :notifications, dependent: :destroy
end
