import { Button } from '@/src/shared/shadcn/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/src/shared/shadcn/ui/card';
import { useState } from 'react';
import { ImportTable } from '../import-table/import-table';
import { convertAmountToMiliunits } from '@/lib/utils';
import { format, parse } from 'date-fns';


const dateFormat = 'dd.MM.yyyy HH:mm:ss'
const outputFormat = 'yyyy-MM-dd'

const requiredOptions = [
    'amount',
    'date',
    'payee'
]

interface SelectedColumsState {
    [key: string]: string | null;
}

type Props = {
    data: string[][],
    onCancel: () => void;
    onSubmit: (data: any) => void;
}

const getColumnIndex = (column: string) => {
    return column.split('_')[1];
}

export const ImportCard = ({
    data,
    onCancel,
    onSubmit
}: Props) => {

    const [selectedColumns, setSelectedColumns] = useState<SelectedColumsState>({})



    const onTableHeadSelectChange = (
        columnIndex: number,
        value: string | null
    ) => {
        setSelectedColumns((prev) => {
            const newSelectedColumns = { ...prev }
            for (const key in newSelectedColumns) {
                if (newSelectedColumns[key] === value) {
                    newSelectedColumns[key] = null;
                }
            }

            if (value === 'skip') {
                value = null;
            }

            newSelectedColumns[`column_${columnIndex}`] = value;

            return newSelectedColumns
        })

    }


    const headers = data[0];
    const body = data.slice(1);

    const progress = Object.values(selectedColumns).filter(Boolean).length


    const handleContinue = () => {
        const mappedData = {
            headers: headers.map((_header, index) => {
                const columnIndex = getColumnIndex(`column_${index}`);
                return selectedColumns[`column_${columnIndex}`]
            }),
            body: body.map((row) => {
                const transformedRow = row.map((cell, index) => {
                    const columnIndex = getColumnIndex(`column_${index}`);
                    return selectedColumns[`column_${columnIndex}`] ? cell : null;
                })
                return transformedRow.every((item) => item === null) ? [] : transformedRow
            }).filter((row) => (row).length > 0)
        }

        const fieldFormatters = {
            date: (date: string | null) => date ? format(parse(date, dateFormat, new Date()), outputFormat) : null,
            amount: (cell: string | null) => (cell as number | null) ? convertAmountToMiliunits(parseFloat(cell as string)) : null
        }

        const arrayOfDate = mappedData.body.map((row) => {
            return row.reduce((acc: any, cell, index) => {
                const header = mappedData.headers[index];
                if (header !== null) {
                    if (Object.keys(fieldFormatters).includes(header)) {
                        acc[header] = fieldFormatters[header as keyof typeof fieldFormatters](cell)
                    } else {
                        acc[header] = cell;
                    }
                }
                return acc;
            }, {})
        })

        onSubmit(arrayOfDate)
    }



    return (
        <div className='max-w-screen-2xl mx-auto w-full pb-10 -mt-24'>
            <Card className='border-none drop-shadow-sm'>
                <CardHeader className='gap-y-2 lg:flex lg:flex-row lg:items-center lg:justify-between'>
                    <CardTitle className='text-xl line-clamp-1'>
                        Import Transactions

                    </CardTitle>
                    <div className='flex flex-col lg:flex-row gap-y-2 items-center gap-x-2'>

                        <Button
                            onClick={onCancel}
                            size='sm'
                            className='w-full lg:w-auto'
                        >
                            Cancel
                        </Button>
                        <Button
                            size='sm'
                            disabled={progress < requiredOptions.length}
                            onClick={handleContinue}
                            className='w-full lg:w-auto'
                        >
                            Continue ({progress} / {requiredOptions.length})
                        </Button>

                    </div>

                </CardHeader>
                <CardContent>
                    <ImportTable
                        headers={headers}
                        body={body}
                        selectedColumns={selectedColumns}
                        onTableHeadSelectChange={onTableHeadSelectChange}
                    />
                </CardContent>
            </Card>
        </div>
    )
}