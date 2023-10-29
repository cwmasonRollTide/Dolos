using DolosTranscriptParser.Services.Parsing;
using FluentAssertions;

namespace DolosTranscriptParser.Tests.Services;

public class TranscriptBuilderServiceTests
{
    private const string interviewWithStevieWonder = @"
        <p class=""cnnTransStoryHead"">CNN Larry King Live</p>
        <p class=""cnnTransSubHead"">Encore: Interview With Stevie Wonder</p>
        <p class=""cnnBodyText"">Aired December 23, 2010 - 21:00 &nbsp;ET</p>
    ";

    private const string interviewWithConan = @"
        <p class=""cnnTransStoryHead"">CNN Larry King Live</p>
        <p class=""cnnTransSubHead"">Interview With Conan O'Brien</p>
        <p class=""cnnBodyText"">Aired December 13, 2010 - 21:00 &nbsp;ET</p>
    ";

    private const string interviewWithJohnnyDepp = @"
        <p class=""cnnTransStoryHead"">CNN Larry King Live</p>
        <p class=""cnnTransSubHead"">Larry King Special: Johnny Depp</p>
        <p class=""cnnBodyText"">Aired October 22, 2011 - 20:00 &nbsp;ET</p>
        <p class=""cnnBodyText"">THIS IS A RUSH TRANSCRIPT. THIS COPY MAY NOT BE IN ITS FINAL FORM AND MAY BE UPDATED.</p>
        <p class=""cnnBodyText"">
    ";
    [Theory]
    [InlineData(interviewWithStevieWonder, "Stevie Wonder")]
    [InlineData(interviewWithConan, "Conan O'Brien")]
    [InlineData(interviewWithJohnnyDepp, "Johnny Depp")]
    public void ExtractGuestName_ShouldWork_ForDifferentStringInputs(string input, string expected)
    {
        var result = TranscriptParser.ExtractGuestName(input);
        result.Should().Be(expected);
    }
}