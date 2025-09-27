using System.Net;
using System.Text.Json;
using MillionTestApi.Domain.Exceptions;

namespace MillionTestApi.Infrastructure.Middleware;

public class GlobalExceptionMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<GlobalExceptionMiddleware> _logger;

    public GlobalExceptionMiddleware(RequestDelegate next, ILogger<GlobalExceptionMiddleware> logger)
    {
        _next = next;
        _logger = logger;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            await _next(context);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "An unhandled exception occurred: {Message}", ex.Message);
            await HandleExceptionAsync(context, ex);
        }
    }

    private static async Task HandleExceptionAsync(HttpContext context, Exception exception)
    {
        context.Response.ContentType = "application/json";

        var errorResponse = exception switch
        {
            DomainException domainEx => new ErrorResponse
            {
                Code = domainEx.Code,
                Message = domainEx.Message,
                StatusCode = domainEx.StatusCode
            },
            ArgumentException => new ErrorResponse
            {
                Code = "INVALID_ARGUMENT",
                Message = exception.Message,
                StatusCode = (int)HttpStatusCode.BadRequest
            },
            _ => new ErrorResponse
            {
                Code = "INTERNAL_ERROR",
                Message = "An internal server error occurred.",
                StatusCode = (int)HttpStatusCode.InternalServerError
            }
        };

        context.Response.StatusCode = errorResponse.StatusCode;

        var jsonResponse = JsonSerializer.Serialize(errorResponse, new JsonSerializerOptions
        {
            PropertyNamingPolicy = JsonNamingPolicy.CamelCase
        });

        await context.Response.WriteAsync(jsonResponse);
    }

    private class ErrorResponse
    {
        public string Code { get; set; } = string.Empty;
        public string Message { get; set; } = string.Empty;
        public int StatusCode { get; set; }
    }
}
