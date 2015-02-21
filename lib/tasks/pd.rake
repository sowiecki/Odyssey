require 'csv'
require 'date'

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
		file = File.expand_path("../divvy_data/test_trips.csv", __FILE__)
		CSV.foreach(file, headers: true) do |row|
			Trip.create(
				trip_id: row["trip_id"].to_i,
				start_time: row["starttime"].to_datetime,
				stop_time: row["stoptime"].to_datetime,
				bike_id: row["bikeid"].to_i,
				trip_duration: row["tripduration"].to_i,
				origin_station_id: row["from_station_id"].to_i,
				destination_station_id: row["to_station_id"].to_i,
				origin_station_name: row["to_station_name"],
				destination_station_name: row["from_station_name"],
				user_type: row["usertype"],
				gender: row["gender"],
				birthday: row["birthday"].to_i,
			)
		end
	end
end
