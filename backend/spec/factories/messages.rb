FactoryBot.define do
  factory :message do
    content { 'ใในใ' }
    association :user, factory: :user1
    association :message_room
    to_user_opentime { nil }
    review_id { nil }
  end
end
