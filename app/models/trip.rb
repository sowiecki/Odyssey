class Trip
	include Neo4j::ActiveNode

	has_one :in, :origin
	has_one :out, :destination
end