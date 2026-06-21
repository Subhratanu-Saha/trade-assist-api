export class ApiResponse {
  constructor(success, message, data = undefined) {
    this.success = success;
    this.message = message;
    this.data = data;
    this.timestamp = new Date().toISOString();
  }
}

export class SuccessResponse {
  constructor(message, data = undefined) {
    this.success = true;
    this.message = message;
    this.data = data;
    this.timestamp = new Date().toISOString();
  }
}

export class ErrorResponse {
  constructor(message, error = undefined) {
    this.success = false;
    this.message = message;
    this.error = error;
    this.timestamp = new Date().toISOString();
  }
}

export class PaginatedSuccessResponse {
  constructor(message, data, pagination) {
    this.success = true;
    this.message = message;
    this.data = data;
    this.pagination = pagination;
    this.timestamp = new Date().toISOString();
  }
}
