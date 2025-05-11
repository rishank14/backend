class ApiResponse {
  constructor(statusCode, message= "Success", data) {
    this.status = statusCode;
    this.message = message;
    this.data = data;
    this.success = statusCode < 400;
  }

  static success(data) {
    return new ApiResponse(200, 'Success', data);
  }

  static error(message) {
    return new ApiResponse(500, message, null);
  }
}