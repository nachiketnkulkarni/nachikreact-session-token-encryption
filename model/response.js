class Response {
  constructor(error, message) {
    (this.error = error), (this.message = message);
  }
}

module.exports = Response;
