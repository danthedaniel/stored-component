import { Component } from "preact";
/**
 * Abstract class for components that have their state replicated elsewhere.
 */
export default abstract class StoredComponent<P, S> extends Component<P, S> {
    private _id;
    /**
     * @param props         The component's props.
     * @param default_state Starting this.state value.
     * @param id            Optional unique identifier. Defaults to the class name.
     */
    constructor(props: any, default_state: S, id?: string);
    private getId();
    componentDidUpdate(): void;
    /**
     * Reset the component's state to its default value.
     */
    defaultState(): void;
}
/**
 * Data store helper functions.
 */
export declare namespace storage {
    /**
     * Set the storage interface.
     */
    const setStore: (store: Storage) => void;
    /**
     * Get the state object for a view.
     *
     * @param component The name of the class for the component.
     */
    const getState: <T>(component: string) => T;
    /**
     * Reset the state object for a view to the default.
     *
     * @param component The name of the class for the component.
     */
    const resetState: <T>(component: string) => T;
    /**
     * Set the state object for a view.
     *
     * @param component The name of the class for the component.
     * @param state     The value of the state.
     */
    const setState: (component: string, state: any) => void;
    /**
     * Set the default value for a view.
     *
     * @param component The name of the class for the component.
     * @param def       Default value.
     */
    const registerDefault: (component: string, def: any) => void;
}
