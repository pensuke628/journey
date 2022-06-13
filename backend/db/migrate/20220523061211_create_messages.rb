class CreateMessages < ActiveRecord::Migration[6.1]
  def change
    create_table :messages do |t|
      t.text :content, null: false
      t.integer :user_id, null: false
      t.integer :message_room_id, null: false
      t.time :to_user_opentime
      t.integer :review_id

      t.timestamps
    end
  end
end
