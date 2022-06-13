require 'rails_helper'

RSpec.describe 'Api::V1::Auth::Registrations', type: :request do
  describe 'post #create' do
    context 'ユーザーがログイン中の場合' do
      it 'ユーザーが作成できないこと'
    end

    context 'ユーザーがログインしていない場合' do
      context 'パラメーターが不正の場合' do
        it '失敗のリクエストが返ること'
        it 'ユーザーが作成できないこと'
        it 'エラーを返すこと'
      end

      context 'パラメーターが正常の場合' do
        it '成功のリクエストが返ること'
        it '認証メールを送信すること'
      end
    end
  end
end
