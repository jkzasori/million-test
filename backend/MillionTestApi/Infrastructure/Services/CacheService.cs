using System.Text.Json;
using Microsoft.Extensions.Caching.Memory;

namespace MillionTestApi.Infrastructure.Services;

public interface ICacheService
{
    Task<T?> GetAsync<T>(string key) where T : class;
    Task SetAsync<T>(string key, T value, TimeSpan? expiry = null) where T : class;
    Task RemoveAsync(string key);
    Task RemovePatternAsync(string pattern);
}

public class MemoryCacheService : ICacheService
{
    private readonly IMemoryCache _cache;
    private readonly ILogger<MemoryCacheService> _logger;
    private readonly HashSet<string> _cacheKeys = new();
    private readonly object _lockObject = new();

    public MemoryCacheService(IMemoryCache cache, ILogger<MemoryCacheService> logger)
    {
        _cache = cache;
        _logger = logger;
    }

    public Task<T?> GetAsync<T>(string key) where T : class
    {
        try
        {
            if (_cache.TryGetValue(key, out var value) && value is T result)
            {
                _logger.LogDebug("Cache hit for key: {Key}", key);
                return Task.FromResult<T?>(result);
            }

            _logger.LogDebug("Cache miss for key: {Key}", key);
            return Task.FromResult<T?>(null);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving cache key: {Key}", key);
            return Task.FromResult<T?>(null);
        }
    }

    public Task SetAsync<T>(string key, T value, TimeSpan? expiry = null) where T : class
    {
        try
        {
            var options = new MemoryCacheEntryOptions
            {
                AbsoluteExpirationRelativeToNow = expiry ?? TimeSpan.FromMinutes(15),
                SlidingExpiration = TimeSpan.FromMinutes(5),
                Priority = CacheItemPriority.Normal
            };

            options.RegisterPostEvictionCallback((k, v, reason, state) =>
            {
                lock (_lockObject)
                {
                    _cacheKeys.Remove(k.ToString()!);
                }
                _logger.LogDebug("Cache key evicted: {Key}, Reason: {Reason}", k, reason);
            });

            _cache.Set(key, value, options);

            lock (_lockObject)
            {
                _cacheKeys.Add(key);
            }

            _logger.LogDebug("Cache set for key: {Key}", key);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error setting cache key: {Key}", key);
        }

        return Task.CompletedTask;
    }

    public Task RemoveAsync(string key)
    {
        try
        {
            _cache.Remove(key);
            lock (_lockObject)
            {
                _cacheKeys.Remove(key);
            }
            _logger.LogDebug("Cache key removed: {Key}", key);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error removing cache key: {Key}", key);
        }

        return Task.CompletedTask;
    }

    public Task RemovePatternAsync(string pattern)
    {
        try
        {
            List<string> keysToRemove;
            lock (_lockObject)
            {
                keysToRemove = _cacheKeys.Where(k => k.Contains(pattern)).ToList();
            }

            foreach (var key in keysToRemove)
            {
                _cache.Remove(key);
                lock (_lockObject)
                {
                    _cacheKeys.Remove(key);
                }
            }

            _logger.LogDebug("Cache pattern removed: {Pattern}, Keys: {Count}", pattern, keysToRemove.Count);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error removing cache pattern: {Pattern}", pattern);
        }

        return Task.CompletedTask;
    }
}

public static class CacheKeys
{
    public const string PropertiesList = "properties_list";
    public const string PropertyDetail = "property_detail";

    public static string GetPropertiesListKey(string filters) => $"{PropertiesList}:{filters}";
    public static string GetPropertyDetailKey(int id) => $"{PropertyDetail}:{id}";
}
