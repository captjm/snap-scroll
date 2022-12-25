import "./scss/snap-scroll.scss";
import RandomColor from "./js/RandomColor";
import MouseWheel from "./js/MouseWheel";

class Section {
    _el;
    _parent;
    _index;

    constructor(el, index, parent) {
        this._el = el;
        this._index = index;
        this._parent = parent;
        parent._sectionsWrapper.appendChild(el);
    }

    update() {
        this._el.style.height = this._parent._height + 'px';

        this._el.style.backgroundColor = RandomColor.get();
        this._el.innerHTML = `<h2>Section #${this._index}</h2>`;
    }
}

class SnapScroll {
    _options = {
        speed: 1,
        loop: false,
    }
    _el;
    _sections = [];
    _height;
    _position = 0;
    _sectionsWrapper;
    _completed = true;

    constructor(selector, options) {
        Object.assign(this._options, options);
        this._el = document.querySelector(selector);
        if (this._el) {
            this._el.classList.add("ss-wrapper");
            this._sectionsWrapper = document.createElement('div');
            this._sectionsWrapper.classList.add("ss-sections-wrapper");
            this._el.appendChild(this._sectionsWrapper);
            this._sections = Array.from(this._el.querySelectorAll('.section')).map((el, index) => new Section(el, index, this));
            window.addEventListener("resize", () => this.update());
            window.addEventListener("keyup", (event) => {
                if (event.defaultPrevented) {
                    return;
                }

                switch (event.key) {
                    case "Down":
                    case "ArrowDown":
                        this.scroll('up');
                        break;
                    case "Up":
                    case "ArrowUp":
                        this.scroll('down');
                        break;
                    default:
                        return;
                }
                event.preventDefault();
            }, true);
            const mouseWheel = new MouseWheel();
            mouseWheel.addEventListener((delta) => {
                if(delta > 0) {
                    this.scroll('down');
                } else if (delta < 0) {
                    this.scroll('up');
                }
            });
            this.update();
        }
    }

    update() {
        this._height = window.innerHeight;
        this._sectionsWrapper.style.transition = this._options.speed + 's transform';
        this._sections.forEach((section) => section.update());
        this._maxPosition = this._height * this._sections.length;
    }

    scroll(dir) {
        if (this._completed) {
            this._completed = false;
            let d = 0;
            if (dir === 'up') {
                d = -this._height;
            } else if (dir === 'down') {
                d = this._height;
            }
            this._position += d;
            if (this._position > 0) {
                this._position = (this._options.loop) ? this._height - this._maxPosition : 0;
            } else if (this._position < this._height - this._maxPosition) {
                this._position = (this._options.loop) ? 0 : this._height - this._maxPosition;
            }
            const scroll = new Promise((resolve) => {
                this._sectionsWrapper.style.transform = `translateY(${this._position}px)`;
                setTimeout(() => resolve(), this._options.speed * 1000);
            });
            scroll.then(() => this._completed = true);
        }
    }
}

window.SnapScroll = SnapScroll;