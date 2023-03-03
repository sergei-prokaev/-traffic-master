import {TrafficMeisterApi, ITrafficService} from '../';

describe(`${TrafficMeisterApi.name}`, () => {
  let trafficApi: ITrafficService;
  let spyOnMathRandom: unknown;

  beforeEach(() => {
    jest.useFakeTimers();
    trafficApi = new TrafficMeisterApi();
    spyOnMathRandom = jest.spyOn(global.Math, 'random').mockReturnValue(0.1);
  });
  afterEach(() => {
    jest.spyOn(global.Math, 'random').mockRestore();
    jest.useRealTimers();
    jest.clearAllMocks();
  });
  it('.fetchData should be defined', () => {
    expect(typeof trafficApi.fetchData).toBe('function');
  });
  it('should call the callback after 1 second with success result', () => {
    const callback = jest.fn();
    trafficApi.fetchData(callback);

    expect(callback).not.toBeCalled();
    jest.runAllTimers();

    expect(callback).toBeCalled();
    expect(callback).toHaveBeenCalledTimes(1);
  });
  it('should call the callback after 1 second with error result', () => {
    const callback = jest.fn((err) => err);
    trafficApi.fetchData(callback);
    expect(callback).not.toBeCalled();
    jest.runAllTimers();
    expect(spyOnMathRandom).toReturnWith(0.1);
    expect(callback.mock.calls[0][0]).toBe('Fetch data error');
  });
});
