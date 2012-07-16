require "rubygems"
require "bundler/setup"
Bundler.require
require 'csv'
require 'active_support/all'

class App < Sinatra::Base
  enable :logging
  use Rack::Session::Cookie
  register Barista::Integration::Sinatra
  get '/' do
    File.read(File.join('public', 'paper.html'))
  end

  get '/countries' do
    content_type :json
    countries = []
    CSV.foreach("2008.csv") do |line|
      country = {}
      country['name'] = line[0]
      country['gold'] = line[1].to_i
      country['silver'] = line[2].to_i
      country['bronze'] = line[3].to_i
      country['gdp'] = line[5].to_i
      country['gdp'] = rand(5000) if line[4] == "0"
      countries << country
    end
    countries.to_json
  end
  
end