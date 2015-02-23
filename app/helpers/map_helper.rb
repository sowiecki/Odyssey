module MapHelper
	def trip_history_segment
		params[:trip_history_segment].to_i * 10
	end

	def trips
		Trip.where(bike_id: params[:bike_id].to_i)
				.offset(trip_history_segment)
				.limit(20)
				.order(start_time: :desc)
	end
end
