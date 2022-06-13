FactoryBot.define do
  factory :owner do
    association :user, factory: :user1
    association :house, factory: :hokkaido
  end
end
