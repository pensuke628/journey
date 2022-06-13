class ApplicationController < ActionController::Base
  include DeviseTokenAuth::Concerns::SetUserByToken
  include ErrorHandle

  skip_before_action :verify_authenticity_token
  helper_method %i[curren_user user_signed_in?]
end
