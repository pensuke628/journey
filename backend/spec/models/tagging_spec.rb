require 'rails_helper'

RSpec.describe Tagging, type: :model do
  let(:tagging) { described_class.first }

  describe 'バリデーションのテスト' do
    before do
      create(:tagging)
    end

    it 'テストデータが有効であること' do
      expect(tagging).to be_valid
    end

    describe 'tag_idカラム' do
      it 'nilの場合、無効であること' do
        tagging.tag_id = nil
        tagging.valid?
        expect(tagging.errors[:tag]).to include(I18n.t('errors.messages.blank'))
      end
    end
  end
end
