using DolosIngestion.Services;
using FluentAssertions;
using Moq;

namespace DolosIngestion.Tests.Services;

public class IngestMainPageServiceTests
{
    private Mock<IQueueWrapper> MockedQueueWrapper;
    private static Mock<IHttpClientFactory>? MockedClientFactory;
    private IIngestMainPage IngestMainPageService => 
        new IngestMainPageService(MockedClientFactory.Object, MockedQueueWrapper.Object);

    public IngestMainPageServiceTests()
    {
        MockedQueueWrapper = new Mock<IQueueWrapper>();
        MockedQueueWrapper.Setup(x => x.SendMessageAsync(It.IsAny<string>())).ReturnsAsync(true);
        MockedClientFactory = new Mock<IHttpClientFactory>();
    }
    
    private const string TestLinkResponse = @"
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
    
    const string NextPageResponse = @"
        </div><br><br>

        <div class=""cnnTransDate"">September 24, 2010</div>
        <div class=""cnnSectBulletItems"">

        &#149;&nbsp;<a href=""/show/lkl/date/2010-09-24/segment/01"">Cast of ""Saturday Night Live"" Speaks</a><br>

        </div><br><br>


        <p class=""cnnBodyText"">

        <a href=""?start_fileid=lkl_2010-09-24_01"">Next Page</a>

        </p>
    ";

    [Fact]
    public void ExtractLinksTest()
    {
        IEnumerable<string> result = IngestMainPageService.ExtractTranscriptLinks(TestLinkResponse);
        result.Should().HaveCount(4);
    }

    [Fact]
    public void GetNextPageLinkTest_Should_ReturnLink()
    {
        var result = IngestMainPageService.GetNextPageLink(NextPageResponse);

        result.Should().NotBeNull();
        result.Should().Be("?start_fileid=lkl_2010-09-24_01");
    }
    
    [Fact]
    public void GetNextPageLinkTest_Should_ReturnNull()
    {
        string? result = IngestMainPageService.GetNextPageLink("");
        result.Should().BeNull();
    }
}