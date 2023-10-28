namespace DolosIngestion.Services;

public interface IIngestMainPage
{
    Task<bool> Run(string siteResponse);
    List<string> ExtractTranscriptLinks(string htmlContent);
}

public class IngestMainPageService : IIngestMainPage
{
    public async Task<bool> Run(string siteResponse)
    {
        return true;
    }
    
    public List<string> ExtractTranscriptLinks(string htmlContent)
    {
        var doc = new HtmlAgilityPack.HtmlDocument();
        doc.LoadHtml(htmlContent);

        List<string> links = 
            doc.DocumentNode.SelectNodes("//a[@href]")
                .Select(a => a.GetAttributeValue("href", null)).ToList();
        return links;
    }
}