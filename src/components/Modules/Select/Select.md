Select component example:

To render Select:

```jsx static
import { Select } from '@/components';
```

Colors

```js
<div className="example">
    <InputGroup>
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
    </InputGroup>
    <InputGroup>
    <Select filter options={[
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
    ]} selectedLabel='With Filter' />
    </InputGroup>
</div>
```