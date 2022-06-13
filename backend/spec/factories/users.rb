FactoryBot.define do
  factory :user1, class: 'User' do
    name { '管理人' }
    email { 'admin@example.com' }
    password { 'password' }
    password_confirmation { 'password' }

    factory :user2 do
      name { 'アリス' }
      email { 'alice@test.com' }
    end

    factory :user3 do
      name { 'ボブ' }
      email { 'bob@test.com' }
    end

    factory :user0 do
      id { 1 }
      name { 'admin' }
      email { 'adminadmin@example.com' }
    end
  end
  # carol(キャロル)、dave(デイヴ)、ellen(エレン)、frank(フランク)
end
