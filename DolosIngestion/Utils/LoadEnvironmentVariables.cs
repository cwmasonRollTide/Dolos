namespace DolosIngestion.Utils;

public class LoadEnvironmentVariables
{
    public static void LoadEnvironmentVariablesFromDotEnv()
    {
        var envFilePath = Path.Combine(Directory.GetCurrentDirectory(), ".env");
        if (File.Exists(envFilePath))
        {
            var envVars = File.ReadAllLines(envFilePath)
                .Where(line => !string.IsNullOrWhiteSpace(line) && !line.StartsWith("#"))
                .Select(line => line.Split('=', 2))
                .Where(parts => parts.Length == 2)
                .ToDictionary(parts => parts[0], parts => parts[1]);

            foreach (var envVar in envVars)
            {
                Environment.SetEnvironmentVariable(envVar.Key, envVar.Value);
            }
        }
    }
}