// render component if somethingTrue

const isFunction = input => typeof input === 'function';
export default predicate => 
    element => (
        predicate ? (
            isFunction(element) ? element() : element
        ) : null
    );