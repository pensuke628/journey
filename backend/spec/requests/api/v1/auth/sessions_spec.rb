require 'rails_helper'

RSpec.describe 'Api::V1::Auth::Sessions', type: :request do
  describe 'get #index' do
    context 'ログインしていない場合' do
      it 'エラーメッセージを返すこと'
    end

    context 'ログインしている場合' do
      it '現在ログインしているユーザーのデータをJSONで返すこと'
    end
  end
end
