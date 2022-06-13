require 'rails_helper'

RSpec.describe Image, type: :model do
  let(:image) { create(:image) }

  describe 'バリデーションのテスト' do
    it 'テストデータが有効であること' do
      expect(image).to be_valid
    end

    describe 'imageカラム' do
      it 'nilの場合、無効であること' do
        image.image = nil
        image.valid?
        expect(image.errors[:image]).to include(I18n.t('errors.messages.blank'))
      end
    end

    describe 'review_idカラム' do
      it 'nilの場合、無効であること' do
        image.review_id = nil
        image.valid?
        expect(image.errors[:review_id]).to include(I18n.t('errors.messages.blank'))
      end
    end
  end
end
