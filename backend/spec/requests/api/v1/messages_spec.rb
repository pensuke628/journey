require 'rails_helper'

RSpec.describe 'Api::V1::Messages', type: :request do
  let(:user) { User.find_by(name: '管理人') }
  let(:message_room) { MessageRoomUser.find_by(user_id: user.id).message_room }
  let(:auth_headers) { user.create_new_auth_token }

  before do
    create(:message_room_user)
  end

  describe 'post#create' do
    let(:params) { { content: 'test', user_id: user.id, message_room_id: message_room.id } }

    context 'ログインしていない場合' do
      it 'Unauthorized Errorが発生すること' do
        post api_v1_messages_url, params: params
        expect(response.status).to eq 401
      end
    end

    context 'ログインしている場合' do
      it 'リクエストが成功すること' do
        post api_v1_messages_url, params: params, headers: auth_headers
        expect(response.status).to eq 200
      end

      it 'メッセージが1件作成されること' do
        expect do
          post api_v1_messages_url, params: params, headers: auth_headers
        end.to change(Message, :count).by(1)
      end

      it '作成したメッセージをJSON形式で返すこと' do
        post api_v1_messages_url, params: params, headers: auth_headers
        expect(JSON.parse(response.body)['message']).to include({ 'content' => 'test' })
      end
    end
  end
end
