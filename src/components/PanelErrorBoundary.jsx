import { Component } from 'react'

// Keeps one failing dashboard panel from blanking the rest of the calculator.
class PanelErrorBoundary extends Component {
  state = {
    hasError: false,
  }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidUpdate(previousProps) {
    // Let the panel try again when its inputs/results change.
    if (this.state.hasError && previousProps.resetKey !== this.props.resetKey) {
      this.setState({ hasError: false })
    }
  }

  componentDidCatch(error, info) {
    // Console detail is for debugging; the UI fallback stays simple for users.
    console.error(`${this.props.name} panel failed`, error, info)
  }

  render() {
    if (!this.state.hasError) return this.props.children

    return (
      <section className="rounded-2xl border border-white/80 bg-white/35 p-4 text-sm text-slate-600 shadow-[0_24px_80px_rgba(15,23,42,0.12)] ring-1 ring-slate-900/5 backdrop-blur-2xl">
        <div className="font-semibold text-slate-900">{this.props.name} is unavailable</div>
        <p className="mt-1">Change an input or reload if this panel does not recover.</p>
      </section>
    )
  }
}

export default PanelErrorBoundary
