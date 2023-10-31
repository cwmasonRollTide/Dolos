using HtmlAgilityPack;
using DolosTranscriptParser.Models;
using System.Text.RegularExpressions;

namespace DolosTranscriptParser.Services.Parsing;

public static class TranscriptParser
{
    public static string ExtractGuestName(string rawHtml)
    {
        var document = new HtmlDocument();
        document.LoadHtml(rawHtml);
        HtmlNode? guestNameNode = document.DocumentNode.SelectSingleNode("//p[@class='cnnTransSubHead']");
        if (guestNameNode == null) 
            return "";

        string[] patterns = 
        {
            @"Larry King Special: (.*?)( -|$)",
            @"Piers Morgan Interviews (.+)",
            @"Encore: One-on-One with (.+?)(;| -|$)",
            @"Encore: Interview With (.+?)(;| -|$)",
            @"One-on-One with (.+?)(;| -|$)",
            @"Interview With (.+?)(;| -|$)"
        };

        foreach (string pattern in patterns)
        {
            Match match = Regex.Match(guestNameNode.InnerText, pattern);
            if (match.Success)
            {
                return match.Groups[1].Value;
            }
        }

        return "";
    }
    
    public static List<PromptCompletionPair> ExtractPromptCompletionPairs(string htmlContent, string guestFullName)
    {
        var pairs = new List<PromptCompletionPair>();
        var doc = new HtmlDocument();
        doc.LoadHtml(htmlContent);
    
        string guestAbbreviation = guestFullName.Split(' ').Last().ToUpper() + ":";
        List<HtmlNode> textNodes = doc.DocumentNode.DescendantsAndSelf()
            .Where(n => n.NodeType == HtmlNodeType.Text && 
                        (n.InnerHtml.Contains("KING:") || n.InnerHtml.Contains(guestAbbreviation)))
            .ToList();

        for (var i = 0; i < textNodes.Count - 1; i++)
        {
            if (!textNodes[i].InnerHtml.Contains("KING:") ||
                !textNodes[i + 1].InnerHtml.Contains(guestAbbreviation)) continue;
            var pair = new PromptCompletionPair
            {
                Prompt = CleanUp(textNodes[i].InnerHtml),
                Completion = CleanUp(textNodes[i + 1].InnerHtml)
            };
            pairs.Add(pair);
        }
    
        return pairs;
    }

    private static string CleanUp(string text)
    {
        return text.Replace("<br/>", " ").Trim();
    }
}