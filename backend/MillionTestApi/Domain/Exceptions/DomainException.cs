namespace MillionTestApi.Domain.Exceptions;

public abstract class DomainException : Exception
{
    public abstract string Code { get; }
    public abstract int StatusCode { get; }

    protected DomainException(string message) : base(message) { }
    protected DomainException(string message, Exception innerException) : base(message, innerException) { }
}

public class PropertyNotFoundException : DomainException
{
    public override string Code => "PROPERTY_NOT_FOUND";
    public override int StatusCode => 404;

    public PropertyNotFoundException(int propertyId)
        : base($"Property with ID {propertyId} was not found.") { }
}

public class ValidationException : DomainException
{
    public override string Code => "VALIDATION_ERROR";
    public override int StatusCode => 400;

    public ValidationException(string message) : base(message) { }
}

public class BusinessRuleException : DomainException
{
    public override string Code => "BUSINESS_RULE_VIOLATION";
    public override int StatusCode => 422;

    public BusinessRuleException(string message) : base(message) { }
}

public class DatabaseException : DomainException
{
    public override string Code => "DATABASE_ERROR";
    public override int StatusCode => 500;

    public DatabaseException(string message) : base(message) { }
    public DatabaseException(string message, Exception innerException) : base(message, innerException) { }
}
