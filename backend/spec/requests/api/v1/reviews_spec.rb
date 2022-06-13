require 'rails_helper'

RSpec.describe 'Api::V1::Reviews', type: :request do
  let(:review) { Review.find_by(content: 'テスト投稿です') }
  let(:user) { User.find_by(name: '管理人') }
  let(:house) { House.find_by(name: 'ライダーハウス北海道') }
  let(:auth_headers) { user.create_new_auth_token }

  before do
    create(:review1)
  end

  describe 'post #create' do
    context 'ログインしていない場合' do
      let(:params) { { content: 'テスト投稿', date: '2022/01/01', user_id: user.id, house_id: house.id } }

      it 'Unauthorized Errorが発生すること' do
        post api_v1_relationships_url, params: params
        expect(response.status).to eq 401
      end
    end

    context 'ログインしている場合' do
      context 'パラメーターが不正の場合' do
        let(:bad_params) { { content: '', date: '2022/01/01', user_id: user.id, house_id: house.id } }

        it 'エラー(ステータスコード422)を返すこと' do
          post api_v1_reviews_url, params: bad_params, headers: auth_headers
          expect(response.status).to eq 422
        end

        it '口コミが保存されていないこと' do
          expect do
            post api_v1_reviews_url, params: bad_params, headers: auth_headers
          end.not_to change(Review, :count)
        end
      end

      context 'パラメータが正常の場合' do
        let(:good_params) { { content: 'テスト投稿', date: '2022/01/01', user_id: user.id, house_id: house.id } }

        it 'リクエストが成功すること' do
          post api_v1_reviews_url, params: good_params, headers: auth_headers
          expect(response.status).to eq 200
        end

        it '口コミが1件作成されること' do
          expect do
            post api_v1_reviews_url, params: good_params, headers: auth_headers
          end.to change(Review, :count).by(1)
        end
      end
    end
  end

  describe 'get #show' do
    let(:json) { JSON.parse(response.body) }

    it 'リクエストが成功すること' do
      get api_v1_review_url(review.id)
      expect(response.status).to eq 200
    end

    it '口コミ1件の投稿内容が返されること' do
      get api_v1_review_url(review.id)
      expect(json['content']).to eq review.content
    end
  end

  describe 'put #update' do
    let(:updateparams) { { content: '投稿を修正する' } }

    context 'ログインしていない場合' do
      it 'Unauthorized Errorが発生すること' do
        put api_v1_review_url(review.id), params: updateparams
        expect(response.status).to eq 401
      end
    end

    context 'ログインしている場合' do
      it 'リクエストが成功すること' do
        put api_v1_review_url(review.id), params: updateparams, headers: auth_headers
        expect(response.status).to eq 200
      end
    end
  end

  describe 'delete #destroy' do
    let(:user2) { User.find_by(name: 'アリス') }
    let(:auth_headers2) { user2.create_new_auth_token }

    before do
      create(:user2)
    end

    context 'ログインしていない場合' do
      it 'Unauthorized Errorが発生すること' do
        delete api_v1_review_url(review.id)
        expect(response.status).to eq 401
      end
    end

    context 'ログインしている場合' do
      context '口コミ投稿者とログインユーザーが一致していない場合' do
        it 'エラー(ステータスコード500)を返すこと' do
          delete api_v1_review_url(review.id), headers: auth_headers2
          expect(response.status).to eq 500
        end

        it '口コミを削除できないこと' do
          expect do
            delete api_v1_review_url(review.id), headers: auth_headers2
          end.not_to change(Review, :count)
        end
      end

      context '口コミ投稿者とログインユーザーが一致している場合' do
        it 'リクエストが成功すること' do
          delete api_v1_review_url(review.id), headers: auth_headers
          expect(response.status).to eq 200
        end

        it '口コミが1件削除されること' do
          expect do
            delete api_v1_review_url(review.id), headers: auth_headers
          end.to change(Review, :count).by(-1)
        end
      end
    end
  end
end
