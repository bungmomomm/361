Select component example:

To render Select:

```jsx static
import { Select } from '@/components';
```

Example

```js
initialState = { options: [
        { value:1, label: 'All '},
        { value:2, label: 'Handphone & Tablet'},
        { value:3, label: 'Komputer & Laptop'},
        { value:4, label: 'Fashion Pria'},
        { value:5, label: 'Fashion Wanita'},
        { value:6, label: 'Jam Tangan & Perhiasan'},
        { value:7, label: 'Tas & Koper'},
        { value:8, label: 'Olahraga & Outdoor'},
        { value:9, label: 'TV, Audio & Game'}
    ] };
<div className="example">
    <InputGroup>
        <InputGroup>
            <Select label='category' options={state.options} selectedLabel='Select...' />
        </InputGroup>
        <InputGroup>
            <Select label='category' color='red' options={state.options} selectedLabel='Select...' />
        </InputGroup>
        <InputGroup>
            <Select label='category' color='green' options={state.options} selectedLabel='Select...' />
        </InputGroup>
        <InputGroup>
            <Select label='category' color='yellow' options={state.options} selectedLabel='Select...' />
        </InputGroup>
    </InputGroup>
</div>
```
With Filter Data

```js
initialState = { options: [
        { value:1, label: 'All '},
        { value:2, label: 'Handphone & Tablet'},
        { value:3, label: 'Komputer & Laptop'},
        { value:4, label: 'Fashion Pria'},
        { value:5, label: 'Fashion Wanita'},
        { value:6, label: 'Jam Tangan & Perhiasan'},
        { value:7, label: 'Tas & Koper'},
        { value:8, label: 'Olahraga & Outdoor'},
        { value:9, label: 'TV, Audio & Game'}
    ] };
<div className="example">
    <InputGroup>
        <Select label='category' filter options={state.options} selectedLabel='With Filter' />
    </InputGroup>
</div>
```

Horizontal

```js
initialState = { options: [
        { value:1, label: 'All '},
        { value:2, label: 'Handphone & Tablet'},
        { value:3, label: 'Komputer & Laptop'},
        { value:4, label: 'Fashion Pria'},
        { value:5, label: 'Fashion Wanita'},
        { value:6, label: 'Jam Tangan & Perhiasan'},
        { value:7, label: 'Tas & Koper'},
        { value:8, label: 'Olahraga & Outdoor'},
        { value:9, label: 'TV, Audio & Game'}
    ] };
<div className="example">
    <InputGroup>
        <Select horizontal label='Horizontal Layout' filter options={state.options} selectedLabel='With Filter' />
    </InputGroup>
    <InputGroup>
        <Select horizontal label='Horizontal Layout' color='red' message='select is required' filter options={state.options} selectedLabel='With Filter' />
    </InputGroup>
</div>
```

Add Button

```js
initialState = { options: [
        { value:1, label: 'All '},
        { value:2, label: 'Handphone & Tablet'},
        { value:3, label: 'Komputer & Laptop'},
        { value:4, label: 'Fashion Pria'}
    ] };
<div className="example">
    <InputGroup>
        <Select addButton={<Button block iconPosition='left' icon='plus' content='add more' />} horizontal label='Horizontal Layout' filter options={state.options} selectedLabel='With Filter' />
    </InputGroup>
</div>
```