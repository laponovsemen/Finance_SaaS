import { Header } from '@/src/features/dashboard/layout/header/header';
import type { ReactNode } from 'react';


interface DashboardLayoutProps {
    children: ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {

    return (
        <>
            <Header />
            <main className='px-3 lg:px-14'>
                {children}
            </main>
        </>
    );
}

export default DashboardLayout