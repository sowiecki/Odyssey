require 'csv'

namespace :pd do
	desc "Parse Divvy 2013 stations data into database"
	task stations: :environment do
		file = File.expand_path("../divvy_data/Divvy_Stations_2013.csv", __FILE__)
		read_test = CSV.read(file)
		p read_test
	end

	desc "Parse Divvy 2013 trips data into database"
	task trips: :environment do
		file = "/divvy_data/Divvy_Trips_2013.csv"
	end
end
