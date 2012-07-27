require "rubygems"
require "bundler/setup"
Bundler.require
require 'csv'
require 'active_support/all'

class App < Sinatra::Base
  enable :logging
  use Rack::Session::Cookie
  #register Barista::Integration::Sinatra
  set :protection, :except => :frame_options
  get '/' do
    File.read(File.join('public', 'paper.html'))
  end

  get '/countries' do
    content_type :json
    countries = []
    year = params[:year] || 2004
    CSV.foreach("#{year}.csv") do |line|
      country = {}
      country['name'] = line[0]
      country['gold'] = line[1].to_i
      country['silver'] = line[2].to_i
      country['bronze'] = line[3].to_i
      country['gdp'] = line[4].to_i
      country['gdp'] = rand(5000) if line[4] == "0" #TODO: fix missing GDP data
      countries << country
    end
    countries.to_json
  end

end
