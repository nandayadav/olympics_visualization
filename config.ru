require 'rubygems'
require 'bundler'

Bundler.require
require 'sinatra'
#mime_type :coffee, "text/coffeescript"

# The project root directory
root = ::File.dirname(__FILE__)

# Barista (for CoffeeScript Support)
# Barista.app_root = root
# Barista.root     = File.join(root, 'public', 'coffeescripts')
# Barista.setup_defaults
# barista_config = root + '/barista_config.rb'
# require barista_config if File.exist?(barista_config)

require './app'
run App