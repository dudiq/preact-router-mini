import {h, Component} from 'preact';

const reg = /[^a-zA-Z]+/ig;

function err(msg) {
    if (typeof window.console !== undefined) {
        console.error('PathRouter.js:', msg);
    }
}

function parseLevels(path) {
    (path == '/') && (path = '');
    if (!path) {
        path = '';
        return path;
    }

    const levels = path.split('/');
    for (let i = 0, l = levels.length; i < l; i++) {
        const item = levels[i];
        levels[i] = item.replace(reg, '');
    }
    const ret = levels.join('/');
    return ret;
}

export default class PathRouter extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isShow: false,
        };
        if (props.children.length > 1) {
            err('sorry, but only one children can be in PathRouter, doh...');
        }
    }

    getChildContext() {
        return {
            __pathRoute: this.getFullPath(),
            ...this.context,
        };
    }

    componentDidMount() {
        this.context.router.onRoute(this.getFullPath(), this.onShow, this.onHide, this);
    }

    componentWillUnmount() {
        this.context.router.offRoute(this);
    }

    onShow = () => {
        this.setState({
            isShow: true,
        });
    };

    onHide = () => {
        this.setState({
            isShow: false,
        });
    };

    getFullPath() {
        const root = parseLevels(this.context.__pathRoute);
        const ret = root + this.props.path;

        return ret;
    }

    render() {
        const {children} = {...this.props};
        const isShow = this.state.isShow;

        return isShow ? (
            children[0]
        ) : null;
    }
}
