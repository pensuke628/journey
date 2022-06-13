require 'rails_helper'

RSpec.describe Like, type: :model do
  describe 'バリデーションのテスト' do
    let(:like) { create(:like) }

    it 'テストデータが有効であること' do
      expect(like).to be_valid
    end

    it 'user_idがnilの場合、有効でないこと' do
      like.user_id = nil
      like.valid?
      expect(like.errors[:user_id]).to include(I18n.t('errors.messages.blank'))
    end

    it 'review_idがnilの場合、有効でないこと' do
      like.review_id = nil
      like.valid?
      expect(like.errors[:review_id]).to include(I18n.t('errors.messages.blank'))
    end
  end
end
