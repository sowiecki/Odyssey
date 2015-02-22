class MapController < ApplicationController
	def index
		
	end

	def markers
		trips = Trip.where(bike_id: params[:bike_id].to_i)
		hash = Gmaps4rails.build_markers(trips) do |trip, marker|
			station = Station.find_by(station_id: trip.origin_station_id)
		  marker.lat(station.latitude)
		  marker.lng(station.longitude)
		end
		render json: hash
	end
end
