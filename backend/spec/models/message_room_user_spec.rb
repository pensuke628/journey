require 'rails_helper'

RSpec.describe MessageRoomUser, type: :model do
  let(:message_room_user) { create(:message_room_user) }

  it 'テストデータが有効であること' do
    expect(message_room_user).to be_valid
  end

  it 'user_idがnilだと有効でないこと' do
    message_room_user.user_id = nil
    message_room_user.valid?
    expect(message_room_user.errors[:user_id]).to include(I18n.t('errors.messages.blank'))
  end

  it 'message_room_idがnilだと有効でないこと' do
    message_room_user.message_room_id = nil
    message_room_user.valid?
    expect(message_room_user.errors[:message_room_id]).to include(I18n.t('errors.messages.blank'))
  end
end
