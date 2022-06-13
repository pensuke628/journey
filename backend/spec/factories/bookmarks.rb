FactoryBot.define do
  factory :bookmark do
    association :user, factory: :user1
    association :house, factory: :hokkaido
  end
end
