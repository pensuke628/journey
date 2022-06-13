require 'rails_helper'

RSpec.describe 'Api::V1::MessageRooms', type: :request do
  let(:user) { User.find_by(name: '管理人') }
  let(:message_room) { user.message_rooms.first }
  let(:json) { JSON.parse(response.body) }
  let(:auth_headers) { user.create_new_auth_token }

  before do
    create(:message_room_user)
    create(:message, user_id: user.id, message_room_id: message_room.id)
  end

  describe 'get#index' do
    context 'ログインしていない場合' do
      it 'Unauthorized Errorが発生すること' do
        get api_v1_message_rooms_url
        expect(response.status).to eq 401
      end
    end

    context 'ログインしている場合' do
      it 'リクエストが成功すること' do
        get api_v1_message_rooms_url, headers: auth_headers
        expect(response.status).to eq 200
      end

      it 'メッセージルームの情報を1件返すこと' do
        get api_v1_message_rooms_url, headers: auth_headers
        expect(json['message_rooms'].size).to eq 1
      end
    end
  end

  describe 'get#show' do
    context 'ログインしていない場合' do
      it 'Unauthorized Errorが発生すること' do
        get api_v1_message_room_url(message_room)
        expect(response.status).to eq 401
      end
    end

    context 'ログインしている場合' do
      it 'リクエストが成功すること' do
        get api_v1_message_room_url(message_room), headers: auth_headers
        expect(response.status).to eq 200
      end

      it 'メッセージを1件返すこと' do
        get api_v1_message_room_url(message_room), headers: auth_headers
        expect(json['messages'].size).to eq 1
      end
    end
  end
end
