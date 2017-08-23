InputGroup component example:

To render Button:

```jsx static
import { InputGroup } from '@/components';
```

Input Group with addons

```js
<div className="example">
    <InputGroup addons>
        <Input color='grey' placeholder='Placeholder'/>
        <Button color='grey' content='cek'/>
    </InputGroup>
    <InputGroup addons>
        <Button color='green' content='show all category' icon='angle-down' iconPosition='right'/>
        <Input color='green' placeholder='Placeholder'/>
        <Button color='green' content='search' icon='search' iconPosition='left'/>
    </InputGroup>
    <InputGroup addons>
        <Select options={[
            { value:1, label: 'All '},
            { value:2, label: 'Handphone & Tablet'},
            { value:3, label: 'Komputer & Laptop'},
            { value:4, label: 'Fashion Pria'},
            { value:5, label: 'Fashion Wanita'},
            { value:6, label: 'Jam Tangan & Perhiasan'},
            { value:7, label: 'Tas & Koper'},
            { value:8, label: 'Olahraga & Outdoor'},
            { value:9, label: 'TV, Audio & Game'},
            { value:10, label: 'Peralatan Rumah Tangga'},
            { value:11, label: 'Elektronik Rumah Tangga'},
            { value:12, label: 'Kesehatan & Kecantikan'},
            { value:13, label: 'Kamera & Kamera Video'},
            { value:14, label: 'Otomotif'},
            { value:15, label: 'Groceries'},
            { value:16, label: 'Perlengkapan Anak & Bayi'},
            { value:17, label: 'Buku & Hiburan'},
            { value:18, label: 'Voucher'},
            { value:19, label: 'Properti'},
        ]} selectedLabel='All' />
        <Input color='green' placeholder='Placeholder'/>
        <Button color='green' content='search' icon='search' iconPosition='left'/>
    </InputGroup>
    <InputGroup addons>
        <Button color='yellow' content='cek' icon='arrow-right' iconPosition='right'/>
        <Input color='yellow' placeholder='Placeholder' message='message'/>
    </InputGroup>
</div>
```