import { formatPercentage } from '@/lib/utils';
import { Cell, Legend, Pie, PieChart, PolarAngleAxis, PolarGrid, PolarRadiusAxis, Radar, RadarChart, ResponsiveContainer, Tooltip } from 'recharts';
import { CategoryTooltip } from '../category-tooltip/category-tooltip';


type Props = {
    data?: {
        name: string;
        value: number;
    }[]
}


const COLORS = ['#0062FF', '#12C6FF', '$FF647F', '#FF9354']

export const RadarVariant = ({
    data
}: Props) => {

    return (
        <ResponsiveContainer width='100%' height={350}>

            <RadarChart
                data={data}
                cx='50%'
                cy='50%'
                outerRadius={90}
            >
                <PolarGrid />
                <PolarAngleAxis style={{ fontSize: '12px' }} dataKey='name' />
                <PolarRadiusAxis style={{ fontSize: '12px' }} />
                <Radar dataKey='value' stroke='#8884d8' fill='#8884d8' fillOpacity={0.6} />
            </RadarChart>


        </ResponsiveContainer >
    )
}