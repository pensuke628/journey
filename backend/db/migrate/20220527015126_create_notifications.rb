class CreateNotifications < ActiveRecord::Migration[6.1]
  def change
    create_table :notifications do |t|
      t.integer :sender_id, null: false
      t.integer :receiver_id, null: false
      t.references :review, foreign_key: true
      t.references :comment, foreign_key: true
      t.references :message, foreign_key: true
      t.string :action, default: '', null: false
      t.boolean :checked, default: false, null: false

      t.timestamps
    end
    add_index :notifications, :sender_id
    add_index :notifications, :receiver_id
  end
end
