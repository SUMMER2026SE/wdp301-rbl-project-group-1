export class DomainException extends Error {
  readonly code: string;

  constructor(message: string, code: string) {
    super(message);
    this.name = 'DomainException';
    this.code = code;
  }
}

export class EntityNotFoundException extends DomainException {
  constructor(entityName: string, id: string | number) {
    super(
      `${entityName} with id '${String(id)}' not found`,
      'ENTITY_NOT_FOUND',
    );
    this.name = 'EntityNotFoundException';
  }
}

export class UnauthorizedException extends DomainException {
  constructor(message = 'Unauthorized') {
    super(message, 'UNAUTHORIZED');
    this.name = 'UnauthorizedException';
  }
}

export class ForbiddenException extends DomainException {
  constructor(message = 'Forbidden') {
    super(message, 'FORBIDDEN');
    this.name = 'ForbiddenException';
  }
}

export class ValidationException extends DomainException {
  readonly fields: Record<string, string>;

  constructor(message: string, fields: Record<string, string> = {}) {
    super(message, 'VALIDATION_ERROR');
    this.name = 'ValidationException';
    this.fields = fields;
  }
}

export class ConflictException extends DomainException {
  constructor(message: string) {
    super(message, 'CONFLICT');
    this.name = 'ConflictException';
  }
}
