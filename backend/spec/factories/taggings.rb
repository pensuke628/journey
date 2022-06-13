FactoryBot.define do
  factory :tagging do
    association :house, factory: :hokkaido
    review { nil }
    association :tag
  end
end
