require 'rails_helper'

RSpec.describe MessageRoom, type: :model do
  let(:message_room) { create(:message_room) }

  it 'メッセージルームが有効であること' do
    expect(message_room).to be_valid
  end
end
