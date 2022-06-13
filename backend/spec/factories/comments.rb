FactoryBot.define do
  factory :comment do
    content { '口コミへのコメントテストです' }
    association :user, factory: :user2
    association :review, factory: :review1
  end
end
