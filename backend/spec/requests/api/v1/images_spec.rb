require 'rails_helper'

RSpec.describe 'Api::V1::Images', type: :request do
  describe 'post#create' do
    let(:user) { User.find_by(name: '管理人') }
    let(:review) { Review.find_by(content: 'テスト投稿です') }

    before do
      # user & house1も同時に作成する
      create(:review1)
    end

    context 'ログインしていない場合' do
      it 'Unauthorized Errorが発生すること' do
        params = {
          review_id: review.id,
          image: Rack::Test::UploadedFile.new(Rails.root.join('spec/fixtures/sample.png'), 'image/jpeg')
        }
        post api_v1_images_url, params: params
        expect(response.status).to eq 401
      end
    end

    context 'ログインしている場合' do
      let(:auth_headers) { user.create_new_auth_token }

      it 'リクエストが成功すること' do
        params = {
          review_id: review.id,
          image: Rack::Test::UploadedFile.new(Rails.root.join('spec/fixtures/sample.png'), 'image/jpeg')
        }
        post api_v1_images_url, params: params, headers: auth_headers
        expect(response.status).to eq 200
      end

      it '画像を1件保存すること' do
        params = {
          review_id: review.id,
          image: Rack::Test::UploadedFile.new(Rails.root.join('spec/fixtures/sample.png'), 'image/jpeg')
        }
        expect do
          post api_v1_images_url, params: params, headers: auth_headers
        end.to change(Image, :count).by(1)
      end
    end
  end
end
