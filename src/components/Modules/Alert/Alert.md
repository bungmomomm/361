Alert component example:

To render Alert:

```jsx static
import { Alert } from '@/components';
```

Example

```js
<div className="example">
    <Alert size='medium' >Alert</Alert> 
    <Alert size='medium' icon='exclamation-triangle' align='left' color="red">red</Alert> 
    <Alert size='medium' icon='exclamation-triangle' align='center' color="yellow">yellow</Alert> 
    <Alert size='medium' icon='exclamation-triangle' align='right' close color="green">green</Alert> 
    <Alert size='medium' icon='exclamation-triangle' close color="dark">dark</Alert> 
    <Alert size='medium' icon='exclamation-triangle' close color="grey">grey</Alert> 
</div>
```