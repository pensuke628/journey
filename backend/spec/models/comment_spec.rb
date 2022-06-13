require 'rails_helper'

RSpec.describe Comment, type: :model do
  let(:comment) { create(:comment) }
  let(:user) { comment.review.user }
  let(:user2) { comment.user }

  describe 'バリデーションのテスト' do
    it 'テストデータが有効であること' do
      expect(comment).to be_valid
    end

    describe 'contentカラム' do
      it '0文字の場合無効であること' do
        comment.content = ''
        comment.valid?
        expect(comment.errors[:content]).to include(I18n.t('errors.messages.blank'))
      end
    end

    describe 'user_idカラム' do
      it 'nilの場合、無効であること' do
        comment.user_id = nil
        comment.valid?
        expect(comment.errors[:user_id]).to include(I18n.t('errors.messages.blank'))
      end
    end

    describe 'review_idカラム' do
      it 'review_idがnilの場合、無効であること' do
        comment.review_id = nil
        comment.valid?
        expect(comment.errors[:review_id]).to include(I18n.t('errors.messages.blank'))
      end
    end
  end
end
