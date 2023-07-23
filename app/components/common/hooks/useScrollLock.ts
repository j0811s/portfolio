
import { GetDeviceType } from "../GetDeviceType";

export default class useScrollLock {
  // 対象
  target: HTMLElement;
  // デバイス判定
  iOS: boolean;
  PC: boolean;
  // タッチポイント
  private toucheStartY: number;
  private toucheCurrentY: number;
  // ステータス
  isLock: boolean;
  // ウィンドウ幅
  widthScrollBars: number;

  constructor(target?: HTMLElement) {
    this.target = target == null ? document.documentElement : target;

    const device = new GetDeviceType();
    this.iOS = device.is.ios;
    this.PC = device.is.pc;
    this.toucheStartY = 0;
    this.toucheCurrentY = 0;
    this._iOSLock = this._iOSLock.bind(this);

    this.isLock = false;

    this.widthScrollBars = this._getWidthScrollBars();
    this._setWidthExcludingScrollBars = this._setWidthExcludingScrollBars.bind(this);
  }

  get status(): boolean {
    return this.isLock;
  }

  private _getWidthScrollBars(): number {
    return window.innerWidth - document.documentElement.clientWidth;
  }

  private _setWidthExcludingScrollBars(): void {
    const width = window.innerWidth - this.widthScrollBars;

    document.documentElement.style.width = `${width}px`;
    this.target.style.width = `${width}px`;
  }

  private _addResize(): void {
    window.addEventListener('resize', this._setWidthExcludingScrollBars);
  }

  private _removeResize(): void {
    window.removeEventListener('resize', this._setWidthExcludingScrollBars);
  }

  private _iOSLock(e: TouchEvent): void {
    this.toucheCurrentY = e.changedTouches[0].pageY;
    const height = this.target.offsetHeight;
    const currentScrollTop = this.toucheStartY <= this.toucheCurrentY && this.target.scrollTop === 0;
    const currentScrollBottom =
      this.toucheStartY >= this.toucheCurrentY && this.target.scrollHeight - this.target.scrollTop === height;

    if (currentScrollTop || currentScrollBottom) e.preventDefault();
  }

  private _setTouchCancel(): void {
    document.addEventListener('touchstart', (e) => {
      this.toucheStartY = e.changedTouches[0].pageY;
    });

    const options: AddEventListenerOptions & EventListenerOptions = { passive: false };
    document.addEventListener('touchmove', this._iOSLock, options);
  }

  private _unsetTouchCancel(): void {
    const options: AddEventListenerOptions & EventListenerOptions = { passive: false };
    document.removeEventListener('touchmove', this._iOSLock, options);
  }

  private _setOverflowHidden(): void {
    if (this.PC) {
      this._setWidthExcludingScrollBars();
    }
    document.documentElement.style.overflow = 'hidden';
  }

  private _unsetOverflowHidden(): void {
    if (this.PC) {
      document.documentElement.style.width = '';
      this.target.style.width = '';
    }
    document.documentElement.style.overflow = '';
  }

  public enabled(): void {
    if (this.status) return;
    this.iOS ? this._setTouchCancel() : this._setOverflowHidden();
    if (this.PC) {
      this._addResize();
    }
    this.isLock = true;
  }

  public disabled(): void {
    if (!this.status) return;
    this.iOS ? this._unsetTouchCancel() : this._unsetOverflowHidden();
    if (this.PC) {
      this._removeResize();
    }
    this.isLock = false;
  }
}