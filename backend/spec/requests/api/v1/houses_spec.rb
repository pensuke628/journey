# frozen_string_literal: true

require 'rails_helper'

RSpec.describe 'Api::V1::Houses', type: :request do
  let(:house) { House.find_by(name: 'ライダーハウス北海道') }
  let(:json) { JSON.parse(response.body) }

  before do
    create(:hokkaido)
    create(:aomori)
  end

  describe 'get #index' do
    it 'リクエストが成功すること' do
      get api_v1_houses_url
      expect(response.status).to eq 200
    end

    it '2件のデータが返されること' do
      get api_v1_houses_url
      expect(json.length).to eq 2
    end
  end

  describe 'post #create' do
    context 'パラメータが不正の場合' do
      it 'リクエストが失敗すること' do
        post api_v1_houses_url, params: { name: 'ライダーハウス北海道' }
        expect(response.status).to eq 422
      end

      it 'ハウスが保存されていないこと' do
        expect do
          post api_v1_houses_url, params: { name: 'ライダーハウス北海道' }
        end.not_to change(House, :count)
      end
    end

    context 'パラメータが正常の場合' do
      it 'リクエストが成功すること' do
        post api_v1_houses_url, params: { name: 'テストハウス', prefectures: '東京' }
        expect(response.status).to eq 200
      end

      it 'ハウスが1件保存されていること' do
        expect do
          post api_v1_houses_url, params: { name: 'テストハウス', prefectures: '東京' }
        end.to change(House, :count).by(1)
      end
    end
  end

  describe 'get #show' do
    it 'リクエストが成功すること' do
      get api_v1_house_url(house)
      expect(response.status).to eq 200
    end

    it '指定したハウスの住所が返されること' do
      get api_v1_house_url(house)
      expect(json['prefectures']).to include house.prefectures
    end
  end

  describe 'patch #update' do
    context 'パラメーターが不正の場合' do
      it 'リクエストが失敗すること' do
        patch api_v1_house_url(house), params: { name: '' }
        expect(response.status).to eq 422
      end

      it 'ハウス名が更新されていないこと' do
        expect do
          patch api_v1_house_url(house), params: { name: '' }
        end.not_to change(House.find_by(prefectures: '北海道'), :name)
      end
    end

    context 'パラメーターが正常の場合' do
      it 'リクエストが成功すること' do
        patch api_v1_house_url(house), params: { name: 'ライダーハウス青森' }
        expect(response.status).to eq 200
      end

      it 'ハウス名が更新されること' do
        expect do
          patch api_v1_house_url(house), params: { name: 'ライダーハウス青森' }
        end.to change { House.find_by(prefectures: '北海道').name }.from('ライダーハウス北海道').to('ライダーハウス青森')
      end
    end
  end

  describe 'delete #destroy' do
    it 'リクエストが成功すること' do
      delete api_v1_house_url(house)
      expect(response.status).to eq 200
    end

    it 'ハウス名が更新されること' do
      expect do
        delete api_v1_house_url(house)
      end.to change(House, :count).by(-1)
    end
  end
end
