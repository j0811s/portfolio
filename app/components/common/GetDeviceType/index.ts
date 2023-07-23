type deviceList = {
  [key: string]: boolean
}

const UA = window.navigator.userAgent.toLowerCase();

export class GetDeviceType {
  deviceList: deviceList;

  constructor() {
    this.deviceList = {
      sp: false,
      tab: false,
      touch: false,
      pc: false,
      windows: false,
      ie: false,
      mac: false,
      ios: false,
      iphone: false,
      ipad: false,
      android: false
    }
  }

  get is() {
    return this._judgement();
  }

  _judgement() {
    Object.keys(this.deviceList).forEach((key) => {
      const methodName = `_${key}`;
      this.deviceList[key] = (this as any)[methodName]();
    });

    return this.deviceList;
  }

  _windows() {
    return UA.indexOf('windows nt') !== -1;
  }

  _ie() {
    // @ts-ignore
    return !!document.documentMode;
  }

  _mac() {
    return UA.indexOf('mac os x') !== -1 && !this._iphone() && !this._ipad();
  }

  _iphone() {
    return UA.indexOf('iphone') > 0;
  }

  _ipad() {
    return UA.indexOf('ipad') > -1 || (UA.indexOf('macintosh') > -1 && 'ontouchend' in document);
  }

  _ios() {
    return this._iphone() || this._ipad();
  }

  _android() {
    return UA.indexOf('android') > 0;
  }

  _touch() {
    return 'ontouchend' in document;
  }

  _sp() {
    return UA.indexOf('iphone') > 0 || (UA.indexOf('android') > 0 && UA.indexOf('mobile') > 0);
  }

  _tab() {
    return this._ipad() || (UA.indexOf('android') > 0 && UA.indexOf('mobile') === -1);
  }

  _pc() {
    return !this._sp() && !this._tab();
  }
}