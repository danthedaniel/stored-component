import * as React from "react";

/**
 * Abstract class for components that have their state replicated elsewhere.
 */
export default abstract class StoredComponent<P, S> extends React.Component<P, S> {
  private _id: string;

  /**
   * @param props         The component's props.
   * @param default_state Starting this.state value.
   * @param id            Optional unique identifier. Defaults to the class name.
   */
  constructor(props, default_state: S, id?: string) {
    super(props);

    if (id)
      this._id = id;

    storage.registerDefault(this.getId(), default_state);
    this.state = storage.getState(this.getId());
  }

  private getId() {
    return this._id ? this._id : this.constructor.name;
  }

  componentDidUpdate() {
    storage.setState(this.getId(), this.state);
  }

  /**
   * Reset the component's state to its default value.
   */
  defaultState() {
    const newState: S = storage.resetState(this.getId());
    this.setState(newState);
  }
}

/**
 * Data store helper functions.
 */
export namespace storage {
  let defaults: {[name: string]: any} = {};
  let component_store: Storage = window.sessionStorage;

  /**
   * Set the storage interface.
   */
  export const setStore = (store: Storage) => { component_store = store; };

  const className = (val): string => Object.getPrototypeOf(val).constructor.name;

  /**
   * Remove any types that aren't JSON compatible.
   */
  const serializer = (key: string, val: any) => {
    if (typeof val === 'undefined')
      return;
    if (val === null)
      return val;

    const shouldSerialize = val => {
      const whitelist = ["Array", "Number", "Boolean", "Object", "Array", "String"];
      return whitelist.indexOf(className(val)) !== -1;
    };

    if (className(val) === "Array") {
      return (<any[]> val).filter(shouldSerialize);
    } else if (shouldSerialize(val)) {
      return val;
    }
  };

  /**
   * Get the state object for a view.
   *
   * @param component The name of the class for the component.
   */
  export const getState = <T>(component: string): T => {
    if (component_store.getItem(component)) {
      const from_store = JSON.parse(component_store.getItem(component));
      return Object.assign(defaults[component], from_store);
    } else {
      return resetState(component);
    }
  };

  /**
   * Reset the state object for a view to the default.
   *
   * @param component The name of the class for the component.
   */
  export const resetState = <T>(component: string) => {
    component_store.setItem(component, JSON.stringify(defaults[component], serializer));
    return defaults[component] as T;
  };

  /**
   * Set the state object for a view.
   *
   * @param component The name of the class for the component.
   * @param state     The value of the state.
   */
  export const setState = (component: string, state) => {
    component_store.setItem(component, JSON.stringify(state, serializer));
  }

  /**
   * Set the default value for a view.
   *
   * @param component The name of the class for the component.
   * @param def       Default value.
   */
  export const registerDefault = (component: string, def: any) => {
    defaults[component] = def;
  };
}
