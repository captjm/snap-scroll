export default class MouseWheel {
    _handler;
    addEventListener (handler) {
        this._handler = handler;
        if (window.addEventListener)
        {
            // IE9+, Chrome, Safari, Opera
            window.addEventListener("mousewheel", (e) => this._eventHandler(e), false);
            // Firefox
            window.addEventListener("DOMMouseScroll", (e) => this._eventHandler(e), false);
        }
        else
        {
            // IE 6/7/8
            window.attachEvent("onmousewheel", (e) => this._eventHandler(e));
        }
    }

    _eventHandler(event) {
        let e  = window.event || event;
        let delta = e.wheelDelta || -e.detail;
        this._handler(delta);
    }
}