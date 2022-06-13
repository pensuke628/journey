FactoryBot.define do
  factory :hokkaido, class: 'House' do
    name { 'ライダーハウス北海道' }
    postal_code { '0600806' }
    prefectures { '北海道' }
    municipalities { '札幌市北区北6条西4丁目' }
    image { '' }
    profile { '' }
    phone_number { '' }
    email { '' }
    related_website { '' }
    price { '' }
    period { '' }
    check_in_time { '' }
    check_out_time { '' }
    capacity { '' }
    parking { '' }
    bath { '' }
    shopping { '' }
    note { '' }

    factory :aomori do
      name { 'ライダーハウス青森' }
      postal_code { '0380012' }
      prefectures { '青森県' }
      municipalities { '青森市柳川一丁目1-1' }
    end
  end
end
