class MapController < ApplicationController
	include MapHelper

	def index
	end

	def markers
		array = []
		trips.each do |trip|
			station = Station.find_by(station_id: trip.origin_station_id)
			array << [station.latitude, station.longitude]
		end
		array.delete_at(2)
		render json: array
	end

	# def markers
	# 	hash = Gmaps4rails.build_markers(trips) do |trip, marker|
	# 		station = Station.find_by(station_id: trip.origin_station_id)
	# 	  marker.lat(station.latitude)
	# 	  marker.lng(station.longitude)
	# 	  marker.json({
	# 	  	start_time: trip.start_time,
	# 	  	stop_time: trip.stop_time,
	# 	  	duration: trip.trip_duration
	# 	  })
	# 	end
	# 	render json: hash
	# end
end
