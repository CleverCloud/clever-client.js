import * as hanbi from 'hanbi';

// Thin wrapper around hanbi stubs

export function createStub(fn) {
  const stub = hanbi.stub(fn);
  if (fn != null) {
    stub.passThrough();
  }
  return stub;
}
