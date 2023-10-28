using HtmlAgilityPack;

namespace DolosIngestion.Services;

public interface IIngestMainPage
{
    Task<bool> Run(string url);
    string? GetNextPageLink(string htmlContent);
    IEnumerable<string> ExtractTranscriptLinks(string htmlContent);
}

public class IngestMainPageService : IIngestMainPage
{
    private readonly IHttpClientFactory _HttpClientFactory;
    public IngestMainPageService(IHttpClientFactory clientFactory)
    {
        _HttpClientFactory = clientFactory;
    }
    
    public async Task<bool> Run(string url)
    {
        HttpClient? client = _HttpClientFactory.CreateClient();
        string? nextPage = null;
        do
        {
            string response = await client.GetStringAsync($"{url}{nextPage}");
            IEnumerable<string> links = ExtractTranscriptLinks(response);
            links.ToList().ForEach(s => SendMessageToQueue(url, s));
            nextPage = GetNextPageLink(response);
        } while (nextPage != null);
        
        return true;
    }

    private void SendMessageToQueue(string baseUrl, string linkExt)
    {
        throw new NotImplementedException();
    }

    public string? GetNextPageLink(string htmlContent)
    {
        var doc = new HtmlDocument();
        doc.LoadHtml(htmlContent);
        HtmlNode? nextPageNode = doc.DocumentNode.SelectSingleNode("//a[starts-with(@href, '?start_fileid=')]");
        return nextPageNode?.GetAttributeValue("href", null);
    }

    
    public IEnumerable<string> ExtractTranscriptLinks(string htmlContent)
    {
        var doc = new HtmlAgilityPack.HtmlDocument();
        doc.LoadHtml(htmlContent);

        List<string> links = doc.DocumentNode
            .SelectNodes("//a[@href and not(@href='/')]")
            .Select(a => a.GetAttributeValue("href", null)).ToList();
        return links;
    }
}