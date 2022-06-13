FactoryBot.define do
  factory :review1, class: 'Review' do
    content { 'テスト投稿です' }
    date { '2021-01-01' }
    association :user, factory: :user1
    association :house, factory: :hokkaido

    factory :review2 do
      content { '青森に行ったよ' }
      date { '2022-01-01' }
      # association :house, factory: :aomori
    end

    factory :review3 do
      content { '青森最高!' }
      date { '2022-01-01' }
      association :user, factory: :user2
      association :house, factory: :aomori
    end
  end
end
