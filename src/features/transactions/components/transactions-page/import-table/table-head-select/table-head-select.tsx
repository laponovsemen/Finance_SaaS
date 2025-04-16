import { cn } from '@/lib/utils';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/src/shared/shadcn/ui/select';
import { log } from 'console';




type Props = {
    columnIndex: number;
    selectedColumns: Record<string, string | null>,
    onChange: (columnIndex: number, value: string | null) => void;

}

const options = [
    'amount',
    'payee',
    'date'
]


export const TableHeadSelect = ({
    columnIndex,
    onChange,
    selectedColumns
}: Props) => {

    const currentSelection = selectedColumns[`column_${columnIndex}`]


    return (
        <Select
            value={currentSelection || ''}
            onValueChange={(value) => onChange(columnIndex, value)}
        >
            <SelectTrigger
                className={
                    cn(
                        'shadow-none focus:ring-offset-0 focus:ring-transparent outline-none border-none bg-transparent capitalize',
                        currentSelection && 'text-blue-500',

                    )
                }
            >
                <SelectValue
                    placeholder={'Skip'}
                />
            </SelectTrigger>
            <SelectContent>
                <SelectItem
                    value='skip'
                >
                    Skip
                </SelectItem>
                {options.map((option, index) => {

                    console.log(selectedColumns, ' selectedColumns')
                    const disabled = Object.values(selectedColumns)
                        .includes(option)
                        && selectedColumns[`column_${columnIndex}`] !== option

                    return (
                        <SelectItem
                            value={option}
                            key={index}
                            disabled={disabled}
                            className='capitalize'
                        >
                            {option}
                        </SelectItem>
                    )
                })}
            </SelectContent>
        </Select>
    )
}