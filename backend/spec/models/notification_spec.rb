require 'rails_helper'

RSpec.describe Notification, type: :model do
  describe 'バリデーションのテスト' do
    let(:notification) { create(:notification) }
    let(:user2) { User.find_by(name: 'アリス') }

    it 'テストデータが有効であること' do
      expect(notification).to be_valid
    end

    it 'visitor_idがnilだと有効でないこと' do
      notification.sender_id = nil
      notification.valid?
      expect(notification.errors[:sender_id]).to include(I18n.t('errors.messages.blank'))
    end

    it 'receiver_idがnilだと有効でないこと' do
      notification.receiver_id = nil
      notification.valid?
      expect(notification.errors[:receiver_id]).to include(I18n.t('errors.messages.blank'))
    end

    it 'actがnilだと有効でないこと' do
      notification.act = nil
      notification.valid?
      expect(notification.errors[:act]).to include(I18n.t('errors.messages.blank'))
    end

    it 'review_idがnilでも有効であること' do
      notification.review_id = nil
      expect(notification).to be_valid
    end

    it 'comment_idがnilでも有効であること' do
      notification.comment_id = nil
      expect(notification).to be_valid
    end

    it 'message_idがnilでも有効であること' do
      notification.message_id = nil
      expect(notification).to be_valid
    end

    describe '複合indexのテスト' do
      before do
        create(:notification)
      end

      it 'sender_id, receiver_id, review_id, comment_id, message_id, actが全て同値であるレコードは1つのみ有効であること' do
        notification2 = build(:notification2, receiver_id: user2.id)
        notification2.valid?
        expect(notification2.errors[:sender_id]).to include(I18n.t('errors.messages.taken'))
      end
    end
  end

  describe 'スコープのテスト' do
    describe 'order_new' do
      before do
        create(:notification)
        create(:notification2)
      end

      let(:notification) { described_class.first }
      let(:notification2) { described_class.second }

      it 'スコープを適用しない場合、順番が変わらないこと' do
        expect(described_class.first).to eq notification
      end

      it '日付の新しい順に並ぶこと' do
        notification.created_at = Time.current.yesterday
        expect(described_class.order_new.first).to eq notification2
      end
    end
  end
end
