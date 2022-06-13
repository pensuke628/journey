class CreateHouses < ActiveRecord::Migration[6.1]
  def change
    create_table :houses do |t|
      t.string :name
      t.string :postal_code
      t.string :prefectures
      t.string :municipalities
      t.float :latitude
      t.float :longitude
      t.string :image
      t.string :profile
      t.string :phone_number
      t.string :email
      t.string :related_website
      t.string :price
      t.string :period
      t.string :check_in_time
      t.string :check_out_time
      t.string :capacity
      t.string :parking
      t.string :bath
      t.string :shopping
      t.string :note
      t.timestamps
    end
  end
end
