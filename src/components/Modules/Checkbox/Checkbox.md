Checkbox component example:

To render Checkbox:

```jsx static
import { Checkbox } from '@/components';
```

Colors

```js
<div className="example">
    <Checkbox name='checkbox' content='checkbox default checked' checked value='checkbox' />
    <Checkbox name='checkbox' content='checkbox content' checked={false} value='checkbox' />
    <Checkbox name='checkbox' content='checkbox disabled' disabled value='checkbox' />
</div>
```