class MapController < ApplicationController
	def index
		
	end

	def markers
		trips = Trip.where(bike_id: params[:bike_id].to_i).limit(50).order(start_time: :desc)
		hash = Gmaps4rails.build_markers(trips) do |trip, marker|
			station = Station.find_by(station_id: trip.origin_station_id)
		  marker.lat(station.latitude)
		  marker.lng(station.longitude)
		  marker.json({
		  	start_time: trip.start_time,
		  	stop_time: trip.stop_time,
		  	duration: trip.trip_duration
		  })
		end
		puts hash
		render json: hash
	end
end
