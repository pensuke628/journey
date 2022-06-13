FactoryBot.define do
  factory :relationship do
    association :follower, factory: :user1
    association :followed, factory: :user2
  end
end
