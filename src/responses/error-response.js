export default function errorResponse(message, errors) {
  return {
    status: "error",
    message: message,
    errors
  };
}
