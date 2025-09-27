import { 
  DomainError, 
  ValidationError, 
  NotFoundError, 
  NetworkError, 
  ServerError, 
  TimeoutError 
} from '../../domain/errors/DomainErrors';

export interface ErrorDetails {
  message: string;
  code: string;
  statusCode: number;
  userFriendlyMessage: string;
  shouldRetry: boolean;
  shouldNotify: boolean;
}

export class ErrorHandler {
  static handle(error: unknown): ErrorDetails {
    if (error instanceof DomainError) {
      return this.handleDomainError(error);
    }

    if (error instanceof Error) {
      return this.handleGenericError(error);
    }

    return this.handleUnknownError(error);
  }

  private static handleDomainError(error: DomainError): ErrorDetails {
    switch (error.constructor) {
      case ValidationError:
        return {
          message: error.message,
          code: error.code,
          statusCode: error.statusCode,
          userFriendlyMessage: 'Please check your input and try again.',
          shouldRetry: false,
          shouldNotify: false,
        };

      case NotFoundError:
        return {
          message: error.message,
          code: error.code,
          statusCode: error.statusCode,
          userFriendlyMessage: 'The requested item could not be found.',
          shouldRetry: false,
          shouldNotify: false,
        };

      case NetworkError:
        return {
          message: error.message,
          code: error.code,
          statusCode: error.statusCode,
          userFriendlyMessage: 'Network connection failed. Please check your internet connection.',
          shouldRetry: true,
          shouldNotify: true,
        };

      case TimeoutError:
        return {
          message: error.message,
          code: error.code,
          statusCode: error.statusCode,
          userFriendlyMessage: 'Request timed out. Please try again.',
          shouldRetry: true,
          shouldNotify: false,
        };

      case ServerError:
        return {
          message: error.message,
          code: error.code,
          statusCode: error.statusCode,
          userFriendlyMessage: 'A server error occurred. Please try again later.',
          shouldRetry: error.statusCode >= 500 && error.statusCode < 600,
          shouldNotify: true,
        };

      default:
        return {
          message: error.message,
          code: error.code,
          statusCode: error.statusCode,
          userFriendlyMessage: error.message,
          shouldRetry: false,
          shouldNotify: false,
        };
    }
  }

  private static handleGenericError(error: Error): ErrorDetails {
    // Handle fetch API errors
    if (error.name === 'AbortError') {
      return {
        message: 'Request was cancelled',
        code: 'REQUEST_CANCELLED',
        statusCode: 0,
        userFriendlyMessage: 'Request was cancelled.',
        shouldRetry: false,
        shouldNotify: false,
      };
    }

    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      return {
        message: 'Network error occurred',
        code: 'NETWORK_ERROR',
        statusCode: 0,
        userFriendlyMessage: 'Network connection failed. Please check your internet connection.',
        shouldRetry: true,
        shouldNotify: true,
      };
    }

    return {
      message: error.message,
      code: 'GENERIC_ERROR',
      statusCode: 500,
      userFriendlyMessage: 'An unexpected error occurred. Please try again.',
      shouldRetry: false,
      shouldNotify: true,
    };
  }

  private static handleUnknownError(error: unknown): ErrorDetails {
    const message = typeof error === 'string' ? error : 'An unknown error occurred';
    
    return {
      message,
      code: 'UNKNOWN_ERROR',
      statusCode: 500,
      userFriendlyMessage: 'An unexpected error occurred. Please try again.',
      shouldRetry: false,
      shouldNotify: true,
    };
  }

  static isRetryableError(error: unknown): boolean {
    const details = this.handle(error);
    return details.shouldRetry;
  }

  static shouldNotifyUser(error: unknown): boolean {
    const details = this.handle(error);
    return details.shouldNotify;
  }

  static getUserMessage(error: unknown): string {
    const details = this.handle(error);
    return details.userFriendlyMessage;
  }
}