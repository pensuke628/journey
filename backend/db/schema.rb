# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 2022_06_02_003848) do

  create_table "bookmarks", charset: "utf8mb4", collation: "utf8mb4_0900_ai_ci", force: :cascade do |t|
    t.bigint "user_id", null: false
    t.bigint "house_id", null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["house_id"], name: "index_bookmarks_on_house_id"
    t.index ["user_id", "house_id"], name: "index_bookmarks_on_user_id_and_house_id", unique: true
    t.index ["user_id"], name: "index_bookmarks_on_user_id"
  end

  create_table "comments", charset: "utf8mb4", collation: "utf8mb4_0900_ai_ci", force: :cascade do |t|
    t.string "content"
    t.bigint "user_id", null: false
    t.bigint "review_id", null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["review_id"], name: "index_comments_on_review_id"
    t.index ["user_id", "review_id"], name: "index_comments_on_user_id_and_review_id", unique: true
    t.index ["user_id"], name: "index_comments_on_user_id"
  end

  create_table "houses", charset: "utf8mb4", collation: "utf8mb4_0900_ai_ci", force: :cascade do |t|
    t.string "name"
    t.string "postal_code"
    t.string "prefectures"
    t.string "municipalities"
    t.float "latitude"
    t.float "longitude"
    t.string "image"
    t.string "profile"
    t.string "phone_number"
    t.string "email"
    t.string "related_website"
    t.string "price"
    t.string "period"
    t.string "check_in_time"
    t.string "check_out_time"
    t.string "capacity"
    t.string "parking"
    t.string "bath"
    t.string "shopping"
    t.string "note"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
  end

  create_table "images", charset: "utf8mb4", collation: "utf8mb4_0900_ai_ci", force: :cascade do |t|
    t.string "image"
    t.bigint "review_id", null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["review_id"], name: "index_images_on_review_id"
  end

  create_table "likes", charset: "utf8mb4", collation: "utf8mb4_0900_ai_ci", force: :cascade do |t|
    t.bigint "user_id", null: false
    t.bigint "review_id", null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["review_id"], name: "index_likes_on_review_id"
    t.index ["user_id", "review_id"], name: "index_likes_on_user_id_and_review_id", unique: true
    t.index ["user_id"], name: "index_likes_on_user_id"
  end

  create_table "message_room_users", charset: "utf8mb4", collation: "utf8mb4_0900_ai_ci", force: :cascade do |t|
    t.integer "user_id", null: false
    t.integer "message_room_id", null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
  end

  create_table "message_rooms", charset: "utf8mb4", collation: "utf8mb4_0900_ai_ci", force: :cascade do |t|
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
  end

  create_table "messages", charset: "utf8mb4", collation: "utf8mb4_0900_ai_ci", force: :cascade do |t|
    t.text "content", null: false
    t.integer "user_id", null: false
    t.integer "message_room_id", null: false
    t.time "to_user_opentime"
    t.integer "review_id"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
  end

  create_table "notifications", charset: "utf8mb4", collation: "utf8mb4_0900_ai_ci", force: :cascade do |t|
    t.integer "sender_id", null: false
    t.integer "receiver_id", null: false
    t.bigint "review_id"
    t.bigint "comment_id"
    t.bigint "message_id"
    t.string "act", default: "", null: false
    t.boolean "checked", default: false, null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["comment_id"], name: "index_notifications_on_comment_id"
    t.index ["message_id"], name: "index_notifications_on_message_id"
    t.index ["receiver_id"], name: "index_notifications_on_receiver_id"
    t.index ["review_id"], name: "index_notifications_on_review_id"
    t.index ["sender_id", "receiver_id", "review_id", "comment_id", "message_id", "act"], name: "index_notification_on_foreign_keys", unique: true
    t.index ["sender_id"], name: "index_notifications_on_sender_id"
  end

  create_table "owners", charset: "utf8mb4", collation: "utf8mb4_0900_ai_ci", force: :cascade do |t|
    t.bigint "user_id", null: false
    t.bigint "house_id", null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["house_id"], name: "index_owners_on_house_id"
    t.index ["user_id", "house_id"], name: "index_owners_on_user_id_and_house_id", unique: true
    t.index ["user_id"], name: "index_owners_on_user_id"
  end

  create_table "relationships", charset: "utf8mb4", collation: "utf8mb4_0900_ai_ci", force: :cascade do |t|
    t.integer "follower_id"
    t.integer "followed_id"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["followed_id"], name: "index_relationships_on_followed_id"
    t.index ["follower_id", "followed_id"], name: "index_relationships_on_follower_id_and_followed_id", unique: true
    t.index ["follower_id"], name: "index_relationships_on_follower_id"
  end

  create_table "reviews", charset: "utf8mb4", collation: "utf8mb4_0900_ai_ci", force: :cascade do |t|
    t.text "content"
    t.date "date"
    t.bigint "user_id"
    t.bigint "house_id"
    t.float "evaluation"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["house_id"], name: "index_reviews_on_house_id"
    t.index ["user_id"], name: "index_reviews_on_user_id"
  end

  create_table "taggings", charset: "utf8mb4", collation: "utf8mb4_0900_ai_ci", force: :cascade do |t|
    t.bigint "house_id"
    t.bigint "review_id"
    t.bigint "tag_id", null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["house_id", "tag_id"], name: "index_taggings_on_house_id_and_tag_id", unique: true
    t.index ["house_id"], name: "index_taggings_on_house_id"
    t.index ["review_id", "tag_id"], name: "index_taggings_on_review_id_and_tag_id", unique: true
    t.index ["review_id"], name: "index_taggings_on_review_id"
    t.index ["tag_id"], name: "index_taggings_on_tag_id"
  end

  create_table "tags", charset: "utf8mb4", collation: "utf8mb4_0900_ai_ci", force: :cascade do |t|
    t.string "name"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["name"], name: "index_tags_on_name", unique: true
  end

  create_table "users", charset: "utf8mb4", collation: "utf8mb4_0900_ai_ci", force: :cascade do |t|
    t.string "name"
    t.string "email"
    t.string "avatar"
    t.string "profile"
    t.string "background_image"
    t.string "provider", default: "email", null: false
    t.string "uid", default: "", null: false
    t.string "encrypted_password", default: "", null: false
    t.string "reset_password_token"
    t.datetime "reset_password_sent_at"
    t.boolean "allow_password_change", default: false
    t.datetime "remember_created_at"
    t.string "confirmation_token"
    t.datetime "confirmed_at"
    t.datetime "confirmation_sent_at"
    t.string "unconfirmed_email"
    t.text "tokens"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["confirmation_token"], name: "index_users_on_confirmation_token", unique: true
    t.index ["email"], name: "index_users_on_email", unique: true
    t.index ["reset_password_token"], name: "index_users_on_reset_password_token", unique: true
    t.index ["uid", "provider"], name: "index_users_on_uid_and_provider", unique: true
  end

  add_foreign_key "bookmarks", "houses"
  add_foreign_key "bookmarks", "users"
  add_foreign_key "comments", "reviews"
  add_foreign_key "comments", "users"
  add_foreign_key "images", "reviews"
  add_foreign_key "likes", "reviews"
  add_foreign_key "likes", "users"
  add_foreign_key "notifications", "comments"
  add_foreign_key "notifications", "messages"
  add_foreign_key "notifications", "reviews"
  add_foreign_key "owners", "houses"
  add_foreign_key "owners", "users"
  add_foreign_key "reviews", "houses"
  add_foreign_key "reviews", "users"
  add_foreign_key "taggings", "houses"
  add_foreign_key "taggings", "reviews"
  add_foreign_key "taggings", "tags"
end
