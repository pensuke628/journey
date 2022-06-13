FactoryBot.define do
  factory :image do
    image { Rack::Test::UploadedFile.new(Rails.root.join('spec/fixtures/sample.png')) }
    association :review, factory: :review1
  end
end
