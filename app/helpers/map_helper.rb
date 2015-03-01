module MapHelper
	def trip_segment_params
		params[:trip_history_segment].to_i * 10
	end

	def next_trip_params
		params[:offset].to_i + 10
	end

	def next_ten_trips
		Trip.where(bike_id: params[:bike_id].to_i).order(:start_time).offset(0).limit(10).to_a
	end

	def next_trip
		Trip.where(bike_id: params[:bike_id].to_i).order(:start_time).offset(10).limit(1).to_a
	end
end
