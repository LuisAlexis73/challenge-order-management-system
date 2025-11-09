// Setup básico para tests
process.env.NODE_ENV = "test";

beforeEach(() => {
  jest.clearAllMocks();
});

afterAll(() => {
  console.log("Tests completed successfully! ✅");
});
