class Relationship < ApplicationRecord
  # validation
  validates :follower_id, :followed_id, presence: true
  # association
  belongs_to :follower, class_name: 'User'
  # 自分をフォローしているユーザー
  belongs_to :followed, class_name: 'User'
  # 自分がフォローしているユーザー
end
