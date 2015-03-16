class Bike
	include Neo4j::ActiveNode

	# has_n :trips

	property :bike_id, constraint: :unique
end