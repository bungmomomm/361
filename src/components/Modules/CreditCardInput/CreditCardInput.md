CreditCardInput component example:

To render Button:

```jsx static
import { CreditCardInput } from '@/components';
```

Normal

```js
<div className="example">
    <InputGroup>
        <CreditCardInput label='label' placeholder='Placeholder'/>
    </InputGroup>
    <InputGroup>
        <CreditCardInput label='label' color='red' placeholder='Color Red'/>
    </InputGroup>
    <InputGroup>    
        <CreditCardInput label='label' color='green' placeholder='Color Green'/>
    </InputGroup>
    <InputGroup>    
        <CreditCardInput label='label' color='yellow' placeholder='Color Yellow'/>
    </InputGroup>
</div>
```

Horizontal

```js
<div className="example">
    <InputGroup>
        <CreditCardInput horizontal label='Horizontal layout' message='Horizontal layout with message' color='green' placeholder='Size small'/>
    </InputGroup>
    <InputGroup>
        <CreditCardInput horizontal message='textarea is required' color='red' label='Horizontal layout with message' placeholder='Placeholder'/>
    </InputGroup>
</div>
```

Size

```js
<div className="example">
    <InputGroup>
        <CreditCardInput label='label' size='small' placeholder='Size small'/>
    </InputGroup>
    <InputGroup>    
        <CreditCardInput label='label' size='medium' placeholder='Size medium'/>
    </InputGroup>
    <InputGroup>    
        <CreditCardInput label='label' size='large' placeholder='Size large'/>
    </InputGroup>
</div>
```