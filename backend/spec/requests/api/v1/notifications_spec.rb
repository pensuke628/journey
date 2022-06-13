require 'rails_helper'

RSpec.describe 'Api::V1::Notifications', type: :request do
  let(:user) { User.find_by(name: '管理人') }
  let(:user2) { User.find_by(name: 'アリス') }
  let(:auth_headers) { user.create_new_auth_token }
  let(:auth_headers2) { user2.create_new_auth_token }

  describe 'get#index' do
    before do
      # user1 & user2も同時に作成する
      create(:notification)
    end

    context 'ログインしていない場合' do
      it 'Unauthorized Errorが発生すること' do
        get api_v1_notifications_url
        expect(response.status).to eq 401
      end
    end

    context 'ログインしている場合' do
      it 'リクエストが成功すること' do
        get api_v1_notifications_url, headers: auth_headers2
        expect(response.status).to eq 200
      end

      it 'ログインユーザー宛の通知を1件返すこと' do
        get api_v1_notifications_url, headers: auth_headers2
        expect(JSON.parse(response.body)['notifications'].size).to eq 1
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
        params = {
          sender_id: user.id, receiver_id: user2.id, review_id: nil, message_id: nil, comment_id: nil, act: 'follow'
        }
        post api_v1_notifications_url, params: params
        expect(response.status).to eq 401
      end
    end

    context 'ログインしている場合' do
      it 'リクエストが成功すること' do
        params = {
          sender_id: user.id, receiver_id: user2.id, review_id: nil, message_id: nil, comment_id: nil, act: 'follow'
        }
        post api_v1_notifications_url, params: params, headers: auth_headers
        expect(response.status).to eq 200
      end

      it '通知を1件作成すること' do
        params = {
          sender_id: user.id, receiver_id: user2.id, review_id: nil, message_id: nil, comment_id: nil, act: 'follow'
        }
        expect do
          post api_v1_notifications_url, params: params, headers: auth_headers
        end.to change(Notification, :count).by(1)
      end
    end
  end

  describe 'post#follwer_notification' do
    before do
      # user & user2も同時に作成する
      create(:relationship)
    end

    context 'ログインしていない場合' do
      it 'Unauthorized Errorが発生すること' do
        params = {
          sender_id: user2.id, review_id: nil, message_id: nil, comment_id: nil, act: 'create'
        }
        post follower_notification_api_v1_notifications_url, params: params
        expect(response.status).to eq 401
      end
    end

    context 'ログインしている場合' do
      it 'リクエストが成功すること' do
        params = {
          sender_id: user2.id, review_id: nil, message_id: nil, comment_id: nil, act: 'create'
        }
        post follower_notification_api_v1_notifications_url, params: params, headers: auth_headers2
        expect(response.status).to eq 200
      end

      it 'フォロワー宛の通知を1件作成すること' do
        params = {
          sender_id: user2.id, review_id: nil, message_id: nil, comment_id: nil, act: 'create'
        }
        expect do
          post follower_notification_api_v1_notifications_url, params: params, headers: auth_headers2
        end.to change(user.passive_notifications, :count).by(1)
      end
    end
  end
end
