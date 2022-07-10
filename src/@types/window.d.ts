type Brand = {
  readonly brand: string;
  readonly version: string;
};

type NavigatorUAData = {
  getHighEntropyValues(arg0: string[]): any;
  readonly brands: Brand[];
  readonly mobile: boolean;
  readonly platform: string;
};

interface Navigator {
  userAgentData: NavigatorUAData;
}
