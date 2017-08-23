Modal component example:

To render Modal:

```jsx static
import { Modal } from '@/components';
```

Colors

```js
initialState = { isOpen: false };
<div className="example">
    <Button onClick={() => setState({ isOpen: true })} type='button' content='show modal' color='red' />
    <Modal shown={state.isOpen}>
        <Modal.Header>
            modal Title
        </Modal.Header>
        <Modal.Body>
            Modal Body 
        </Modal.Body>
        <Modal.Footer>
            <Button type='button' onClick={() => setState({ isOpen: false })} content='close' color='grey' />
            <Button type='button' content='Save' color='red' />
        </Modal.Footer>
    </Modal>
</div>
```