Stepper component example:

To render Button:

```jsx static
import { Stepper } from '@/components';
```

```js
<div className="example">
    <InputGroup>
        <Stepper />
    </InputGroup>
    <InputGroup>
        <label>with default = 2 value and max value = 5</label>
        <Stepper value={2} maxValue={5} />
    </InputGroup>
</div>
```