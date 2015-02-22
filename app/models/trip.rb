class Trip
	include Neo4j::ActiveNode

	# after_create :set_next_trip

	# has_one :in, :origin_station_id, model_class: Station
	# has_one :out, :destination_station_id, model_class: Station
	has_one :out, :next_trip, model_class: Trip

	property :trip_id, type: Integer, constraint: :unique
	property :start_time, type: DateTime, index: :exact
	property :stop_time, type: DateTime, index: :exact
	property :bike_id, type: Integer, index: :exact
	property :trip_duration, type: Integer
	property :origin_station_id, type: Integer, index: :exact
	property :destination_station_id, type: Integer, index: :exact
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

	# def set_next_trip
	# 	self.next_trip << Trip.where do |property|
	# 		(property[:origin_station_id] == self.destination_station_id) &
	# 		(property[:start_time] >= self.stop_time) &
	# 		(property[:bike_id] == self.bike_id)
	# 	end
	# end
end