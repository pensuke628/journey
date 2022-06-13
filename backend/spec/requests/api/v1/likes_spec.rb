require 'rails_helper'

RSpec.describe 'Likes', type: :request do
  let(:user) { User.find_by(name: '管理人') }
  let(:user2) { User.find_by(name: 'アリス') }
  let(:review) { Review.find_by(content: 'テスト投稿です') }
  let(:like) { Like.find_by(review_id: review.id, user_id: user2.id) }
  let(:auth_headers2) { user2.create_new_auth_token }
  let(:json) { JSON.parse(response.body) }

  describe 'get#index' do
    before do
      create(:like)
    end

    context 'ログインしていない場合' do
      it 'Unauthorized Errorが発生すること' do
        get api_v1_likes_url
        expect(response.status).to eq 401
      end
    end

    context 'ログインしている場合' do
      it 'リクエストが成功すること' do
        get api_v1_likes_url, headers: auth_headers2
        expect(response.status).to eq 200
      end
    end
  end

  describe 'post#create' do
    let(:auth_headers2) { user2.create_new_auth_token }

    before do
      create(:review1)
      create(:user2)
    end

    context 'ログインしていない場合' do
      it 'Unauthorized Errorが発生すること' do
        post api_v1_likes_url, params: { review_id: review.id }
        expect(response.status).to eq 401
      end
    end

    context 'ログインしている場合' do
      it 'リクエストが成功すること' do
        post api_v1_likes_url, params: { review_id: review.id }, headers: auth_headers2
        expect(response.status).to eq 200
      end

      it '口コミがいいねされること' do
        expect do
          post api_v1_likes_url, params: { review_id: review.id }, headers: auth_headers2
        end.to change(Like, :count).by(1)
      end
    end
  end

  describe 'delete#destroy' do
    before do
      create(:like)
    end

    context 'ログインしていない場合' do
      it 'Unauthorized Errorが発生すること' do
        delete api_v1_likes_url, params: { review_id: review.id }
        expect(response.status).to eq 401
      end
    end

    context 'ログインしている場合' do
      it 'リクエストが成功すること' do
        delete api_v1_likes_url, params: { review_id: review.id }, headers: auth_headers2
        expect(response.status).to eq 200
      end

      it '口コミへのいいね数が1減ること' do
        expect do
          delete api_v1_likes_url, params: { review_id: review.id }, headers: auth_headers2
        end.to change(Like, :count).by(-1)
      end
    end
  end
end
