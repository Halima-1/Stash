'use client';
import { useEffect, useState } from "react";
import "./styles/layout.scss"
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { Moon, Sun, Menu, X } from "lucide-react";
import Link from "next/link";

const Header = () => {
    const [theme, setTheme] = useState<'light' | 'dark'>('dark');
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    useEffect(() => {
        const saved = localStorage.getItem('theme') as 'light' | 'dark' || 'dark';
        setTheme(saved);
    }, []);

    useEffect(() => {
        document.body.className = theme === 'light' ? 'light-theme' : '';
        localStorage.setItem('theme', theme);
    }, [theme]);

    const toggleTheme = () => setTheme(prev => prev === 'light' ? 'dark' : 'light');

    return (
        <header>
            {/* Logo */}
            <div className="header-logo">
                <Link href="/">
                    <h1>Stash</h1>
                </Link>
            </div>

            {/* Desktop Nav */}
            <nav className="header-nav">
                <ul>
                    <li><Link className="nav-item" href="/dashboard/overview">Overview</Link></li>
                    <li><Link className="nav-item" href="/dashboard/fixed">Fixed</Link></li>
                    <li><Link className="nav-item" href="/dashboard/flexible">Flexible</Link></li>
                    <li><Link className="nav-item" href="/dashboard/transfer">Transfer</Link></li>
                </ul>
            </nav>

            {/* Actions */}
            <div className="header-actions">
                {/* Theme Toggle */}
                <button
                    className="btn-icon"
                    onClick={toggleTheme}
                    title="Toggle theme"
                >
                    {theme === 'light' ? <Sun size={18} /> : <Moon size={18} />}
                </button>

                {/* Connect Wallet */}
                <div className="wallet-connect">
                    <ConnectButton
                        chainStatus="icon"
                        showBalance={false}
                        accountStatus="avatar"
                    />
                </div>

                {/* Mobile Toggle */}
                <button
                    className="mobile-toggle"
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                >
                    {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {/* Mobile Menu */}
            {isMenuOpen && (
                <div className="mobile-menu">
                    <ul>
                        <li><Link href="/dashboard/overview" onClick={() => setIsMenuOpen(false)}>Overview</Link></li>
                        <li><Link href="/dashboard/fixed" onClick={() => setIsMenuOpen(false)}>Fixed</Link></li>
                        <li><Link href="/dashboard/flexible" onClick={() => setIsMenuOpen(false)}>Flexible</Link></li>
                        <li><Link href="/dashboard/transfer" onClick={() => setIsMenuOpen(false)}>Transfer</Link></li>
                    </ul>
                    <div className="mobile-wallet">
                        <ConnectButton
                            chainStatus="name"
                            showBalance={false}
                            accountStatus="full"
                        />
                    </div>
                </div>
            )}
        </header>
    )
}

export default Header
