class MapController < ApplicationController
	include MapHelper

	def index
	end

	def ten_trips
		hash = Gmaps4rails.build_markers(next_ten_trips) do |trip, marker|
			station = Station.find_by(station_id: trip.origin_station_id)
		  marker.lat(station.latitude)
		  marker.lng(station.longitude)
		  marker.json({
		  	start_time: trip.start_time,
		  	stop_time: trip.stop_time,
		  	duration: trip.trip_duration
		  })
		end
		render json: hash
	end

	def get_next_trip
		hash = Gmaps4rails.build_markers(next_trip) do |trip, marker|
			station = Station.find_by(station_id: trip.origin_station_id)
		  marker.lat(station.latitude)
		  marker.lng(station.longitude)
		  marker.json({
		  	start_time: trip.start_time,
		  	stop_time: trip.stop_time,
		  	duration: trip.trip_duration
		  })
		end
		render json: hash
	end
end
