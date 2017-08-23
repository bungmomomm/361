Button component example_button:

To render Button:

```jsx static
import { Button } from '@/components';
```

Colors

```js
<div className="example_button">
    <Button size='medium' >Button</Button> 
    <Button size='medium' color="red">red</Button> 
    <Button size='medium' color="yellow">yellow</Button> 
    <Button size='medium' color="green">green</Button> 
    <Button size='medium' color="dark">dark</Button> 
    <Button size='medium' color="grey">grey</Button> 
</div>
```

Size

```js
<div className="example_button">
    <Button color="grey" size="small">small</Button> 
    <Button color="grey" size="medium">medium</Button> 
    <Button color="grey" size="large">large</Button> 
</div>
```

Icon

```js
<div className="example_button">
    <Button color="grey" iconPosition="left" icon='bookmark' >icon position on left</Button> 
    <Button color="grey" iconPosition="right" icon='bookmark'>icon position on right</Button> 
</div>
```

circular

```js
<div className="example_button">
    <Button color="grey" circular size='small' icon='facebook' /> 
    <Button color="red" circular size='medium' icon='twitter' /> 
    <Button color="yellow" circular size='large' icon='linkedin' /> 
    <Button color="green" circular icon='google' /> 
</div>
```