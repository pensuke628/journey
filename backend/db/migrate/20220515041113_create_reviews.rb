class CreateReviews < ActiveRecord::Migration[6.1]
  def change
    create_table :reviews do |t|
      t.text :content
      t.date :date
      t.references :user, foreign_key: true
      t.references :house, foreign_key: true
      t.float :evaluation

      t.timestamps
    end
  end
end
