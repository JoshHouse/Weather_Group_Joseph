package APICalls.CurrentWeatherDataClasses;

public class CurrentWeatherResponse {
    public Coordinates coord;
    public Weather[] weather;
    public String base;
    public Main main;
    public int visibility;
    public Wind wind;
    public Rain rain;
    public Clouds clouds;
    public Snow snow;
    public int dt;
    public Sys sys;
    public int timezone;
    public int id;
    public String name;
    public int cod;
}