require 'rails_helper'

RSpec.describe House, type: :model do
  let(:house1) { create(:hokkaido) }
  let(:house2) { create(:aomori) }

  describe 'バリデーションのテスト' do
    it 'テストデータが有効であること' do
      expect(house1).to be_valid
    end

    describe 'nameカラム' do
      it '施設名がないと登録できないこと' do
        house1.name = ''
        house1.valid?
        expect(house1.errors[:name]).to include(I18n.t('errors.messages.blank'))
      end
    end

    describe 'postal_codeカラム' do
      context '郵便番号が空白の場合' do
        it '登録に成功すること' do
          house1.postal_code = nil
          expect(house1).to be_valid
        end
      end

      context '郵便番号に入力がある場合' do
        it '郵便番号は6桁以下だと登録に失敗すること' do
          house1.postal_code = Random.rand(1...1_000_000)
          house1.valid?
          expect(house1.errors[:postal_code]).to include(I18n.t('errors.messages.wrong_length', count: 7))
        end

        it '郵便番号は8桁以上だと登録に失敗すること' do
          house1.postal_code = Random.rand(10_000_000...100_000_000)
          house1.valid?
          expect(house1.errors[:postal_code]).to include(I18n.t('errors.messages.wrong_length', count: 7))
        end
      end
    end

    describe 'prefecturesカラム' do
      it '都道府県情報が未入力だと登録できないこと' do
        house1.prefectures = ''
        expect(house1.valid?).to eq false
      end
    end
  end
end
