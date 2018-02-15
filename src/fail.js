class HandlebarsPluginError extends Error {
  constructor (caller, error) {
    const message = error instanceof Error ? error.message : error ? error.toString() : error
    super(message)

    this.name = 'HandlebarsPluginError'
    this.message = message

    Error.captureStackTrace(this, caller)
  }
}

const fail = (caller, error) => new HandlebarsPluginError(caller, error)

module.exports = fail
