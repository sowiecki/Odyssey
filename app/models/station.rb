class Station
	include Neo4j::ActiveNode

	property :station_id, type: Integer, constraint: :unique
	property :name, type: String, constraint: :unique
	property :latitude, type: Float
	property :longitude, type: Float
	property :dpcapacity, type: String
	property :landmark, type: Integer
	property :online_date, type: DateTime

	validates :station_id,
						:name,
						:latitude,
						:longitude,
						presence: true
end