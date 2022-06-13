require 'rails_helper'

RSpec.describe Review, type: :model do
  let!(:review) { create(:review1) }
  let(:user) { review.user }
  let(:user2) { create(:user2) }

  describe 'バリデーションのテスト' do
    it 'テストデータが有効であること' do
      expect(review).to be_valid
    end

    describe 'contentカラム' do
      it 'contentがnilだと登録できないこと' do
        review.content = nil
        review.valid?
        expect(review.errors[:content]).to include(I18n.t('errors.messages.blank'))
      end

      it '文字数が10000字より多いと登録できないこと' do
        review.content = 'a' * 10_001
        review.valid?
        expect(review.errors[:content]).to include(I18n.t('errors.messages.too_long', count: 10_000))
      end
    end

    describe 'dateカラム' do
      it 'dateがnilだと登録できないこと' do
        review.date = nil
        review.valid?
        expect(review.errors[:date]).to include(I18n.t('errors.messages.blank'))
      end
    end

    describe 'user_idカラム' do
      it 'user_idがnilだと登録できないこと' do
        review.user_id = nil
        review.valid?
        expect(review.errors[:user_id]).to include(I18n.t('errors.messages.blank'))
      end
    end

    describe 'house_idカラム' do
      it 'house_idがnilだと登録できないこと' do
        review.house_id = nil
        review.valid?
        expect(review.errors[:house_id]).to include(I18n.t('errors.messages.blank'))
      end
    end
  end
end
