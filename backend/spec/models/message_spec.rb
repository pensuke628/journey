require 'rails_helper'

RSpec.describe Message, type: :model do
  let(:message) { create(:message) }

  it 'テストデータが有効であること' do
    expect(message).to be_valid
  end

  it 'contentがnilだと有効でないこと' do
    message.content = nil
    message.valid?
    expect(message.errors[:content]).to include(I18n.t('errors.messages.blank'))
  end

  it 'user_idがnilだと有効でないこと' do
    message.user_id = nil
    message.valid?
    expect(message.errors[:user_id]).to include(I18n.t('errors.messages.blank'))
  end

  it 'message_room_idがnilだと有効でないこと' do
    message.message_room_id = nil
    message.valid?
    expect(message.errors[:message_room_id]).to include(I18n.t('errors.messages.blank'))
  end

  describe 'review_idカラム' do
    context 'review_idがnilの場合' do
      it '有効であること' do
        message.review_id = nil
        expect(message).to be_valid
      end
    end

    context 'review_idがnilでない場合' do
      let(:review) { Review.find_by(content: 'テスト投稿です') }
      let(:user) { User.find_by(name: 'アリス') }

      before do
        create(:user2)
        create(:review1, user_id: user.id)
      end

      it '存在しないreviewのidの場合、有効でないこと' do
        message.review_id = 100_000_000
        message.valid?
        expect(message.errors.full_messages).to include('Reviewを入力してください')
      end

      it '存在するreviewのidの場合、有効であること' do
        message.review_id = review.id
        expect(message).to be_valid
      end
    end
  end
end
