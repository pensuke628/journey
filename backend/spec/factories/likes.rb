FactoryBot.define do
  factory :like do
    association :user, factory: :user2
    association :review, factory: :review1
  end
end
