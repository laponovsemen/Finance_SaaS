'use client'

import { formatDateRange } from '@/lib/utils';
import { DataGrid } from '../summary/components/data-grid/data-grid';
import { DataCharts } from '../summary/components/data-grid/data-charts/data-charts';

function DashboardBoard() {

    return (
        <div className='max-w-screen-2xl mx-auto w-full pb-10 -mt-24'>
            <DataGrid />
            <DataCharts />
        </div>
    );
}

export default DashboardBoard;