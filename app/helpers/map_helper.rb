module MapHelper
	def trip_history_segment
		params[:trip_history_segment].to_i * 20
	end

	def trips
		puts trip_history_segment
		offset = trip_history_segment
		Trip.where(bike_id: params[:bike_id]
										.to_i)
										.limit(20)
										.offset(offset)
										.order(start_time: :desc)
	end
end
