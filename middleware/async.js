// handling and logging error(removing try catch error)
module.exports = function asyncMiddleware(handler) {
    return async (req, res, next) => {
      try {
        await handler(req, res)
      }
      catch (ex) {
      next(ex)
      }
    }
  }