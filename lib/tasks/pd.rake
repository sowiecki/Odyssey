require 'csv'

Neo4j::Session.open(:server_db, 'http://localhost:7474', {basic_auth: {username: 'foo', password: 'bar'}})

namespace :pd do
	desc "Parse Divvy 2013 stations data into database"
	task stations: :environment do
		file = File.expand_path("../divvy_data/Divvy_Stations_2013.csv", __FILE__)
		CSV.foreach(file, headers: true) do |row|
			Station.create(
				station_id: row["id"].to_i,
				name: row["name"],
				latitude: row["latitude"].to_f,
				longitude: row["longitude"].to_f,
				dpcapacity: row["dpcapacity"].to_i,
				online_date: Date.strptime(row["online date"], '%m/%d/%Y')
			)
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
