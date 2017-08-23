Input component example:

To render Button:

```jsx static
import { Input } from '@/components';
```

Normal

```js
<div className="example">
    <InputGroup>
        <Input label='label' placeholder='Placeholder'/>
    </InputGroup>
    <InputGroup>
        <Input label='label' color='red' placeholder='Color Red'/>
    </InputGroup>
    <InputGroup>    
        <Input label='label' color='green' placeholder='Color Green'/>
    </InputGroup>
    <InputGroup>    
        <Input label='label' color='yellow' placeholder='Color Yellow'/>
    </InputGroup>
</div>
```

Horizontal

```js
<div className="example">
    <InputGroup>
        <Input horizontal label='Horizontal layout' icon='bookmark' message='Horizontal layout with message' color='green' placeholder='Size small'/>
    </InputGroup>
    <InputGroup>
        <Input horizontal message='textarea is required' color='red' label='Horizontal layout with message' placeholder='Placeholder'/>
    </InputGroup>
</div>
```

Icon

```js
<div className="example">
    <InputGroup>
        <Input icon='bell' label='with Icon' placeholder='With Icon' />
    </InputGroup>
</div>
```

Sprites

```js
<div className="example">
    <InputGroup>
        <Input sprites='gosend' label='with Sprites' placeholder='with Sprites' />
    </InputGroup>
</div>
```

Size

```js
<div className="example">
    <InputGroup>
        <Input label='label' size='small' placeholder='Size small'/>
    </InputGroup>
    <InputGroup>    
        <Input label='label' size='medium' placeholder='Size medium'/>
    </InputGroup>
    <InputGroup>    
        <Input label='label' size='large' placeholder='Size large'/>
    </InputGroup>
</div>
```