package APICalls;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;
import org.json.JSONObject;
public class AirQualityAPI {
    
    private static final String API_KEY = "6fd23365cb0cff93a229f133b710d825";  
    private static final String BASE_URL = "http://api.openweathermap.org/data/2.5/air_pollution";
    private static final String GEOLOCATION_URL = "http://ip-api.com/json";
    // Method to get user's latitude and longitude automatically using IP geolocation
    public static double[] getUserLocation() {
        try {
            URL url = new URL(GEOLOCATION_URL);
            HttpURLConnection conn = (HttpURLConnection) url.openConnection();
            conn.setRequestMethod("GET");
            BufferedReader reader = new BufferedReader(new InputStreamReader(conn.getInputStream()));
            StringBuilder response = new StringBuilder();
            String line;
            while ((line = reader.readLine()) != null) {
                response.append(line);
            }
            reader.close();
            JSONObject jsonResponse = new JSONObject(response.toString());
            double latitude = jsonResponse.getDouble("lat");
            double longitude = jsonResponse.getDouble("lon");
            return new double[]{latitude, longitude};
        } catch (Exception e) {
            System.out.println("Error fetching user location: " + e.getMessage());
            return new double[]{0, 0}; // Default values if location fetch fails
        }
    }
    // Method to fetch air quality data from OpenWeather API
    public static String getAirQuality(double latitude, double longitude) {
        String urlString = BASE_URL + "?lat=" + latitude + "&lon=" + longitude + "&appid=" + API_KEY;
        try {
            URL url = new URL(urlString);
            HttpURLConnection conn = (HttpURLConnection) url.openConnection();
            conn.setRequestMethod("GET");
            BufferedReader reader = new BufferedReader(new InputStreamReader(conn.getInputStream()));
            StringBuilder response = new StringBuilder();
            String line;
            while ((line = reader.readLine()) != null) {
                response.append(line);
            }
            reader.close();
            JSONObject jsonResponse = new JSONObject(response.toString());
            JSONObject mainData = jsonResponse.getJSONArray("list").getJSONObject(0).getJSONObject("main");
            int aqi = mainData.getInt("aqi"); // Air Quality Index
            
            return "Air Quality Index (AQI): " + aqi;
        } catch (Exception e) {
            return "Error fetching air quality data: " + e.getMessage();
        }
    }
    public static void main(String[] args) {
        // Get user's location
        double[] location = getUserLocation();
        double latitude = location[0];
        double longitude = location[1];
        // Fetch and display air quality
        System.out.println("Detected Location -> Latitude: " + latitude + ", Longitude: " + longitude);
        System.out.println(getAirQuality(latitude, longitude));
    }
}