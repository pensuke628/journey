class AddIndexToNotifications < ActiveRecord::Migration[6.1]
  def change
    add_index :notifications,
              %i[sender_id receiver_id review_id comment_id message_id act],
              unique: true,
              name: 'index_notification_on_foreign_keys'
  end
end
