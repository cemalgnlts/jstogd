# JavaScript to GDScript

Compile JavaScript to GDScript for Godot.

## Demo

```html
<script src="jsToGd.js"></script>
<script>
    jsToGd.transpileString(`export default class extends Node2D {
        constructor() {
            
        }
    }`);
</script>
```