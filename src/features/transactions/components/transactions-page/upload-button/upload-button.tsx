import { Upload } from 'lucide-react';
import { useCSVReader } from 'react-papaparse'

import { Button } from '@/src/shared/shadcn/ui/button';
import { config } from '../../../../../../middleware';
import { cn } from '@/lib/utils';

type Props = {
    onUpload: (results: any) => void;
    className?: string
}

export const UploadButton = ({ onUpload, className }: Props) => {
    const { CSVReader } = useCSVReader();

    //todo : Add a paywall
    return (
        <CSVReader
            onUploadAccepted={onUpload}
            config={{

            }}
        >
            {({ getRootProps }: any) => {

                return (
                    <Button
                        size='sm'
                        className={cn(
                            'w-full lg:w-auto',
                            className
                        )}
                        {...getRootProps()}
                    >
                        <Upload className='size-4 mr-2' />
                        Import
                    </Button>
                )
            }}
        </CSVReader>
    )
}