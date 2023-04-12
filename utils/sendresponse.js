exports.sendResponse = (res, status, data) => {
  res.status(status).json({ data,status });
};

exports.sendError = (res, status, data) => {
  res.status(status).json({ status: "error", msg: data });
};
