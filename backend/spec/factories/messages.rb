FactoryBot.define do
  factory :message do
    content { 'テスト' }
    association :user, factory: :user1
    association :message_room
    to_user_opentime { nil }
    review_id { nil }
  end
end
