import React from "react";
import { Link } from "react-router-dom";

interface Props {
  children: React.ReactNode;
}
interface State {
  hasError: boolean;
}

export default class ErrorBoundary extends React.Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: unknown) {
    console.error("Parsa Apps UI error:", error);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="grid min-h-screen place-items-center px-6 text-center">
          <div>
            <img src="/assets/logo.svg" alt="" width={88} height={88} className="mx-auto" />
            <h1 className="mt-6 text-2xl font-black text-white">مشکلی در نمایش صفحه پیش آمد</h1>
            <p className="mt-3 text-white/55">لطفاً صفحه را دوباره بارگذاری کنید.</p>
            <Link to="/" className="btn btn-primary mt-6" onClick={() => this.setState({ hasError: false })}>
              بازگشت به خانه
            </Link>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
