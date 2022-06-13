require 'rails_helper'

RSpec.describe 'Api::V1::Owners', type: :request do
  let(:user) { User.find_by(name: '管理人') }
  let(:house) { House.find_by(name: 'ライダーハウス北海道') }
  let(:json) { JSON.parse(response.body) }
  let(:auth_headers) { user.create_new_auth_token }

  describe 'get#index' do
    before do
      create(:owner)
    end

    context 'ログインしていない場合' do
      it 'Unauthorized Errorが発生すること' do
        get api_v1_owners_url
        expect(response.status).to eq 401
      end
    end

    context 'ログインしている場合' do
      it 'リクエストが成功すること' do
        get api_v1_owners_url, headers: auth_headers
        expect(response.status).to eq 200
      end

      it '管理している施設を1件返すこと' do
        get api_v1_owners_url, headers: auth_headers
        expect(json['owner_houses'].size).to eq 1
      end
    end
  end

  describe 'post#create' do
    let(:params) { { user_id: user.id, house_id: house.id } }

    before do
      create(:user1)
      create(:hokkaido)
    end

    context 'ログインしていない場合' do
      it 'Unauthorized Errorが発生すること' do
        post api_v1_owners_url, params: params
        expect(response.status).to eq 401
      end
    end

    context 'ログインしている場合' do
      it 'リクエストが成功すること' do
        post api_v1_owners_url, params: params, headers: auth_headers
        expect(response.status).to eq 200
      end

      it 'オーナー情報が1件登録されること' do
        expect do
          post api_v1_owners_url, params: params, headers: auth_headers
        end.to change(Owner, :count).by(1)
      end
    end
  end

  describe 'post#delete_request' do
    let(:review) { Review.find_by(user_id: user.id, house_id: house.id) }
    let(:params) { { user_id: user.id, review_id: review.id } }

    before do
      create(:review1)
    end

    context 'ログインしていない場合' do
      it 'Unauthorized Errorが発生すること' do
        post delete_request_api_v1_owners_url, params: params
        expect(response.status).to eq 401
      end
    end

    context 'ログインしている場合' do
      before do
        create(:user0)
      end

      context '管理者とのメッセージルームがない場合' do
        it 'リクエストが成功すること' do
          post delete_request_api_v1_owners_url, params: params, headers: auth_headers
          expect(response.status).to eq 200
        end

        it 'メッセージルームが1つ作成されること' do
          expect do
            post delete_request_api_v1_owners_url, params: params, headers: auth_headers
          end.to change(MessageRoom, :count).by(1)
        end

        it 'メッセージルームとユーザーの関係性が2つ作成されること' do
          expect do
            post delete_request_api_v1_owners_url, params: params, headers: auth_headers
          end.to change(MessageRoomUser, :count).by(2)
        end

        it 'メッセージが1件作成されること' do
          expect do
            post delete_request_api_v1_owners_url, params: params, headers: auth_headers
          end.to change(Message, :count).by(1)
        end
      end

      context '管理者とのメッセージルームがある場合' do
        before do
          create(:message_room)
          create(:message_room_user, user_id: User.first.id, message_room_id: MessageRoom.first.id)
          create(:message_room_user, user_id: user.id, message_room_id: MessageRoom.first.id)
        end

        it 'リクエストが成功すること' do
          post delete_request_api_v1_owners_url, params: params, headers: auth_headers
          expect(response.status).to eq 200
        end

        it 'メッセージルームが新しく作成されないこと' do
          expect do
            post delete_request_api_v1_owners_url, params: params, headers: auth_headers
          end.not_to change(MessageRoom, :count)
        end

        it 'メッセージが1件作成されること' do
          expect do
            post delete_request_api_v1_owners_url, params: params, headers: auth_headers
          end.to change(Message, :count).by(1)
        end
      end
    end
  end
end
