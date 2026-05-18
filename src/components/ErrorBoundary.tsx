import { Component, type ErrorInfo, type ReactNode } from 'react';

type Props = { children: ReactNode };
type State = { hasError: boolean; errorMessage: string | null };

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, errorMessage: null };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, errorMessage: error.message };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Unhandled application error', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <main className="mx-auto max-w-md p-4">
          <section className="glass rounded-2xl p-4 space-y-2">
            <h1 className="text-xl font-bold">Something went wrong</h1>
            <p className="text-sm text-zinc-300">Please refresh the page. If this keeps happening, contact support.</p>
            {this.state.errorMessage ? <p className="text-xs text-zinc-400">Error: {this.state.errorMessage}</p> : null}
          </section>
        </main>
      );
    }

    return this.props.children;
  }
}
