'use client'

import qs from 'query-string'
import { formatDateRange } from '@/lib/utils';
import { Button } from '@/src/shared/shadcn/ui/button';
import { Popover, PopoverClose, PopoverContent, PopoverTrigger } from '@/src/shared/shadcn/ui/popover'
import { format, subDays } from 'date-fns';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import type { DateRange } from 'react-day-picker';
import { ChevronDown } from 'lucide-react';
import { Calendar } from '@/src/shared/shadcn/ui/calendar';




export const DateFilter = () => {

    const router = useRouter();
    const pathname = usePathname();

    const params = useSearchParams();
    const accountId = params.get('accountId');
    const from = params.get('from') || '';
    const to = params.get('to') || '';

    const defaultTo = new Date();
    const defaultFrom = subDays(defaultTo, 30);

    const paramsState = {
        from: from ? new Date(from) : defaultFrom,
        to: to ? new Date(to) : defaultTo
    }


    const [date, setDate] = useState<DateRange | undefined>()

    const pushToUrl = (dateRange: DateRange | undefined) => {
        const query = {
            from: format(dateRange?.from || defaultFrom, 'yyyy-MM-dd'),
            to: format(dateRange?.to || defaultTo, 'yyyy-MM-dd'),
            accountId
        }

        const url = qs.stringifyUrl({
            url: pathname,
            query
        }, { skipEmptyString: true, skipNull: true })
        router.push(url);
    }

    const onReset = () => {
        setDate(undefined)
        pushToUrl(undefined)
    };


    return (
        <Popover>
            <PopoverTrigger asChild >
                <Button
                    disabled={false}
                    size='sm'
                    variant='outline'
                    className='lg:w-auto w-full h-9 rounded-md px-3 font-normal bg-white/10 hover:bg-white/20 hover:text-white border-none focus:ring-offset-0 focus:ring-transparent outline-none text-white focus:bg-white/30 transition'
                >
                    <span>
                        {formatDateRange(paramsState)}
                    </span>
                    <ChevronDown className='ml-2 size-4 opacity-50' />
                </Button>
            </PopoverTrigger>
            <PopoverContent className='lg:w-auto w-full p-0' align='start'>
                <Calendar
                    disabled={false}
                    initialFocus
                    mode='range'
                    defaultMonth={date?.from}
                    selected={date}
                    onSelect={setDate}
                    numberOfMonths={2}
                />
                <div className='p-4 w-full flex items-center gap-x-2'>
                    <PopoverClose asChild>
                        <Button
                            onClick={onReset}
                            disabled={!date?.from || !date?.to}
                            className='grow'
                            variant='outline'
                        >
                            Reset
                        </Button>
                    </PopoverClose>
                    <PopoverClose asChild>
                        <Button
                            onClick={() => pushToUrl(date)}
                            disabled={!date?.from || !date?.to}
                            className='grow'
                        >
                            Apply
                        </Button>
                    </PopoverClose>
                </div>
            </PopoverContent>
        </Popover>
    )
}