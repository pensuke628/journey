require 'rails_helper'

RSpec.describe 'Api::V1::Relationships', type: :request do
  let(:user) { User.find_by(name: '管理人') }
  let(:user2) { User.find_by(name: 'アリス') }
  let(:auth_headers) { user.create_new_auth_token }
  let(:json) { JSON.parse(response.body) }

  describe 'get#index' do
    before do
      create(:relationship)
    end

    context 'ログインしていない場合' do
      it 'Unauthorized Errorが発生すること' do
        get api_v1_relationships_url
        expect(response.status).to eq 401
      end
    end

    context 'ログインしている場合' do
      it 'リクエストが成功すること' do
        get api_v1_relationships_url, headers: auth_headers
        expect(response.status).to eq 200
      end

      it 'フォロワーのユーザーIDが1件返ってくること' do
        get api_v1_relationships_url, headers: auth_headers
        expect(json['active_relationships'].size).to eq 1
      end
    end
  end

  describe 'post#create' do
    before do
      create(:user1)
      create(:user2)
    end

    context 'ログインしていない場合' do
      it 'Unauthorized Errorが発生すること' do
        post api_v1_relationships_url, params:
                                        { follower_id: user.id,
                                          followed_id: user2.id }
        expect(response.status).to eq 401
      end
    end

    context 'ログインしている場合' do
      context 'フォローユーザーとフォロワーユーザーが一致する場合' do
        let(:bad_params) { { follower_id: user.id, followed_id: user.id } }

        it 'リクエストがリダイレクトされること' do
          post api_v1_relationships_url, params: bad_params, headers: auth_headers
          expect(response.status).to eq 400
        end

        it 'ユーザーのフォロー数が増えないこと' do
          expect do
            post api_v1_relationships_url, params: bad_params, headers: auth_headers
          end.not_to change(Relationship, :count)
        end
      end

      context 'フォローユーザーとフォロワーユーザーが異なる場合' do
        let(:good_params) { { follower_id: user.id, followed_id: user2.id } }

        it 'リクエストが成功すること' do
          post api_v1_relationships_url, params: good_params, headers: auth_headers
          expect(response.status).to eq 200
        end

        it 'ユーザーをフォローすること' do
          expect do
            post api_v1_relationships_url, params: good_params, headers: auth_headers
          end.to change(Relationship, :count).by(1)
        end
      end
    end
  end

  describe 'delete#destroy' do
    let(:good_params) { { data: { follower_id: user.id, followed_id: user2.id } } }

    before do
      create(:relationship)
    end

    context 'ログインしていない場合' do
      it 'Unauthorized Errorが発生すること' do
        delete unfollow_api_v1_relationships_url
        expect(response.status).to eq 401
      end
    end

    context 'ログインしている場合' do
      it 'リクエストがリダイレクトされること' do
        delete unfollow_api_v1_relationships_url, params: good_params, headers: auth_headers
        expect(response.status).to eq 200
      end

      it 'ユーザーのフォローが1減ること' do
        expect do
          delete unfollow_api_v1_relationships_url, params: good_params, headers: auth_headers
        end.to change(Relationship, :count).by(-1)
      end
    end
  end
end
