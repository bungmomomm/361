Tabs component example:

To render Tabs:

```jsx static
import { Tabs } from '@/components';
```

Example

```js
<div className="example">
    <Tabs tabActive={0} >
		<Tabs.Panel title='Title Tab 1'>
            Content Tab 1
        </Tabs.Panel>
        <Tabs.Panel title='Title Tab 2'>
            Content Tab 2
        </Tabs.Panel>
        <Tabs.Panel title='Title Tab 3'>
            Content Tab 3
        </Tabs.Panel>
    </Tabs>
</div>
```