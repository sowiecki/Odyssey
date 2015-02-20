require 'csv'
require_relative '../../config/environment'

namespace :pd do
	desc "Parse Divvy 2013 stations data into database"
	task stations: :environment do
		file = File.expand_path("../divvy_data/Divvy_Stations_2013.csv", __FILE__)
		CSV.foreach(file, headers: true) do |row|
			station = Station.create(name: row["name"])
			p station

		end
	end

	desc "Parse Divvy 2013 trips data into database"
	task trips: :environment do
		file = File.expand_path("../divvy_data/Divvy_Trips_2013.csv", __FILE__)
		CSV.foreach(file, headers: true) do |row|
			p row
		end
	end
end
