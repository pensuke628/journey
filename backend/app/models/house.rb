class House < ApplicationRecord
  mount_uploader :image, ImageUploader

  # municipalitiesカラムを基準に緯度経度を算出する
  geocoded_by :municipalities
  # 住所変更時に経度緯度も変更する
  after_validation :geocode
  # validation
  validates :name, :prefectures, presence: true
  validates :postal_code, length: { is: 7 }, allow_blank: true
  # association
  has_many :bookmarks, dependent: :destroy

  has_many :reviews, dependent: :destroy

  has_many :owners, dependent: :destroy
  has_many :owner_users, through: :owners, source: :user

  has_many :taggings, dependent: :destroy
  has_many :tags, through: :taggings

  def save_tag(sent_tags)
    # 現在の投稿に紐づいているタグを取得する
    current_tags = tags.pluck(:name) unless tags.nil?

    # タグを全て削除したい場合は、old_tagsのみ定義する
    if !sent_tags.nil?
      # 現在紐づいているタグと登録処理時に渡されたタグの差分をとり、削除したいタグのみを取得
      old_tags = current_tags - sent_tags

      # 登録処理時に渡されたタグと現在紐づいているタグの差分をとり、追加したいタグのみを取得
      new_tags = sent_tags - current_tags
    else
      old_tags = current_tags
    end

    # 更新前のみ紐づいていたタグを削除する
    old_tags.each do |old_tag|
      delete_tag = Tag.find_by(name: old_tag)
      tags.delete(delete_tag)
    end

    # 更新後のみ紐づいていたタグを追加する
    return if new_tags.nil?

    new_tags.each do |new_tag|
      tagging = Tag.find_or_create_by(name: new_tag)
      tags << tagging
    end
  end
end
