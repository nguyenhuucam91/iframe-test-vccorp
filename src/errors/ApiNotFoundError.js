class ApiNotFoundError extends Error { 
  constructor(message) { 
    super(message);
    this.name = "API not found error";
  }
}

export default ApiNotFoundError