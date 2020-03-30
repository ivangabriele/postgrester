global.console = {
  debug: console.debug,
  error: jest.fn(),
  info: jest.fn(),
  log: console.log,
  warn: jest.fn(),
};
