require 'rails_helper'

RSpec.describe 'Api::V1::Bookmarks', type: :request do
  let(:user) { User.find_by(name: '管理人') }
  let(:house) { House.find_by(name: 'ライダーハウス北海道') }
  let(:house2) { House.find_by(name: 'ライダーハウス青森') }
  let(:bookmark) { Bookmark.find_by(user_id: user.id, house_id: house.id) }
  let(:auth_headers) { user.create_new_auth_token }

  before do
    create(:user1)
    create(:hokkaido)
  end

  describe 'get#index' do
    context 'ログインしていない場合' do
      it 'Unauthorized Errorが発生すること' do
        get api_v1_bookmarks_url
        expect(response.status).to eq 401
      end
    end

    context 'ログインしている場合' do
      it 'リクエストが成功すること' do
        get api_v1_bookmarks_url, headers: auth_headers
        expect(response.status).to eq 200
      end
    end
  end

  describe 'post#create' do
    context 'ログインしていない場合' do
      it 'Unauthorized Errorが発生すること' do
        post api_v1_bookmarks_url, params: { house_id: house.id }
        expect(response.status).to eq 401
      end
    end

    context 'ログインしている場合' do
      it 'リクエストが成功すること' do
        post api_v1_bookmarks_url, params: { house_id: house.id }, headers: auth_headers
        expect(response.status).to eq 200
      end

      it 'ハウスがお気に入り登録されること' do
        expect do
          post api_v1_bookmarks_url, params: { house_id: house.id }, headers: auth_headers
        end.to change(Bookmark, :count).by(1)
      end
    end
  end

  describe 'delete#destroy' do
    before do
      create(:bookmark, user_id: user.id, house_id: house.id)
      create(:aomori)
    end

    context 'ログインしていない場合' do
      it 'Unauthorized Errorが発生すること' do
        delete api_v1_bookmarks_url, params: { house_id: house.id }
        expect(response.status).to eq 401
      end
    end

    context 'ログインしている場合' do
      context 'パラメータが不正の場合' do
        it 'サーバーエラー(ステータスコード500)が発生すること' do
          delete api_v1_bookmarks_url, params: { house_id: house2.id }, headers: auth_headers
          expect(response.status).to eq 500
        end
      end

      context 'パラメータが正常の場合' do
        it 'リクエストが成功すること' do
          delete api_v1_bookmarks_url, params: { house_id: house.id }, headers: auth_headers
          expect(response.status).to eq 200
        end

        it 'ハウスのお気に入り数が1減ること' do
          expect do
            delete api_v1_bookmarks_url, params: { house_id: house.id }, headers: auth_headers
          end.to change(Bookmark, :count).by(-1)
        end
      end
    end
  end
end
