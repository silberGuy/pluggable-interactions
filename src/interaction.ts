'use strict';

const REMOVERS_SYMBOL = Symbol.for('pluggable-interactions-removers');
type hasInteraction = {
    [REMOVERS_SYMBOL]?: Map<Interaction, Function>
}

type ListenerOptions = {
    capture?: boolean,
    once?: boolean,
    passive?: boolean,
    signal?: AbortSignal,
    useCapture?: boolean,
}

type InteractionApplyFunc = (arg: {
    target?: HTMLElement,
    addCleanup?: (cleanFunc: () => void) => void,
    addInteraction?: (i: Interaction) => void,
    addListener?: (target: HTMLElement, eventType: string, handler: EventListener, opts?: ListenerOptions) => void,
    addTargetListener?: (eventType: string, handler: EventListener, opts?: ListenerOptions) => void,
    addDocumentListener?: (eventType: string, handler: EventListener, opts?: ListenerOptions) => void,
    setTargetStyle?: (prop: string, value: string) => void,
    addInterval?: (...args: Parameters<typeof setInterval>) => void
}) => void

/*
 * Interaction a pluggable function that assigns event listeners and styles
 */
export class Interaction {
    applyFunc: InteractionApplyFunc

    constructor(applyFunc: InteractionApplyFunc) {
        this.applyFunc = applyFunc;
    }

    apply(target: HTMLElement & hasInteraction) {
        const cleanupFuncs: Function[] = [];

        function addCleanup(fn: () => void) {
            cleanupFuncs.push(fn);
        }

        function addInteraction(interaction: Interaction) {
            cleanupFuncs.push(interaction.apply(target));
        }

        function addListener(target: EventTarget, eventType: string, handler: EventListener, opts?: ListenerOptions) {
            target.addEventListener(eventType, handler, opts);
            addCleanup(function removeListener() {
                target.removeEventListener(eventType, handler);
            });
        }

        function setTargetStyle(prop: string, value: string) {
            const oldVal = target.style.getPropertyValue(prop);
            target.style.setProperty(prop, value);
            target.style.setProperty('border', 'red');
            addCleanup(() => {
                target.style.setProperty(prop, oldVal);
                target.style.setProperty('border', 'none');
            });
        }

        const addTargetListener = function(eventType: string, handler: EventListener, opts?: ListenerOptions) {
            return addListener(target, eventType, handler, opts);
        }
        const addDocumentListener = function(eventType: string, handler: EventListener, opts?: ListenerOptions) {
            return addListener(document, eventType, handler, opts);
        }

        const addInterval = function(...args: Parameters<typeof setInterval>) {
            const interval = setInterval(...args);
            addCleanup(() => {
                clearInterval(interval);
            });
        }
        this.applyFunc({
            target: target,
            addCleanup,
            addInteraction,
            addListener,
            addTargetListener,
            addDocumentListener,
            setTargetStyle,
            addInterval,
        });

        function removeListeners() {
            cleanupFuncs.forEach(removeListener => removeListener());
        }
        
        target[REMOVERS_SYMBOL] = target[REMOVERS_SYMBOL] || new Map();
        target[REMOVERS_SYMBOL].set(this, removeListeners);
        return removeListeners;
    }
}
