class User < ApplicationRecord
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable, :trackable and :omniauthable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :validatable
  include DeviseTokenAuth::Concerns::User

  mount_uploader :avatar, AvatarUploader

  # validation
  validates :name, presence: true
  # association
  has_many :following_relationships,
           class_name: 'Relationship',
           foreign_key: 'follower_id',
           dependent: :destroy,
           inverse_of: 'follower'
  has_many :following,
           through: :following_relationships,
           source: :followed
  # user.followingはuserがフォローしているuserの集合
  has_many :follower_relationships,
           class_name: 'Relationship',
           foreign_key: 'followed_id',
           dependent: :destroy,
           inverse_of: 'followed'
  has_many :followers,
           through: :follower_relationships,
           source: :follower
  # user.followersはuserをフォローしているuserの集合
  has_many :reviews, dependent: :destroy

  has_many :bookmarks, dependent: :destroy
  has_many :bookmark_houses, through: :bookmarks, source: :house

  has_many :comments, dependent: :destroy

  has_many :likes, dependent: :destroy
  has_many :like_reviews, through: :likes, source: :review

  has_many :message_room_users, dependent: :destroy
  has_many :message_rooms, through: :message_room_users

  has_many :messages, dependent: :destroy

  has_many :owners, dependent: :destroy
  has_many :owner_houses, through: :owners, source: :house

  has_many :active_notifications,
           class_name: 'Notification',
           foreign_key: 'sender_id',
           dependent: :destroy,
           inverse_of: 'sender'

  has_many :passive_notifications,
           class_name: 'Notification',
           foreign_key: 'receiver_id',
           dependent: :destroy,
           inverse_of: 'receiver'
end
