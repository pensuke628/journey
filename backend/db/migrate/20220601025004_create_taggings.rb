class CreateTaggings < ActiveRecord::Migration[6.1]
  def change
    create_table :taggings do |t|
      t.references :house, foreign_key: true
      t.references :review, foreign_key: true
      t.references :tag, null: false, foreign_key: true

      t.timestamps
    end
    add_index :taggings, %i[house_id tag_id], unique: true
    add_index :taggings, %i[review_id tag_id], unique: true
  end
end
