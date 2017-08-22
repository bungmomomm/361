Col component example:

To render Button:

```jsx static
import { Col, Row } from '@/components';
```

The structure of a Col is the following:

- Add a Row
  - Add as many Col elements as you want
  - Each Col will have an equal width, no matter the number of Col.

```js
<div className="example example_col">
    <Row>
        <Col> 1 </Col>
        <Col> 2 </Col>
        <Col> 3 </Col>
        <Col> 4 </Col>
        <Col> 5 </Col>
        <Col> 6 </Col>
        <Col> 7 </Col>
        <Col> 8 </Col>
        <Col> 9 </Col>
        <Col> 10 </Col>
        <Col> 11 </Col>
        <Col> 12 </Col>
    </Row>
</div>
```
Grid

```js
<div className="example example_col">
    <Row>
        <Col grid={1}> 1 </Col>
        <Col> Auto </Col>
    </Row>
    <Row>
        <Col grid={2}> 2 </Col>
        <Col> Auto </Col>
    </Row>
    <Row>
        <Col grid={3}> 3 </Col>
        <Col> Auto </Col>
    </Row>
    <Row>
        <Col grid={4}> 4 </Col>
        <Col> Auto </Col>
    </Row>
    <Row>
        <Col grid={5}> 5 </Col>
        <Col> Auto </Col>
    </Row>
    <Row>
        <Col grid={6}> 6 </Col>
        <Col> Auto </Col>
    </Row>
    <Row>
        <Col grid={7}> 7 </Col>
        <Col> Auto </Col>
    </Row>
    <Row>
        <Col grid={8}> 8 </Col>
        <Col> Auto </Col>
    </Row>
    <Row>
        <Col grid={9}> 9 </Col>
        <Col> Auto </Col>
    </Row>
    <Row>
        <Col grid={10}> 10 </Col>
        <Col> Auto </Col>
    </Row>
    <Row>
        <Col grid={11}> 11 </Col>
        <Col> Auto </Col>
    </Row>
    <Row>
        <Col grid={12}> 12 </Col>
    </Row>
</div>
```
Nested

ou can nest Col to have more flexibility in your design. You only need to follow this structure:

- Row: top-level columns container
 - Col
 - Row: nested Row
 - Col and so on…

The difference with multiline columns is the order in the HTML code

```js
<div className="example example_col">
    <Row>
        <Col grid={6}>
             <Row>
                <Col grid={12}> 12 </Col>
            </Row>
             <Row>
                <Col grid={3}> 3 </Col>
                <Col grid={9}> 9 </Col>
            </Row>
        </Col>
        <Col grid={6}>
            <Row>
                <Col grid={6}> 6 </Col>
                <Col grid={6}> 6 </Col>
            </Row>
             <Row>
                <Col grid={3}> 2 </Col>
                <Col grid={9}> 10 </Col>
            </Row>
        </Col>
    </Row>
</div>
```