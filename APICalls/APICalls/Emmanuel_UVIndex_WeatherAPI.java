package APICalls;

import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.net.URI;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;

public class Emmanuel_UVIndex_WeatherAPI {
    public static void main(String[] args) throws Exception {
        String apiKey = "24106620cbdbd0abf71e61d0ebf6ed83"; // Your API key
        String city = "London";
        // Step 1: Get coordinates (lat/lon) for the city
        String weatherUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + 
                            city + "&appid=" + apiKey;
        HttpClient client = HttpClient.newHttpClient();
        HttpRequest weatherRequest = HttpRequest.newBuilder()
                .uri(URI.create(weatherUrl))
                .GET()
                .build();
        // Fetch weather data to extract coordinates
        HttpResponse<String> weatherResponse = client.send(weatherRequest, HttpResponse.BodyHandlers.ofString());
        
        if (weatherResponse.statusCode() != 200) {
            System.out.println("Error fetching city data: " + weatherResponse.statusCode());
            return;
        }
        // Parse JSON to get latitude/longitude
        JsonObject weatherData = JsonParser.parseString(weatherResponse.body()).getAsJsonObject();
        double lat = weatherData.getAsJsonObject("coord").get("lat").getAsDouble();
        double lon = weatherData.getAsJsonObject("coord").get("lon").getAsDouble();
        // Step 2: Fetch UV Index using coordinates
        String uvUrl = "https://api.openweathermap.org/data/2.5/uvi?lat=" + lat + 
                       "&lon=" + lon + "&appid=" + apiKey;
        HttpRequest uvRequest = HttpRequest.newBuilder()
                .uri(URI.create(uvUrl))
                .GET()
                .build();
        HttpResponse<String> uvResponse = client.send(uvRequest, HttpResponse.BodyHandlers.ofString());
        
        if (uvResponse.statusCode() == 200) {
            JsonObject uvData = JsonParser.parseString(uvResponse.body()).getAsJsonObject();
            double uvIndex = uvData.get("value").getAsDouble();
            System.out.println("UV Index in " + city + ": " + uvIndex);
        } else {
            System.out.println("Error fetching UV data: " + uvResponse.statusCode());
        }
    }
}