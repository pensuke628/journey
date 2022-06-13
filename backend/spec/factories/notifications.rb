FactoryBot.define do
  factory :notification do
    association :sender, factory: :user1
    association :receiver, factory: :user2
    review { nil }
    comment { nil }
    message { nil }
    act { 'follow' }
    checked { false }

    factory :notification2 do
      sender { User.first }
      association :receiver, factory: :user3
    end
  end
end
