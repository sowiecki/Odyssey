class Trip
	include Neo4j::ActiveNode

	has_one :out, :next_trip, model_class: Trip

	property :trip_id, type: Integer
	property :start_time, type: String
	property :stop_time, type: String
	property :bike_id, type: Integer
	property :trip_duration, type: Integer
	property :origin_station_id, type: Integer
	property :destination_station_id, type: Integer
	property :origin_station_name, type: String
	property :destination_station_name, type: String
	property :user_type, type: String
	property :gender, type: String
	property :birthday, type: Integer # Year only

	validates :trip_id,
						:start_time,
						:stop_time,
						:bike_id,
						:origin_station_id,
						:destination_station_id,
						presence: true

	validates :trip_id,
						:bike_id,
						:origin_station_id,
						:destination_station_id,
						numericality: { only_integer: true }
end