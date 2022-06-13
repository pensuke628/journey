require 'rails_helper'

RSpec.describe Owner, type: :model do
  describe 'バリデーションのテスト' do
    let(:owner) { create(:owner) }

    it 'テストデータが有効であること' do
      expect(owner).to be_valid
    end

    it 'user_idがnilだと有効でないこと' do
      owner.user_id = nil
      owner.valid?
      expect(owner.errors[:user_id]).to include(I18n.t('errors.messages.blank'))
    end

    it 'house_idがnilだと有効でないこと' do
      owner.house_id = nil
      owner.valid?
      expect(owner.errors[:house_id]).to include(I18n.t('errors.messages.blank'))
    end
  end
end
