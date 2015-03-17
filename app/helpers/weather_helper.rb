module WeatherHelper
	def weather_for_trip(date)
		w_api = Wunderground.new
		w_api.history_for(date, geo_ip:"24.12.64.197", lang: "EN")["history"]["dailysummary"]
	end
end
