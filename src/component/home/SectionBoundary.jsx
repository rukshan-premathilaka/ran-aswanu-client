import { Component } from "react";
import { homeLog } from "./homeLog.js";

// Wraps one Home section. If that section crashes, the error is written to the console
// (section name + error + component stack) and the rest of the page keeps working.
export default class SectionBoundary extends Component {
    constructor(props) {
        super(props);
        this.state = { failed: false };
    }

    static getDerivedStateFromError() {
        return { failed: true };
    }

    componentDidCatch(error, info) {
        homeLog.error(`Section "${this.props.name}" crashed and was hidden.`, error, info?.componentStack);
    }

    render() {
        if (this.state.failed) return null;
        return this.props.children;
    }
}
