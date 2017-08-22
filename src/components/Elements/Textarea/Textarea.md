Textarea component example:

To render Button:

```jsx static
import { Textarea } from '@/components';
```

Normal

```js
<div className="example">
    <InputGroup>
        <Textarea label='label' placeholder='Placeholder'/>
    </InputGroup>
</div>
```

Horizontal

```js
<div className="example">
    <InputGroup>
        <Textarea horizontal label='Horizontal layout' size='small' placeholder='Size small'/>
    </InputGroup>
</div>
```

Icon

```js
<div className="example">
    <InputGroup>
        <Textarea icon='bell' label='with Icon' size='small' placeholder='Size small'/>
    </InputGroup>
</div>
```

Sprites

```js
<div className="example">
    <InputGroup>
        <Textarea sprites='gosend' label='with Sprites' size='small' placeholder='Size small'/>
    </InputGroup>
</div>
```



Color

```js
<div className="example">
    <InputGroup>
        <Textarea label='label' color='red' placeholder='Color Red'/>
    </InputGroup>
    <InputGroup>    
        <Textarea label='label' color='green' placeholder='Color Green'/>
    </InputGroup>
    <InputGroup>    
        <Textarea label='label' color='yellow' placeholder='Color Yellow'/>
    </InputGroup>
</div>
```

Size

```js
<div className="example">
    <InputGroup>
        <Textarea label='label' size='small' placeholder='Size small'/>
    </InputGroup>
    <InputGroup>    
        <Textarea label='label' size='medium' placeholder='Size medium'/>
    </InputGroup>
    <InputGroup>    
        <Textarea label='label' size='large' placeholder='Size large'/>
    </InputGroup>
</div>
```