const jsonResponse = (res, statusCode, status, message, data) => {
  return res.status(statusCode).json({
    status: {
      status: status,
      message: message,
    },
    data: data,
  });
};

module.exports = {
  jsonResponse,
};
