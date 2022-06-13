# Be sure to restart your server when you modify this file.

# Avoid CORS issues when API is called from the frontend app.
# Handle Cross-Origin Resource Sharing (CORS) in order to accept cross-origin AJAX requests.

# Read more: https://github.com/cyu/rack-cors

Rails.application.config.middleware.insert_before 0, Rack::Cors do
  allow do
    origins 'https://journey-enjoy.com', 'http://localhost:3000'

    resource '*', headers: :any,
                  # ヘッダー情報を外部に公開する
                  expose: %w(access-token client expiry uid token-type),
                  methods: %i[get post put patch delete options head],
                  credentials: true
  end
end
