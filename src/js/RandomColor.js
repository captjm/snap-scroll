export default class RandomColor {
    static _names = ["black", "silver", "gray", "white", "maroon", "red", "purple", "fuchsia", "green", "lime", "olive", "yellow", "navy", "blue", "teal", "aqua"];

    static get() {
        return this._names[Math.ceil(Math.random() * this._names.length)];
    }
}