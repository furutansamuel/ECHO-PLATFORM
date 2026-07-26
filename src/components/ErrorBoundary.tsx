import React from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

interface Props {
  children: React.ReactNode;
}

interface State {
  error: Error | null;
}

/**
 * Without this, React's default behavior on any uncaught render error is
 * to unmount the ENTIRE app — producing exactly the "blank white screen"
 * symptom, with no message and often nothing in the console either.
 *
 * This catches that error, shows what actually broke (so it can be
 * reported/screenshotted instead of guessed at), and offers a way back
 * instead of a dead end.
 */
export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    // Surfaced in the browser console with full context — this is what
    // to screenshot/copy when reporting a blank-page issue going forward.
    console.error('[ECHO] Uncaught render error:', error, info.componentStack);
  }

  handleReload = () => {
    window.location.reload();
  };

  handleGoHome = () => {
    this.setState({ error: null });
    window.location.href = '/';
  };

  render() {
    if (this.state.error) {
      return (
        <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-background px-6 text-center">
          <div className="rounded-full bg-destructive/10 p-4">
            <AlertTriangle className="h-8 w-8 text-destructive" />
          </div>
          <h1 className="text-xl font-bold text-foreground">Something went wrong</h1>
          <p className="max-w-md text-sm text-muted-foreground">
            ECHO hit an unexpected error and couldn't continue. This has been logged —
            reloading usually fixes it.
          </p>
          <details className="max-w-lg w-full rounded-lg bg-muted p-3 text-left text-xs text-muted-foreground">
            <summary className="cursor-pointer font-semibold">Technical details</summary>
            <pre className="mt-2 whitespace-pre-wrap break-words">
              {this.state.error.message}
              {this.state.error.stack ? `\n\n${this.state.error.stack}` : ''}
            </pre>
          </details>
          <div className="flex gap-3 pt-2">
            <button
              onClick={this.handleReload}
              className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground"
            >
              <RefreshCw className="h-4 w-4" /> Reload
            </button>
            <button
              onClick={this.handleGoHome}
              className="inline-flex items-center gap-2 rounded-full border border-border px-5 py-2.5 text-sm font-semibold text-foreground"
            >
              <Home className="h-4 w-4" /> Go Home
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
