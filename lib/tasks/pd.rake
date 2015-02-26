require 'csv'
require 'date'

# CSV loaders expect divvy_data to be located in /public/

namespace :pd do
	desc "Fix invalid dates"
	task fixdates: :environment do
		bike_ids = Set.new(1..3000)
		bike_ids.each do |bike_id|
			bike_trips = Trip.where(bike_id: bike_id).to_a
			bike_trips.each do |trip|
				p trip.start_time
				trip.start_time = DateTime.strptime(trip.start_time, "%m/%d/%Y %H:%M")
				trip.stop_time = DateTime.strptime(trip.stop_time, "%m/%d/%Y %H:%M")
				p trip.start_time
				trip.save
			end
		end
	end

	desc "Parse Divvy 2014 stations data into database"
	task stations: :environment do
		file = File.join(Rails.public_path, "divvy_data", "Divvy_Stations_2014-Q1Q2.csv", )
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

	desc "Parse Divvy 2014 trips data into database"
	task trips: :environment do
		file = File.join(Rails.public_path, "divvy_data", "Divvy_Trips_2014-Q1Q2a.csv")
		# file = File.join(Rails.public_path, "divvy_data", "Divvy_Trips_2014-Q1Q2b.csv")
		# file = File.join(Rails.public_path, "divvy_data", "Divvy_Trips_2014-Q1Q2c.csv")
		# file = File.join(Rails.public_path, "divvy_data", "Divvy_Trips_2014-Q1Q2d.csv")
		# file = File.join(Rails.public_path, "divvy_data", "Divvy_Trips_2014-Q3a.csv")
		# file = File.join(Rails.public_path, "divvy_data", "Divvy_Trips_2014-Q3b.csv")
		# file = File.join(Rails.public_path, "divvy_data", "Divvy_Trips_2014-Q3c.csv")
		# file = File.join(Rails.public_path, "divvy_data", "Divvy_Trips_2014-Q4a.csv")
		# file = File.join(Rails.public_path, "divvy_data", "Divvy_Trips_2014-Q4b.csv")
		CSV.foreach(file, headers: true) do |row|
			Trip.create(
				trip_id: row["trip_id"].to_i,
				start_time: Date.strptime(row["starttime"], "%m/%d/%Y %H:%M"),
				stop_time: Date.strptime(row["stoptime"], "%m/%d/%Y %H:%M"),
				bike_id: row["bikeid"].to_i,
				trip_duration: row["tripduration"].to_i,
				origin_station_id: row["from_station_id"].to_i,
				destination_station_id: row["to_station_id"].to_i,
				origin_station_name: row["to_station_name"],
				destination_station_name: row["from_station_name"],
				user_type: row["usertype"],
				gender: row["gender"],
				birthday: row["birthday"].to_i
			)
		end
	end
	desc "Build relations between trips"
	task connect: :environment do
		# bike_ids = Set.new(1..3000)
		bike_ids = Set.new()
		Trip.all.limit(10).each { |trip| p trip.bike_id; bike_ids << trip.bike_id }
		p bike_ids
		# Invalid bike ids 14, 15, 16, 17
		# p Trip.where(bike_id: 83).to_a.sort_by! { |bike_trip| p bike_trip; puts "flag!" unless Date.strptime(bike_trip.start_time,"%m/%d/%Y %H:%M") rescue false; bike_trip.start_time_fixed }
		# bike_ids.each do |bike_id|
		# 	bike_trips = Trip.where(bike_id: bike_id).to_a.sort_by { |bike_trip| bike_trip.start_time_fixed }
		# 	bike_trips.each_with_index do |trip, index|
		# 		trip.next_trip = bike_trips[index + 1] if trip.next_trip
		# 		p trip.next_trip
		# 	end
		# 	bike_trips.last.next_trip = nil if bike_trips.last # Prevent last trip from being connected to first
		# end
	end
end
