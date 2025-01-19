import AdminProvider from '@/components/lib/auth/AdminProvider'
import Header from '@/container/layout/Header/Header'
import React from 'react'

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <AdminProvider>
            <Header />

            {children}

        </AdminProvider>

    )
}