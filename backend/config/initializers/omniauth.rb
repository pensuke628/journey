Rails.application.config.middleware.use OmniAuth::Builder do
  provider :twitter, ENV['APP_KEY_TWITTER'], ENV['APP_KEY_SECRET_TWITTER'], callback_url: 'http://127.0.0.1:3010/omniauth/twitter/callback'
end
