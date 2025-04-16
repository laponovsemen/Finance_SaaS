import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/src/shared/shadcn/ui/table';
import { TableHeadSelect } from './table-head-select/table-head-select';


type Props = {
    headers: string[],
    body: string[][];
    selectedColumns: Record<string, string | null>;
    onTableHeadSelectChange: (columnIndex: number, value: string | null) => void;
}
// todo add virtuoso
export const ImportTable = ({
    body,
    headers,
    onTableHeadSelectChange,
    selectedColumns
}: Props) => {

    return (
        <div className='rounded-md border overflow-hidden'>
            <Table>
                <TableHeader className='bg-muted'>
                    <TableRow>
                        {
                            headers.map((_item, index) => (
                                <TableHead key={`import-table-header-${index}`}>
                                    <TableHeadSelect
                                        columnIndex={index}
                                        selectedColumns={selectedColumns}
                                        onChange={onTableHeadSelectChange}
                                    />
                                    {index}
                                </TableHead>
                            ))
                        }
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {
                        body.map((row: string[], index) => {
                            return (
                                <TableRow
                                    key={`import-table-row-${index}`}
                                >
                                    {row.map((cell, index) => (
                                        <TableCell
                                            key={`import-table-row-cell-${index}`}

                                        >
                                            {cell}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            )

                        })
                    }
                </TableBody>
            </Table>

        </div>
    )
}