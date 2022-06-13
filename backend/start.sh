#!/bin/sh

# If the database exists, migrate. Otherwise setup (create and migrate)
bundle exec rails db:migrate || bundle exec rails db:create db:migrate db:seed

# If the container has been killed, there may be a stale pid file
# preventing rails from booting up
rm -f tmp/pids/server.pid

if [ "${RAILS_ENV}" = "production" ]; then
    bundle exec pumactl start
else
    bundle exec rails s -p ${PORT:-3010} -b 0.0.0.0
fi