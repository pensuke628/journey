FactoryBot.define do
  factory :message_room_user do
    association :user, factory: :user1
    association :message_room
  end
end
