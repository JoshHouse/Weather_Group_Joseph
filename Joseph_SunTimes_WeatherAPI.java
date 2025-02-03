import java.net.http.HttpClient;  // Import HttpClient to send requests to the API
import java.net.http.HttpRequest; // Import HttpRequest to create the HTTP request
import java.net.http.HttpResponse; // Import HttpResponse to handle the API response
import java.net.URI;  // Import URI to handle the request URL
import org.json.JSONObject;  // Import JSONObject for parsing the JSON response (you will need to include the org.json library)

public class Joseph_SunTimes_WeatherAPI {
    public static void main(String[] args) throws Exception {
        
        // OpenWeatherMap API key
        String apiKey = "api key";  
        
        // The city for which you want to get the weather data
        String city = "North Carolina";
        
        // Construct the API URL by inserting the city name and API key into the URL template
        String url = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + apiKey + "&units=metric";
        
        // Create a new HttpClient instance to send the HTTP request
        HttpClient client = HttpClient.newHttpClient();
        
        // Build the HttpRequest object with the URL and specify that this is a GET request
        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(url))  // Set the URI (URL) of the API request
                .GET()  // Use the GET method (requesting data from the API)
                .build();  // Finalize the HttpRequest object creation
        
        // Send the HTTP request using the HttpClient and get the response as a String
        HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());
        
        // switch the response body from JSON format to JSONObject for easier handling
        JSONObject jsonResponse = new JSONObject(response.body());
        
        // Get the sunrise and sunset times from the "sys" section of the JSON response, which are in Unix timestamp format
        long sunrise = jsonResponse.getJSONObject("sys").getLong("sunrise");
        long sunset = jsonResponse.getJSONObject("sys").getLong("sunset");
        
        // Output the sunrise and sunset times (in Unix timestamp format)
        System.out.println("Sunrise Time (Unix Timestamp): " + sunrise);
        System.out.println("Sunset Time (Unix Timestamp): " + sunset);
        
        // Convert the Unix timestamps to readable times (assuming UTC for now)
        // The following method can be used to convert the timestamps into local time

        printSunTimes(sunrise, sunset); // method to print the converted sunrise and sunset times
    }

    // This method converts the Unix timestamps into readable times
    public static void printSunTimes(long sunrise, long sunset) {
        // Convert the Unix timestamp for sunrise into an Instant
        java.time.ZonedDateTime sunriseTime = java.time.Instant.ofEpochSecond(sunrise)
                .atZone(java.time.ZoneId.of("UTC"));  // Convert to UTC time zone
        
        // Convert the Unix timestamp for sunset into an Instant
        java.time.ZonedDateTime sunsetTime = java.time.Instant.ofEpochSecond(sunset)
                .atZone(java.time.ZoneId.of("UTC"));  // Convert to UTC time zone
        
        // Print the sunrise and sunset times (local time in UTC)
        System.out.println("Sunrise (UTC): " + sunriseTime.toLocalTime());
        System.out.println("Sunset (UTC): " + sunsetTime.toLocalTime());
    }
}

