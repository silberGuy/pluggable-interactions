'use strict';

import { Interaction } from './interaction';

const REMOVE_MODE_SYMBOL = Symbol.for('timeline-mode-remover')

/*
 * Mode is a pluggable set of interactions for an element
 */
export class Mode {
    constructor(
        public interactions: Interaction[]
    ) {}

    static removeInteractions(target: HTMLElement) {
        target[REMOVE_MODE_SYMBOL]?.();
        delete target[REMOVE_MODE_SYMBOL];
    }

    addInteractions(target: HTMLElement) {
        Mode.removeInteractions(target);
        const interactionsRemovers = this.interactions.map(function(interaction) {
            return interaction.apply(target);
        });
        target[REMOVE_MODE_SYMBOL] = function removeInteractions() {
            interactionsRemovers.forEach(
                removeInteraction => removeInteraction()
            );
        }
    }

    removeInteractions(target: HTMLElement) {
        Mode.removeInteractions(target);
    }
}
