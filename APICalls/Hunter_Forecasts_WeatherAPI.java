package APICalls;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;

public class Hunter_Forecasts_WeatherAPI {
    public static void main(String[] args) throws Exception {
        String apiKey = "1abbb345f5735236601f4c038c1474a9";
        String latitude = "35";
        String longitude = "80";

        String url = "https://api.openweathermap.org/data/3.0/onecall/overview?lat=" + latitude +"&lon=" + longitude + "&appid=" + apiKey + "&units=metric";

        HttpClient client = HttpClient.newHttpClient();

        HttpRequest request = HttpRequest.newBuilder().uri(URI.create(url)).GET().build();

        HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());

        System.out.println(response.body());
    }
}