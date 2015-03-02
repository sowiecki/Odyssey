class MapController < ApplicationController
	include MapHelper

	def index
	end

	def trip
		hash = Gmaps4rails.build_markers(next_trip) do |trip, marker|
			origin_station = Station.find_by(station_id: trip.origin_station_id)
			destination_station = Station.find_by(station_id: trip.destination_station_id)
		  marker.lat(origin_station.latitude)
		  marker.lng(origin_station.longitude)
		  marker.json({
		  	trip_id: trip.trip_id,
		  	start_time: DateTime.parse(trip.start_time).strftime("%I:%M%p on %m/%d/%Y"),
		  	stop_time: DateTime.parse(trip.stop_time).strftime("%I:%M%p on %m/%d/%Y"),
		  	duration: trip.trip_duration,
		  	start_location: origin_station.name,
		  	stop_location: destination_station.name
		  })
		end
		render json: hash
	end
end
