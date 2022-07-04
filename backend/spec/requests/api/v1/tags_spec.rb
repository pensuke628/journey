require 'rails_helper'

RSpec.describe 'Api::V1::Tags', type: :request do
  let(:json) { JSON.parse(response.body) }

  describe 'get#searchhouses' do
    # house(hokkaido) & タグ1 を作成し、それが紐づいている関係性も作成する
    before do
      create(:tagging)
    end

    context 'タグ名が存在しない場合' do
      it 'サーバーエラーを返すこと' do
        get api_v1_tags_searchhouses_url params: { name: 'テストタグ' }
        expect(response.status).to eq 500
      end
    end

    context 'タグ名が存在する場合' do
      it 'リクエストが成功すること' do
        get api_v1_tags_searchhouses_url params: { name: 'タグ1' }
        expect(response.status).to eq 200
      end

      it 'タグ付けされた施設のデータを1件返すこと' do
        get api_v1_tags_searchhouses_url params: { name: 'タグ1' }
        expect(json.size).to eq 1
      end
    end
  end

  describe 'get#searchreviews' do
    let(:review) { Review.find_by(content: 'テスト投稿です') }

    before do
      create(:review1)
      create(:tagging, house_id: nil, review_id: review.id)
    end

    context 'タグ名が存在しない場合' do
      it 'サーバーエラーを返すこと' do
        get api_v1_tags_searchreviews_url params: { name: 'テストタグ' }
        expect(response.status).to eq 500
      end
    end

    context 'タグ名が存在する場合' do
      it 'リクエストが成功すること' do
        get api_v1_tags_searchreviews_url params: { name: 'タグ1' }
        expect(response.status).to eq 200
      end

      it 'タグ付けされた施設のデータを1件返すこと' do
        get api_v1_tags_searchreviews_url params: { name: 'タグ1' }
        expect(json.size).to eq 1
      end
    end
  end
end
