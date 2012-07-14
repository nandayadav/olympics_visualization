# require "rubygems"
# require "bundler/setup"
# Bundler.require
require 'csv'

class App < Sinatra::Base
  enable :logging
  use Rack::Session::Cookie
  register Barista::Integration::Sinatra
  get '/' do
    #'hi'
    #@countries = File.read("2008.csv").to_json
    #@countries = Country.all.to_json
    File.read(File.join('public', 'paper2.html'))
  end

  get '/world-countries' do
    File.read(File.join('public', 'world-countries.json'))
  end

  get '/countries' do
    countries = []
    CSV.foreach("2008.csv") do |line|
      country = {}
      country['name'] = line[0]
      country['gold'] = line[1]
      country['silver'] = line[2]
      country['bronze'] = line[3]
      country['gdp'] = line[5]
      countries << country
    end
    countries.to_json
  	#@countries = Country.all.to_json
  end
  
end