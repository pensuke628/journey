require 'rails_helper'

RSpec.describe Bookmark, type: :model do
  describe 'バリデーションのテスト' do
    let(:bookmark) { create(:bookmark) }

    it 'テストデータが有効であること' do
      expect(bookmark).to be_valid
    end

    it 'user_idがnilだと有効でないこと' do
      bookmark.user_id = nil
      bookmark.valid?
      expect(bookmark.errors[:user_id]).to include(I18n.t('errors.messages.blank'))
    end

    it 'house_idがnilだと有効でないこと' do
      bookmark.house_id = nil
      bookmark.valid?
      expect(bookmark.errors[:house_id]).to include(I18n.t('errors.messages.blank'))
    end
  end
end
