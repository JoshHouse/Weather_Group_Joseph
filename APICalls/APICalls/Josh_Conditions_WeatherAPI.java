package APICalls;
/*
 *   Java Package to create an HttpClient:
 *   - You can think of an HttpClient as a messanger that is responsible 
 *     for sending the HttpRequest
 */ 
import java.net.http.HttpClient;
/*
 *   Java Package to create an HttpRequest:
 *   - You can think of an HttpRequest as the envelope that you put a letter
 *     in that says "Hey, can you send this information to me?"
 *   - This is what the HttpClient (sort of like the mail man) sends to the API
 */
import java.net.http.HttpRequest;
/*
 *   Java Package to create an HttpResponse:
 *   - You can think of an HttpResponse as the mailbox that the information
 *     the API sends back is stored in
 */
import java.net.http.HttpResponse;
/*
 *   Java Package to create a URI (Uniform Resource Identifier):
 *   - URI's identifies a resource (For example, it could be a name,
 *     file path, or web address)
 *   - Difference between a URI and a URL:
 *     - A URL is a specific type of URI that specifies the address but
 *       also specifies the protocol needed to access it (aka: http, ftp, etc.)
 *     - A URI is more broad and can include file paths, names etc.
 *     - So in summary, similar to how a square is always a rectangle but a rectangle
 *       isn't always a square, a URL is always a URI but a URI isn't always a URL
 */
import java.net.URI;

import com.google.gson.Gson;

import APICalls.CurrentWeatherDataClasses.CurrentWeatherResponse;

public class Josh_Conditions_WeatherAPI {
    public static void main(String[] args) throws Exception {
        
        /*
         *  - API Key and City are stored in variables to make it easier to see how they
         *    are implemented into the URL. In theory you could hard code it into the URL
         *  - This API Key is specific to my account and each account has a set amount of
         *    queries per day before the API begins to charge the payment method on the 
         *    account so please create your own account and do not use this API Key
         */
        String apiKey = "a7ecb5d8aaa97f57473de04085971f14";
        String city = "London";
        /*
         *  - The URL is stored in a variable to make future code more readable but this is
         *    the structure of the OpenWeatherAPI's Current Weather Data query
         */
        String url = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + apiKey + "&units=imperial";


        /*
         *  - This line creates the HttpClient, essentially the mailman that sends the HTTP
         *    request. You can check the comments above the import statements for a little
         *    more detail.
         */
        HttpClient client = HttpClient.newHttpClient();
        
        /*
         *  - This line creates the HttpRequest, essentially the envelope that holds the
         *    letter sent to the API asking for information. Slightly more detail can be found
         *    in the comments above the import statements.
         */
        HttpRequest request = HttpRequest.newBuilder()
                /*
                 *  - These next lines could (and probably should) be compacted onto the line
                 *    creating the HttpRequest but are each but onto differet lines to more 
                 *    easily follow each part
                 */

                /*
                 *  - HttpRequests require a uri element. Even though the string is formatted 
                 *    properly, it still needs to be converted to a URI so the HttpRequest can
                 *    handle it properly.
                 */ 
                .uri(URI.create(url))
                
                // Designates that we are requesting information rather than sending it
                .GET()
                
                // Says that I am done creating the request and am ready to build it
                .build();

        /*
         *  - Creates an HttpResponse variable to store a string response (kind of like the mail
         *    box) 
         *  - The right side of the "=" is using the client (the mail man) to send the request
         *    (the envelope) to the API
         *  - The statement "HttpResponse.BodyHandlers.ofString()" converts the JSON file that
         *    the API responds with to a string.
         */
        HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());
        
        Gson gson = new Gson();

        CurrentWeatherResponse weatherResponse = gson.fromJson(response.body(), CurrentWeatherResponse.class);
        // Prints the response
        System.out.println("The current weather conditions in " + weatherResponse.name + " at longitude " + weatherResponse.coord.lon
        + " and latitude " + weatherResponse.coord.lat + " are as follows:");
        for (int x = 0; x < weatherResponse.weather.length; x++) {
            System.out.println("Weather Status: " + weatherResponse.weather[x].main);
            System.out.println("\t - Description: " + weatherResponse.weather[x].description);
        }
        System.out.println("Temperature: " + weatherResponse.main.temp + " F");
        System.out.println("\t - Temperature Range: " + weatherResponse.main.temp_min + " F to " + weatherResponse.main.temp_max + " F");
        System.out.println("\t - Feels Like: " + weatherResponse.main.feels_like + " F");
        System.out.println("Wind: " + weatherResponse.wind.speed + " mph");
    }
}
