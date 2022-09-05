class Notification < ApplicationRecord
  # validations
  validates :sender_id, :receiver_id, :act, presence: true
  # sender_id, receiver_id, review_id, comment_id, ,message_id, actionが全て同じであるレコードは重複できない
  validates :sender_id, uniqueness: {
    scope: %i[receiver_id review_id comment_id message_id act]
  }
  # scope
  scope :order_new, -> { order(created_at: :desc) }
  scope :unread_only, -> { where(checked: false) }

  # association
  # 通知を送ったユーザー
  belongs_to :sender, class_name: 'User'
  # 通知を送られたユーザー
  belongs_to :receiver, class_name: 'User'
  # optional: trueで各カラムにnullが入ることを許容する
  belongs_to :review, optional: true
  belongs_to :comment, optional: true
  belongs_to :message, optional: true
end
