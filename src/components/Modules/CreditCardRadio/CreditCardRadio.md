CreditCardRadio component example:

To render Button:

```jsx static
import { CreditCardRadio } from '@/components';
```

Normal

```js
<div className="example">
    <InputGroup>
        <CreditCardRadio checked name='radioCreditCard' content='Default Checked' />
    </InputGroup>
    <InputGroup>
        <CreditCardRadio name='radioCreditCard' content='content creditcardRadio' />
    </InputGroup>
</div>
```