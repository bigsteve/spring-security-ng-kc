import { ParametersString } from './parameters.string.model';

describe('ParametersString', () => {
  it('should create an instance', () => {
    expect(new ParametersString('page', 'section')).toBeTruthy();
  });
});
