import { Button } from '@/src/shared/shadcn/ui/button';
import { cn } from '@/lib/utils';
import Link from 'next/link'
import type { ComponentProps } from 'react';


type NavButtonLinkProps = ComponentProps<typeof Link> & {
    label: string,
    isActive: boolean
}

export const NavButton = ({ href, isActive, label }: NavButtonLinkProps) => {

    return (

        <Button
            size={'sm'}
            asChild
            variant='outline'
            className={
                cn(
                    'w-full lg:w-auto justify-between font-normal hover:bg-white/20 hover:text-white border-none focus-visible:ring-offset-0 focus-visible:ring-transparent outline-none text-white focus:bg-white/30 transition',
                    isActive ? 'bg-white/10 text-white' : 'bg-transparent'
                )
            }
        >
            <Link
                href={href}
            >
                {label}
            </Link>

        </Button>

    )
}
