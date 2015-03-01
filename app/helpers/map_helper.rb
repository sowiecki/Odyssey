module MapHelper
	def trip_segment_params
		params[:trip_history_segment].to_i * 10
	end

	def next_trip_params
		params[:offset].to_i + 10
	end

	def next_ten_trips
		Trip.where(bike_id: params[:bike_id].to_i).offset(trip_segment_params).limit(10).order(:start_time).to_a
	end

	def next_trip
		Trip.where(bike_id: params[:bike_id].to_i).offset(next_trip_params).limit(1).order(:start_time).to_a
	end
end
