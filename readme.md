Router mini for preact
=

##how to use:
`<PathRouter/>` component will check browser location and will change own state (show/hide) if path match or not.

somewhere before start render the whole App
```
import router from 'preact-router-mini';
...

route.startRouting();
```

```
import {PathRouter} from 'preact-router-mini';
...
//somewhere in render() method of component
    <PathRouter path="/">
        <Login/>
    </PathRouter>
    <PathRouter path="/dash">
        <Dashboard/>
    </PathRouter>

```

 licence: MIT, dudiq 2018
