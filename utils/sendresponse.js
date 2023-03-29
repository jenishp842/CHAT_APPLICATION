exports.sendResponse = (res, status, data) => {
  res.status(status).json({ data });
};

exports.sendError = (res, status, data) => {
  res.status(status).json({ status: "error", msg: data });
};
