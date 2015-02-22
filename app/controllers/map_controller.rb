class MapController < ApplicationController
	def index
		@trips = Trip.where(bike_id: 361)
		@hash = Gmaps4rails.build_markers(@trips) do |trip, marker|
			station = Station.find_by(station_id: trip.origin_station_id)
		  marker.lat station.latitude
		  marker.lng station.longitude
		end
	end
end
