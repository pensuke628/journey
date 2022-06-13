class RenameActionColumnToNotification < ActiveRecord::Migration[6.1]
  def change
    rename_column :notifications, :action, :act
  end
end
