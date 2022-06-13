class CreateOwners < ActiveRecord::Migration[6.1]
  def change
    create_table :owners do |t|
      t.references :user, null: false, foreign_key: true
      t.references :house, null: false, foreign_key: true

      t.timestamps
    end
    add_index :owners, %i[user_id house_id], unique: true
  end
end
