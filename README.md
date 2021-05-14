# pluggable-interactions

Easy to use pluggable interactions for DOM elements.

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