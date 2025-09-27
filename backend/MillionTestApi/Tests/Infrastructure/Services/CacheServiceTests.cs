using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Logging;
using Moq;
using NUnit.Framework;
using MillionTestApi.Infrastructure.Services;

namespace MillionTestApi.Tests.Infrastructure.Services;

[TestFixture]
public class CacheServiceTests
{
    private Mock<IMemoryCache> _mockMemoryCache = null!;
    private Mock<ILogger<MemoryCacheService>> _mockLogger = null!;
    private MemoryCacheService _cacheService = null!;
    private readonly Dictionary<object, object> _cacheStore = new();

    [SetUp]
    public void Setup()
    {
        _mockMemoryCache = new Mock<IMemoryCache>();
        _mockLogger = new Mock<ILogger<MemoryCacheService>>();
        _cacheService = new MemoryCacheService(_mockMemoryCache.Object, _mockLogger.Object);

        // Setup memory cache mock to use a dictionary for storage
        _mockMemoryCache
            .Setup(x => x.TryGetValue(It.IsAny<object>(), out It.Ref<object>.IsAny))
            .Returns((object key, out object value) =>
            {
                return _cacheStore.TryGetValue(key, out value!);
            });

        _mockMemoryCache
            .Setup(x => x.Set(It.IsAny<object>(), It.IsAny<object>(), It.IsAny<MemoryCacheEntryOptions>()))
            .Returns((object key, object value, MemoryCacheEntryOptions options) =>
            {
                _cacheStore[key] = value;
                return Mock.Of<ICacheEntry>();
            });

        _mockMemoryCache
            .Setup(x => x.Remove(It.IsAny<object>()))
            .Callback((object key) => _cacheStore.Remove(key));
    }

    [TearDown]
    public void TearDown()
    {
        _cacheStore.Clear();
    }

    [Test]
    public async Task GetAsync_ShouldReturnValue_WhenKeyExists()
    {
        // Arrange
        var key = "test-key";
        var expectedValue = new TestObject { Id = 1, Name = "Test" };
        _cacheStore[key] = expectedValue;

        // Act
        var result = await _cacheService.GetAsync<TestObject>(key);

        // Assert
        Assert.That(result, Is.Not.Null);
        Assert.That(result.Id, Is.EqualTo(expectedValue.Id));
        Assert.That(result.Name, Is.EqualTo(expectedValue.Name));
    }

    [Test]
    public async Task GetAsync_ShouldReturnNull_WhenKeyDoesNotExist()
    {
        // Arrange
        var key = "non-existent-key";

        // Act
        var result = await _cacheService.GetAsync<TestObject>(key);

        // Assert
        Assert.That(result, Is.Null);
    }

    [Test]
    public async Task GetAsync_ShouldReturnNull_WhenValueIsWrongType()
    {
        // Arrange
        var key = "test-key";
        _cacheStore[key] = "wrong-type-value";

        // Act
        var result = await _cacheService.GetAsync<TestObject>(key);

        // Assert
        Assert.That(result, Is.Null);
    }

    [Test]
    public async Task SetAsync_ShouldStoreValue_WithDefaultExpiry()
    {
        // Arrange
        var key = "test-key";
        var value = new TestObject { Id = 1, Name = "Test" };

        // Act
        await _cacheService.SetAsync(key, value);

        // Assert
        _mockMemoryCache.Verify(x => x.Set(
            key, 
            value, 
            It.Is<MemoryCacheEntryOptions>(o => 
                o.AbsoluteExpirationRelativeToNow == TimeSpan.FromMinutes(15) &&
                o.SlidingExpiration == TimeSpan.FromMinutes(5))), 
            Times.Once);
    }

    [Test]
    public async Task SetAsync_ShouldStoreValue_WithCustomExpiry()
    {
        // Arrange
        var key = "test-key";
        var value = new TestObject { Id = 1, Name = "Test" };
        var customExpiry = TimeSpan.FromMinutes(30);

        // Act
        await _cacheService.SetAsync(key, value, customExpiry);

        // Assert
        _mockMemoryCache.Verify(x => x.Set(
            key, 
            value, 
            It.Is<MemoryCacheEntryOptions>(o => 
                o.AbsoluteExpirationRelativeToNow == customExpiry)), 
            Times.Once);
    }

    [Test]
    public async Task RemoveAsync_ShouldRemoveKey()
    {
        // Arrange
        var key = "test-key";
        var value = new TestObject { Id = 1, Name = "Test" };
        _cacheStore[key] = value;

        // Act
        await _cacheService.RemoveAsync(key);

        // Assert
        _mockMemoryCache.Verify(x => x.Remove(key), Times.Once);
    }

    [Test]
    public async Task RemovePatternAsync_ShouldRemoveMatchingKeys()
    {
        // Arrange
        var pattern = "test";
        _cacheStore["test-key-1"] = new TestObject { Id = 1, Name = "Test1" };
        _cacheStore["test-key-2"] = new TestObject { Id = 2, Name = "Test2" };
        _cacheStore["other-key"] = new TestObject { Id = 3, Name = "Other" };

        // Setup the cache service to track keys
        var cacheService = new MemoryCacheService(_mockMemoryCache.Object, _mockLogger.Object);
        
        // Simulate adding keys to the internal tracking
        await cacheService.SetAsync("test-key-1", new TestObject { Id = 1, Name = "Test1" });
        await cacheService.SetAsync("test-key-2", new TestObject { Id = 2, Name = "Test2" });
        await cacheService.SetAsync("other-key", new TestObject { Id = 3, Name = "Other" });

        // Act
        await cacheService.RemovePatternAsync(pattern);

        // Assert
        _mockMemoryCache.Verify(x => x.Remove("test-key-1"), Times.AtLeastOnce);
        _mockMemoryCache.Verify(x => x.Remove("test-key-2"), Times.AtLeastOnce);
        _mockMemoryCache.Verify(x => x.Remove("other-key"), Times.Never);
    }

    [Test]
    public async Task GetAsync_ShouldHandleException_AndReturnNull()
    {
        // Arrange
        var key = "test-key";
        _mockMemoryCache
            .Setup(x => x.TryGetValue(It.IsAny<object>(), out It.Ref<object>.IsAny))
            .Throws(new Exception("Cache error"));

        // Act
        var result = await _cacheService.GetAsync<TestObject>(key);

        // Assert
        Assert.That(result, Is.Null);
        // Verify error was logged
        _mockLogger.Verify(
            x => x.Log(
                LogLevel.Error,
                It.IsAny<EventId>(),
                It.IsAny<It.IsAnyType>(),
                It.IsAny<Exception>(),
                It.IsAny<Func<It.IsAnyType, Exception?, string>>()),
            Times.Once);
    }

    [Test]
    public async Task SetAsync_ShouldHandleException_AndNotThrow()
    {
        // Arrange
        var key = "test-key";
        var value = new TestObject { Id = 1, Name = "Test" };
        _mockMemoryCache
            .Setup(x => x.Set(It.IsAny<object>(), It.IsAny<object>(), It.IsAny<MemoryCacheEntryOptions>()))
            .Throws(new Exception("Cache error"));

        // Act & Assert
        Assert.DoesNotThrowAsync(async () => await _cacheService.SetAsync(key, value));
        
        // Verify error was logged
        _mockLogger.Verify(
            x => x.Log(
                LogLevel.Error,
                It.IsAny<EventId>(),
                It.IsAny<It.IsAnyType>(),
                It.IsAny<Exception>(),
                It.IsAny<Func<It.IsAnyType, Exception?, string>>()),
            Times.Once);
    }

    private class TestObject
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
    }
}