export abstract class DomainError extends Error {
  abstract readonly code: string;
  abstract readonly statusCode: number;
  
  constructor(message: string) {
    super(message);
    this.name = this.constructor.name;
  }
}

export class ValidationError extends DomainError {
  readonly code = 'VALIDATION_ERROR';
  readonly statusCode = 400;
  
  constructor(message: string, public readonly field?: string) {
    super(message);
  }
}

export class NotFoundError extends DomainError {
  readonly code = 'NOT_FOUND';
  readonly statusCode = 404;
  
  constructor(resource: string, id?: string | number) {
    super(id ? `${resource} with ID ${id} not found` : `${resource} not found`);
  }
}

export class NetworkError extends DomainError {
  readonly code = 'NETWORK_ERROR';
  readonly statusCode = 0;
  
  constructor(message: string = 'Network connection failed') {
    super(message);
  }
}

export class ServerError extends DomainError {
  readonly code = 'SERVER_ERROR';
  readonly statusCode: number;
  
  constructor(message: string, statusCode: number = 500) {
    super(message);
    this.statusCode = statusCode;
  }
}

export class TimeoutError extends DomainError {
  readonly code = 'TIMEOUT_ERROR';
  readonly statusCode = 408;
  
  constructor(message: string = 'Request timeout') {
    super(message);
  }
}

export class BusinessRuleError extends DomainError {
  readonly code = 'BUSINESS_RULE_ERROR';
  readonly statusCode = 422;
  
  constructor(message: string) {
    super(message);
  }
}