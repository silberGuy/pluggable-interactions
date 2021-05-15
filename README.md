# pluggable-interactions

Easy to use pluggable interactions for DOM elements.

## Usage

```js
    import pluggable from 'pluggable-interactions'; 
    // Or
    import pluggable from 'pluggable-interactions/dist/index.js';
```

## Interaction
Create `Interactions` containing event listeners and styling
```js
import pluggable from 'pluggable-interactions';

// Create an Interaction
const LoggerInteraction = new pluggable.Interaction(
    ({ addTargetListener }) => {
        addTargetListener('click', clickEvent => {
            console.log(`${clickEvent.target.name} was clicked`);
        });

        addTargetListener('mousemove', moveEvent => {
            console.log(`${moveEvent.target.name} was hovered`);
        });
    }
);

// Apply the logger on an element 
const navbar = document.getElementById('navbar');
const removeLog = LoggerInteraction.apply(navbar);

// Easily remove the event listeners
removeLog();
```

## Mode

Create `Modes` including multiple interactions. Easily switch between modes.

```js
import pluggable from 'pluggable-interactions';

// Create mouse and touch interactions for a canvas element
const ZoomInteraction = new pluggable.Interaction(() => { /* Zoom Logic */ });
const DragInteraction = new pluggable.Interaction(() => { /* Drag Logic */ });
const ToolTipInteraction = new pluggable.Interaction(() => { /* Tool tip Logic */ });

const EditMode = new pluggable.Mode([
    ZoomInteraction,
    DragInteraction,
]);
const ViewMode = new pluggable.Mode([
    ZoomInteraction,
    ToolTipInteraction,
]);

const canvas = document.getElementById('canvas');

// Apply Edit Mode
EditMode.addInteractions(canvas);

// Easily switch to View Mode
const btn = document.getElementById('view-mode-btn');
btn.addEventListener('click', () => {
    ViewMode.addInteractions(canvas);
});
```

`Interactions` supports varied pluggable actions:
```js

new Interaction(
    ({
        target, 
        addCleanup, // General cleanup function
        addInteraction, // Use another interaction
        addListener, // Listen to events
        addTargetListener, // Listen to an event on the target
        addDocumentListener, // Listen to an event on the document
        setTargetStyle, // Set styling
        addInterval, // Set interval to run as long as the interaction is apllied
    }) => {
        // Write your logic in one function without caring for cleanups
    }
)
```

## Examples

Drag Item Interaction
```js
    const DragInteraction = new pluggable.Interaction(
        ({
            addTargetListener, addDocumentListener, setTargetStyle,
        }) => {
            setTargetStyle('cursor', 'pointer');

            let isMouseDown = false;
            addTargetListener('mousedown', downEvent => {
                isMouseDown = true;
            });

            addTargetListener('mousemove', moveEvent => {
                if (!isMouseDown) return;
                moveEvent.preventDefault();

                target.style.left = moveEvent.clientX;
                target.style.top = moveEvent.clientY;
            });

            addDocumentListener('mouseup', () => {
                isMouseDown = false;
            });
        }
    )

    const item = document.getElementById('item');
    item.style.position = 'fixed';
    DragInteraction.apply(item);
```

Svg Cursor Interaction
```js
    function createCursorURI(cursorSvg: string) {
        return `data:image/svg+xml;base64,${btoa(cursorSvg)}`;
    }

    export class SvgCursorInteraction extends TimelineInteraction {
        constructor(cursorSvg: string) {
            super(
                ({ setTimelineStyle }) => {
                    setTimelineStyle('cursor', `url(${createCursorURI(cursorSvg)}) 0 0,auto`);
                }
            );
        }
    }

    const rectCursorSvg = `
        <svg viewBox="0 0 24 24">
            <rect width="24" height="24" style="fill:black;"></rect>
        </svg>
    `;
    const rectCursor = new SvgCursorInteraction(cursorSvg);
```
