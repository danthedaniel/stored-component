"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
/**
 * Abstract class for components that have their state replicated elsewhere.
 */
var StoredComponent = /** @class */ (function (_super) {
    __extends(StoredComponent, _super);
    /**
     * @param props         The component's props.
     * @param default_state Starting this.state value.
     * @param id            Optional unique identifier. Defaults to the class name.
     */
    function StoredComponent(props, default_state, id) {
        var _this = _super.call(this, props) || this;
        if (id)
            _this._id = id;
        storage.registerDefault(_this.getId(), default_state);
        _this.state = storage.getState(_this.getId());
        return _this;
    }
    StoredComponent.prototype.getId = function () {
        return this._id ? this._id : this.constructor.name;
    };
    StoredComponent.prototype.componentDidUpdate = function () {
        storage.setState(this.getId(), this.state);
    };
    /**
     * Reset the component's state to its default value.
     */
    StoredComponent.prototype.defaultState = function () {
        var newState = storage.resetState(this.getId());
        this.setState(newState);
    };
    return StoredComponent;
}(React.Component));
exports.default = StoredComponent;
/**
 * Data store helper functions.
 */
var storage;
(function (storage) {
    var defaults = {};
    var component_store = window.sessionStorage;
    /**
     * Set the storage interface.
     */
    storage.setStore = function (store) { component_store = store; };
    var className = function (val) { return Object.getPrototypeOf(val).constructor.name; };
    /**
     * Remove any types that aren't JSON compatible.
     */
    var serializer = function (key, val) {
        if (typeof val === 'undefined')
            return;
        if (val === null)
            return val;
        var shouldSerialize = function (val) {
            var whitelist = ["Array", "Number", "Boolean", "Object", "Array", "String"];
            return whitelist.indexOf(className(val)) !== -1;
        };
        if (className(val) === "Array") {
            return val.filter(shouldSerialize);
        }
        else if (shouldSerialize(val)) {
            return val;
        }
    };
    /**
     * Get the state object for a view.
     *
     * @param component The name of the class for the component.
     */
    storage.getState = function (component) {
        if (component_store.getItem(component)) {
            var from_store = JSON.parse(component_store.getItem(component));
            return Object.assign(defaults[component], from_store);
        }
        else {
            return storage.resetState(component);
        }
    };
    /**
     * Reset the state object for a view to the default.
     *
     * @param component The name of the class for the component.
     */
    storage.resetState = function (component) {
        component_store.setItem(component, JSON.stringify(defaults[component], serializer));
        return defaults[component];
    };
    /**
     * Set the state object for a view.
     *
     * @param component The name of the class for the component.
     * @param state     The value of the state.
     */
    storage.setState = function (component, state) {
        component_store.setItem(component, JSON.stringify(state, serializer));
    };
    /**
     * Set the default value for a view.
     *
     * @param component The name of the class for the component.
     * @param def       Default value.
     */
    storage.registerDefault = function (component, def) {
        defaults[component] = def;
    };
})(storage = exports.storage || (exports.storage = {}));
