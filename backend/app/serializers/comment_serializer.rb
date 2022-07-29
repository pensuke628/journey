class CommentSerializer < ActiveModel::Serializer
  attributes :id,
             :content,
             :review_id

  belongs_to :user
end
