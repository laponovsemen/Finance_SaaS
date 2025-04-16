'use client'
import { usePathname, useRouter } from 'next/navigation';
import { NavButton } from './nav-button';
import {
    Sheet,
    SheetContent,
    SheetTrigger
} from '@/src/shared/shadcn/ui/sheet'

import { useMedia } from 'react-use'
import { useState } from 'react';
import { Button } from '@/src/shared/shadcn/ui/button';
import { MenuIcon } from 'lucide-react';

type RouteType = {
    href: string;
    label: string;
}

const routes: RouteType[] = [
    {
        href: '/',
        label: 'Overview'
    },
    {
        href: '/transactions',
        label: 'Transactions'
    },
    {
        href: '/accounts',
        label: 'Accounts'
    },
    {
        href: '/categories',
        label: 'Categories',
    },
    {
        href: '/settings',
        label: 'Settings'
    }
]


export const Navigation = () => {
    const pathname = usePathname();
    const [open, setOpen] = useState(false);
    const router = useRouter();
    const isMobile = useMedia('(max-width: 1024px)', false);

    const onClick = (href: string) => {
        router.push(href);
        setOpen(false)
    }

    if (isMobile) {
        return (
            <Sheet
                open={open}
                onOpenChange={setOpen}

            >
                <SheetTrigger asChild>
                    <Button
                        variant='outline'
                        size='sm'
                        className='font-normal bg-white/10 hover:bg-white/20 hover:text-white border-none focus-visible:ring-offset-0 focus-visible:ring-transparent outline-none text-white focus:gb-white/30 transition '
                    >
                        <MenuIcon className='h-4 w-4' />
                    </Button>
                </SheetTrigger>
                <SheetContent side='left' className='px-2'>
                    <nav className='flex flex-col gap-y-2 pt-6'>
                        {routes.map((route) => {

                            return (
                                <Button
                                    key={route.href}
                                    variant={route.href === pathname ? 'secondary' : 'ghost'}
                                    onClick={() => onClick(route.href)}
                                    className='w-full justify-start'
                                >
                                    {route.label}
                                </Button>
                            )
                        })}
                    </nav>
                </SheetContent>
            </Sheet>
        )
    }
    return (
        <nav className='hidden lg:flex items-center gap-x-2 overflow-x-auto'>
            {routes.map(({ label, href }, index) => {
                console.log(`${pathname},${href}`)
                return (
                    <NavButton
                        key={`NavButton-${href}-${index}`}
                        href={href}
                        label={label}
                        isActive={pathname === href}
                    />
                )
            })}
        </nav>
    )
}