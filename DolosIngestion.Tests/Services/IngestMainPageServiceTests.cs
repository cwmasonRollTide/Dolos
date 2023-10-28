using DolosIngestion.Services;
using FluentAssertions;

namespace DolosIngestion.Tests.Services;

public class IngestMainPageServiceTests
{
    private IIngestMainPage IngestMainPageService = new IngestMainPageService();
    private const string testResponseString = @"
        <p><a href=""/"" class=""cnnTransProv"">Return to Transcripts main page</a></p>

        <p class=""cnnTransHead"">CNN Larry King Live</p>
        <p class=""cnnBodyText""><b>Note:</b> This page is continually updated as new transcripts become available. If you cannot find a specific segment, check back later.</p>

        <div class=""cnnTransDate"">December 10, 2011</div>
        <div class=""cnnSectBulletItems"">

        &#149;&nbsp;<a href=""/show/lkl/date/2011-12-10/segment/01"">LARRY KING SPECIAL: Dinner with the Kings</a><br>

        </div><br><br>

        <div class=""cnnTransDate"">December 04, 2011</div>
        <div class=""cnnSectBulletItems"">

        &#149;&nbsp;<a href=""/show/lkl/date/2011-12-04/segment/01"">LARRY KING SPECIAL: Dinner with the Kings</a><br>

        </div><br><br>

        <div class=""cnnTransDate"">October 22, 2011</div>
        <div class=""cnnSectBulletItems"">

        &#149;&nbsp;<a href=""/show/lkl/date/2011-10-22/segment/01"">Larry King Special: Johnny Depp</a><br>

        </div><br><br>

        <div class=""cnnTransDate"">October 16, 2011</div>
        <div class=""cnnSectBulletItems"">

        &#149;&nbsp;<a href=""/show/lkl/date/2011-10-16/segment/01"">Larry King Special: Johnny Depp</a><br>

        </div><br><br>

        <div class=""cnnTransDate"">July 16, 2011</div>
        <div class=""cnnSectBulletItems"">
    ";

    [Fact]
    public void ExtractLinksTest()
    {
        var result = IngestMainPageService.ExtractTranscriptLinks(testResponseString);
        result.Should().HaveCount(5);
    }
}