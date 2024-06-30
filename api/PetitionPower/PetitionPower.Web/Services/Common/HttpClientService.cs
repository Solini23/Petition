using Microsoft.AspNetCore.WebUtilities;
using Newtonsoft.Json;
using System.Net.Http.Headers;

namespace PetitionPower.Web.Services.Common;

public interface IHttpClientService
{
    Task<T> GetAsync<T>(string endpoint, Dictionary<string, string?>? queryParameters, CancellationToken cancellationToken, string accessToken = "access_token");
    Task<T> PostAsync<T>(string endpoint, Dictionary<string, string> bodyParameters, CancellationToken cancellationToken);
}


public class HttpClientService : IHttpClientService
{
    private readonly HttpClient _httpClient;

    public HttpClientService(HttpClient httpClient)
    {
        _httpClient = httpClient;
    }

    public async Task<T> GetAsync<T>(string endpoint, Dictionary<string, string?>? queryParameters, CancellationToken cancellationToken, string accessToken = "access_token")
    {
        return await SendHttpRequestAsync<T>(HttpMethod.Get, endpoint, cancellationToken, accessToken, queryParameters);
    }

    public async Task<T> PostAsync<T>(string endpoint, Dictionary<string, string> bodyParameters, CancellationToken cancellationToken)
    {
        var httpContent = new FormUrlEncodedContent(bodyParameters);
        return await SendHttpRequestAsync<T>(HttpMethod.Post, endpoint, cancellationToken, httpContent: httpContent);
    }

    private async Task<T> SendHttpRequestAsync<T>(HttpMethod httpMethod, string endpoint, CancellationToken cancellationToken, string? accessToken = null, Dictionary<string, string?>? queryParams = null, HttpContent? httpContent = null)
    {
        var url = queryParams != null
            ? QueryHelpers.AddQueryString(endpoint, queryParams)
            : endpoint;

        var request = new HttpRequestMessage(httpMethod, url);

        if (accessToken != null)
        {
            request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", accessToken);
        }

        if (httpContent != null)
        {
            request.Content = httpContent;
        }

        using var response = await _httpClient.SendAsync(request, cancellationToken);

        var resultJson = await response.Content.ReadAsStringAsync(cancellationToken);

        if (!response.IsSuccessStatusCode)
        {
            throw new HttpRequestException(resultJson);
        }

        var result = JsonConvert.DeserializeObject<T>(resultJson);
        return result!;
    }
}