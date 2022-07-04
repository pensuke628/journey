CarrierWave.configure do |config|
  if Rails.env.production?
    config.storage = :fog
    config.fog_provider = 'fog/aws'
    config.fog_directory = 'journey-s3'
    config.fog_credentials = {
      provider: 'AWS',
      aws_access_key_id: ENV['S3_ACCESS_KEY_ID'],
      aws_secret_access_key: ENV['S3_SECRET_ACCESS_KEY'],
      region: 'ap-northeast-1',
      path_style: true
    }
  else
    config.asset_host = 'http://localhost:3010'
    config.storage = :file
    config.cache_storage = :file
  end
end
