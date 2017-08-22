Level component example:

To render Button:

```jsx static
import { Level } from '@/components';
```

The structure of a level is the following:

- level: main container
 - level-left for the left side. This element is required, even if it is empty
 - level-right for the right side
 - level-item for each individual element

In a level-item, you can then insert almost anything you want: a title, a button, a text input, or just simple text. No matter what elements you put inside a Bulma level, they will always be vertically centered.

Normal

```js
<div className="example example_level">
    <Level>
        <Level.Item>
            Level Item
        </Level.Item>
        <Level.Item>
            Level Item
        </Level.Item>
        <Level.Item>
            Level Item
        </Level.Item>
    </Level>
</div>
```

```js
<div className="example example_level">
    <Level>
        <Level.Item>
            Level Item
        </Level.Item>
        <Level.Item>
            Level Item
        </Level.Item>
    </Level>
</div>
```

```js
<div className="example example_level">
    <Level>
        <Level.Left>
            Lorem Ipsum is simply dummy text of
        </Level.Left>
        <Level.Right>
            Lorem Ipsum is simply dummy text of the printing and typesetting
        </Level.Right>
    </Level>
</div>
```

```js
<div className="example example_level">
    <Level>
        <Level.Left>
            Level Left
        </Level.Left>
        <Level.Item>
            Lorem Ipsum is simply dummy text of the printing and typesetting
        </Level.Item>
        <Level.Right>
            Level Right
        </Level.Right>
    </Level>
</div>
```