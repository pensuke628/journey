require 'rails_helper'

RSpec.describe Tag, type: :model do
  describe 'バリデーションのテスト' do
    let(:tag) { described_class.find_by(name: 'タグ1') }

    before do
      create(:tag)
    end

    it 'テストデータが有効であること' do
      expect(tag).to be_valid
    end

    describe 'nameカラム' do
      it 'nameが空欄だと登録できないこと' do
        tag.name = ''
        tag.valid?
        expect(tag.errors[:name]).to include(I18n.t('errors.messages.blank'))
      end

      it '重複があると登録できないこと' do
        tag2 = build(:tag)
        tag2.valid?
        expect(tag2.errors[:name]).to include(I18n.t('errors.messages.taken'))
      end

      it '20文字以上だと登録できないこと' do
        tag.name = 'a' * 21
        tag.valid?
        expect(tag.errors[:name]).to include(I18n.t('errors.messages.too_long', count: 20))
      end
    end
  end
end
