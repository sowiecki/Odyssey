class Trip
	include Neo4j::ActiveNode

	has_one :in, :origin
	has_one :out, :destination

	property :trip_id, type: Integer
	property :start_time, type: DateTime
	property :stop_time, type: DateTime
	property :bike_id, type: Integer
	property :trip_duration, type: Integer
	property :origin_station_id, type: Integer
	property :destination_station_id, type: Integer
	property :origin_station_name, type: String
	property :destination_station_name, type: String
	property :user_type, type: String
	property :gender, type: String
	property :birthday, type: Integer # Year only
end