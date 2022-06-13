require 'rails_helper'

RSpec.describe Relationship, type: :model do
  describe 'バリデーションのテスト' do
    let(:follow) { create(:relationship) }

    it 'テストデータが有効であること' do
      expect(follow).to be_valid
    end

    it 'follower_idがnilだと有効でないこと' do
      follow.follower_id = nil
      follow.valid?
      expect(follow.errors[:follower_id]).to include(I18n.t('errors.messages.blank'))
    end

    it 'followed_idがnilだと有効でないこと' do
      follow.followed_id = nil
      follow.valid?
      expect(follow.errors[:followed_id]).to include(I18n.t('errors.messages.blank'))
    end
  end
end
