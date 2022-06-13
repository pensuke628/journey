require 'rails_helper'

RSpec.describe 'Api::V1::Comments', type: :request do
  let(:user2) { User.find_by(name: 'アリス') }
  let(:house) { House.find_by(name: 'ライダーハウス北海道') }
  let(:review) { Review.find_by(content: 'テスト投稿です') }
  let(:comment) { Comment.find_by(review_id: review.id) }
  let(:auth_headers2) { user2.create_new_auth_token }

  before do
    # user & houseも同時に作成
    create(:review1)
    create(:user2)
  end

  describe 'post#create' do
    let(:create_params) { { content: 'テスト', user_id: user2.id, review_id: review.id } }

    context 'ログインしていない場合' do
      it 'Unauthorized Errorが発生すること' do
        post api_v1_comments_url, params: create_params
        expect(response.status).to eq 401
      end
    end

    context 'ログインしている場合' do
      context 'ユーザーが管理者でない場合' do
        it 'Unprocessable_entity(エラーコード422)が発生すること' do
          post api_v1_comments_url, params: create_params, headers: auth_headers2
          expect(response.status).to eq 422
        end

        it 'コメントが作成されないこと' do
          expect do
            post api_v1_comments_url, params: create_params, headers: auth_headers2
          end.not_to change(Comment, :count)
        end
      end

      context 'ユーザーが管理者である場合' do
        before do
          # user2をhouseのオーナーに追加する
          create(:owner, user_id: user2.id, house_id: house.id)
        end

        it 'リクエストが成功すること' do
          post api_v1_comments_url, params: create_params, headers: auth_headers2
          expect(response.status).to eq 200
        end

        it 'コメントが1件作成されること' do
          expect do
            post api_v1_comments_url, params: create_params, headers: auth_headers2
          end.to change(Comment, :count).by(1)
        end

        it 'コメントデータをJSON形式で返すこと' do
          post api_v1_comments_url, params: create_params, headers: auth_headers2
          expect(JSON.parse(response.body)['comment']).to include({ 'content' => 'テスト' })
        end
      end
    end
  end

  describe 'put#update' do
    let(:update_params) { { content: 'コメントを修正する', review_id: review.id } }

    before do
      create(:comment, user_id: user2.id, review_id: review.id)
    end

    context 'ログインしていない場合' do
      it 'Unauthorized Errorが発生すること' do
        put api_v1_comment_url(comment.id), params: update_params
        expect(response.status).to eq 401
      end
    end

    context 'ログインしている場合' do
      context 'ユーザーが管理者でない場合' do
        it 'Unprocessable_entityが発生すること' do
          put api_v1_comment_url(comment.id), params: update_params, headers: auth_headers2
          expect(response.status).to eq 422
        end

        it 'コメントが更新されないこと' do
          expect do
            put api_v1_comment_url(comment.id), params: update_params, headers: auth_headers2
          end.not_to change(comment, :content)
        end
      end

      context 'ユーザーが管理者である場合' do
        before do
          # user2をhouseのオーナーに追加する
          create(:owner, user_id: user2.id, house_id: house.id)
        end

        it 'リクエストが成功すること' do
          put api_v1_comment_url(comment.id), params: update_params, headers: auth_headers2
          expect(response.status).to eq 200
        end

        it '該当のコメント内容が更新されること' do
          expect do
            put api_v1_comment_url(comment.id), params: update_params, headers: auth_headers2
          end.to change { Comment.find_by(review_id: review.id).content }.from('口コミへのコメントテストです').to('コメントを修正する')
        end
      end
    end
  end

  describe 'delete#destroy' do
    before do
      create(:comment, user_id: user2.id, review_id: review.id)
    end

    context 'ログインしていない場合' do
      it 'Unauthorized Errorが発生すること' do
        delete api_v1_comment_url(comment.id)
        expect(response.status).to eq 401
      end
    end

    context 'ログインしている場合' do
      it 'リクエストが成功すること' do
        delete api_v1_comment_url(comment.id), headers: auth_headers2
        expect(response.status).to eq 200
      end

      it 'コメントが1件削除されること' do
        expect do
          delete api_v1_comment_url(comment.id), headers: auth_headers2
        end.to change(Comment, :count).by(-1)
      end
    end
  end
end
