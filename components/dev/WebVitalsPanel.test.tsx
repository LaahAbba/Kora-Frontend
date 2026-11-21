/**
 * WebVitalsPanel tests.
 *
 * The component is gated on NEXT_PUBLIC_ENABLE_DEVTOOLS or NODE_ENV === "development".
 * We stub the env var before importing to exercise the rendered path.
 */
import { render, screen, act } from "@testing-library/react";
import { describe, expect, it, vi, beforeEach } from "vitest";
import { WebVitalsPanel } from "./WebVitalsPanel";

// jsdom doesn't set these by default
Object.defineProperty(window, "innerHeight", { writable: true, configurable: true, value: 900 });
Object.defineProperty(window, "innerWidth",  { writable: true, configurable: true, value: 1280 });

describe("WebVitalsPanel", () => {
  beforeEach(() => {
    // Ensure devtools flag is set so the component renders
    process.env.NEXT_PUBLIC_ENABLE_DEVTOOLS = "true";
  });

  it("renders when devtools are enabled", () => {
    render(<WebVitalsPanel />);
    expect(screen.getByTestId("web-vitals-panel")).toBeInTheDocument();
    expect(screen.getByRole("region", { name: /Web Vitals Dev Panel/i })).toBeInTheDocument();
  });

  it("shows waiting message when no metrics received", () => {
    render(<WebVitalsPanel />);
    expect(screen.getByText(/Waiting for metrics/i)).toBeInTheDocument();
  });

  it("displays a vital entry when kora:webvital fires", () => {
    render(<WebVitalsPanel />);
    act(() => {
      window.dispatchEvent(
        new CustomEvent("kora:webvital", {
          detail: { name: "LCP", value: 1800, id: "v1", startTime: 0, label: "web-vital" },
        })
      );
    });
    expect(screen.getByText("LCP")).toBeInTheDocument();
  });

  it("hides on first kora:toggle-webvitals event", () => {
    render(<WebVitalsPanel />);
    expect(screen.getByTestId("web-vitals-panel")).toBeInTheDocument();

    act(() => {
      window.dispatchEvent(new CustomEvent("kora:toggle-webvitals"));
    });
    expect(screen.queryByTestId("web-vitals-panel")).not.toBeInTheDocument();
  });

  it("re-shows on second kora:toggle-webvitals event", () => {
    render(<WebVitalsPanel />);

    act(() => { window.dispatchEvent(new CustomEvent("kora:toggle-webvitals")); });
    expect(screen.queryByTestId("web-vitals-panel")).not.toBeInTheDocument();

    act(() => { window.dispatchEvent(new CustomEvent("kora:toggle-webvitals")); });
    expect(screen.getByTestId("web-vitals-panel")).toBeInTheDocument();
  });

  it("hides when the dismiss button is clicked", async () => {
    render(<WebVitalsPanel />);
    const dismissBtn = screen.getByRole("button", { name: /hide web vitals panel/i });
    act(() => { dismissBtn.click(); });
    expect(screen.queryByTestId("web-vitals-panel")).not.toBeInTheDocument();
  });

  it("shows the keyboard shortcut hint", () => {
    render(<WebVitalsPanel />);
    expect(screen.getByText(/Ctrl\+Shift\+V/i)).toBeInTheDocument();
  });
});

Kora-Frontend
Repository navigation
Code
Issues
137
 (137)
Issue done- #1275
#1275
Open
Georgebingi
wants to merge 1 commit into
OpenLedger-Foundation:main
from
Georgebingi:main
Conversation1 (1)
Commits1 (1)
Checks0 (0)
Files changed1 (1)
Pull request toolbar
Issue done
Georgebingi
Georgebingi
authored
3 minutes ago
Verified
commit
012613e
‎app/marketplace/loading.tsx‎
Original file line number	Diff line number	Diff line change
    </div>
  );
}
import React from "react";
export interface AppLoadingShellProps {
  isLoading: boolean;
  children?: React.ReactNode;
  showWalletSkeleton?: boolean;
  walletCount?: number;
  className?: string;
  label?: string;
}
const DEFAULT_WALLET_COUNT = 2;
export function AppLoadingShell({
  isLoading,
  children,
  showWalletSkeleton = true,
  walletCount = DEFAULT_WALLET_COUNT,
  className = "",
  label = "Loading application",
}: AppLoadingShellProps) {
  if (!isLoading) {
    return <>{children}</>;
  }
  const safeWalletCount = Math.max(
    1,
    Math.min(walletCount, 4)
  );
  return (
    <main
      className={`app-loading-shell ${className}`}
      aria-label={label}
      aria-busy="true"
    >
      <header className="loading-header">
        <div
          className="skeleton skeleton-logo"
          aria-hidden="true"
        />
        <div className="loading-header-actions">
          <div
            className="skeleton skeleton-action"
            aria-hidden="true"
          />
          <div
            className="skeleton skeleton-avatar"
            aria-hidden="true"
          />
        </div>
      </header>
      <section className="loading-content">
        <div className="loading-title-group">
          <div
            className="skeleton skeleton-title"
            aria-hidden="true"
          />
          <div
            className="skeleton skeleton-subtitle"
            aria-hidden="true"
          />
        </div>
        {showWalletSkeleton && (
          <section
            className="wallet-loading-grid"
            aria-label="Wallet loading placeholders"
          >
            {Array.from(
              { length: safeWalletCount },
              (_, index) => (
                <WalletSkeleton
                  key={index}
                />
              )
            )}
          </section>
        )}
        <section
          className="loading-dashboard"
          aria-hidden="true"
        >
          <div className="skeleton skeleton-panel" />
          <div className="loading-dashboard-grid">
            <div className="skeleton skeleton-card" />
            <div className="skeleton skeleton-card" />
          </div>
        </section>
        <span
          className="visually-hidden"
          role="status"
        >
          {label}
        </span>
      </section>
    </main>
  );
}
export function WalletSkeleton() {
  return (
    <article className="wallet-skeleton">
      <div className="wallet-skeleton-header">
        <div
          className="skeleton skeleton-wallet-icon"
        />
        <div className="wallet-skeleton-heading">
          <div className="skeleton skeleton-wallet-name" />
          <div className="skeleton skeleton-wallet-network" />
        </div>
      </div>
      <div className="skeleton skeleton-wallet-balance" />
      <div className="wallet-skeleton-footer">
        <div className="skeleton skeleton-wallet-button" />
        <div className="skeleton skeleton-wallet-button" />
      </div>
    </article>
  );
}
.app-loading-shell {
  width: 100%;
  min-height: 100vh;
  min-height: 100svh;
  box-sizing: border-box;
  padding: 24px;
  overflow-x: hidden;
}
.loading-header {
  width: 100%;
  height: 64px;
  min-height: 64px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 32px;
}
.loading-header-actions {
  display: flex;
  align-items: center;
  gap: 16px;
}
.loading-content {
  width: 100%;
  max-width: 1280px;
  margin: 0 auto;
}
.loading-title-group {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 32px;
}
.skeleton {
  position: relative;
  overflow: hidden;
  background: #e9ebef;
  border-radius: 8px;
  animation: skeleton-pulse 1.5s ease-in-out infinite;
}
.skeleton::after {
  content: "";
  position: absolute;
  inset: 0;
  transform: translateX(-100%);
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255, 255, 255, 0.55),
    transparent
  );
  animation: skeleton-shimmer 1.5s infinite;
}
.skeleton-logo {
  width: 150px;
  height: 36px;
}
.skeleton-action {
  width: 110px;
  height: 40px;
}
.skeleton-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
}
.skeleton-title {
  width: min(320px, 70%);
  height: 32px;
}
.skeleton-subtitle {
  width: min(220px, 55%);
  height: 16px;
}
.wallet-loading-grid {
  display: grid;
  grid-template-columns: repeat(
    auto-fit,
    minmax(min(100%, 250px), 1fr)
  );
  gap: 20px;
  margin-bottom: 32px;
}
.wallet-skeleton {
  box-sizing: border-box;
  min-width: 0;
  min-height: 190px;
  height: 190px;
  padding: 20px;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
.wallet-skeleton-header {
  display: flex;
  align-items: center;
  gap: 12px;
}
.wallet-skeleton-heading {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.skeleton-wallet-icon {
  width: 42px;
  height: 42px;
  border-radius: 50%;
}
.skeleton-wallet-name {
  width: 130px;
  max-width: 100%;
  height: 15px;
}
.skeleton-wallet-network {
  width: 85px;
  height: 11px;
}
.skeleton-wallet-balance {
  width: 65%;
  height: 30px;
}
.wallet-skeleton-footer {
  display: flex;
  gap: 12px;
}
.skeleton-wallet-button {
  width: 50%;
  height: 36px;
}
.loading-dashboard {
  display: flex;
  flex-direction: column;
  gap: 20px;
}
.skeleton-panel {
  width: 100%;
  height: 220px;
  border-radius: 12px;
}
.loading-dashboard-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 20px;
}
.skeleton-card {
  width: 100%;
  height: 160px;
}
.visually-hidden {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}
@keyframes skeleton-pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.65;
  }
}
@keyframes skeleton-shimmer {
  100% {
    transform: translateX(100%);
  }
}
@media (max-width: 768px) {
  .app-loading-shell {
    padding: 16px;
  }
  .loading-header {
    margin-bottom: 24px;
  }
  .wallet-loading-grid {
    grid-template-columns: 1fr;
  }
  .loading-dashboard-grid {
    grid-template-columns: 1fr;
  }
  .wallet-skeleton {
    min-height: 180px;
    height: 180px;
  }
  .skeleton-panel {
    height: 180px;
  }
}
@media (prefers-reduced-motion: reduce) {
  .skeleton,
  .skeleton::after {
    animation: none;
  }
}
import React from "react";
interface WalletBootstrapContainerProps {
  isBootstrapping: boolean;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}
export function WalletBootstrapContainer({
  isBootstrapping,
  children,
  fallback,
}: WalletBootstrapContainerProps) {
  return (
    <section
      className="wallet-bootstrap-container"
      aria-busy={isBootstrapping}
      data-bootstrap-state={
        isBootstrapping ? "loading" : "ready"
      }
    >
      {isBootstrapping ? (
        fallback ?? <WalletBootstrapFallback />
      ) : (
        children
      )}
    </section>
  );
}
function WalletBootstrapFallback() {
  return (
    <div className="wallet-bootstrap-fallback">
      <div className="skeleton skeleton-wallet-balance" />
      <div className="wallet-bootstrap-actions">
        <div className="skeleton skeleton-wallet-button" />
        <div className="skeleton skeleton-wallet-button" />
      </div>
    </div>
  );
}
import React from "react";
import {
  AppLoadingShell,
} from "./app-loading-shell";
import {
  WalletBootstrapContainer,
} from "./wallet-bootstrap-container";
interface AppProps {
  walletReady: boolean;
  isBootstrapping: boolean;
}
export default function App({
  walletReady,
  isBootstrapping,
}: AppProps) {
  const isLoading =
    isBootstrapping || !walletReady;
  return (
    <AppLoadingShell
      isLoading={isLoading}
      walletCount={2}
    >
      <main className="application-content">
        <header className="application-header">
          <h1>Dashboard</h1>
        </header>
        <WalletBootstrapContainer
          isBootstrapping={isBootstrapping}
        >
          <section className="wallet-dashboard">
            <h2>Connected Wallet</h2>
            <div className="wallet-balance">
              $0.00
            </div>
            <div className="wallet-actions">
              <button type="button">
                Deposit
              </button>
              <button type="button">
                Withdraw
              </button>
            </div>
          </section>
        </WalletBootstrapContainer>
      </main>
    </AppLoadingShell>
  );
}
import React from "react";
import {
  render,
  screen,
} from "@testing-library/react";
import "@testing-library/jest-dom";
import {
  AppLoadingShell,
  WalletSkeleton,
} from "../components/app-loading-shell";
describe("AppLoadingShell", () => {
  test("renders loading shell while loading", () => {
    render(
      <AppLoadingShell isLoading={true} />
    );
    expect(
      screen.
