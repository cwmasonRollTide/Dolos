using System.Text.RegularExpressions;
using HtmlAgilityPack;

namespace DolosTranscriptParser.Services.Parsing;

public static class TranscriptParser
{
    public static string ExtractGuestName(string rawHtml)
    {
        var document = new HtmlDocument();
        document.LoadHtml(rawHtml);
        HtmlNode? guestNameNode = document.DocumentNode.SelectSingleNode("//p[@class='cnnTransSubHead']");
        var guestName = "";
        if (guestNameNode == null) 
            return guestName;

        // Patterns array
        string[] patterns = 
        {
            @"Larry King Special: (.*?)( -|$)",
            @"Piers Morgan Interviews (.+)",
            @"Encore: One-on-One with (.+?)(;| -|$)",
            @"Encore: Interview With (.+?)(;| -|$)",
            @"One-on-One with (.+?)(;| -|$)",
            @"Interview With (.+?)(;| -|$)"
        };

        foreach (var pattern in patterns)
        {
            var match = Regex.Match(guestNameNode.InnerText, pattern);
            if (match.Success)
            {
                return match.Groups[1].Value;
            }
        }

        return "";
    }
}