import {Line} from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    TimeScale,
    TimeSeriesScale,
    Tooltip,
    Legend,
    Title,
} from 'chart.js';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    TimeScale,
    TimeSeriesScale,
    Tooltip,
    Legend,
    Title,
);

interface ScheduleProps {
    data: {
        date: string,
        price: string,
    }[];
}


const Schedule: React.FC<ScheduleProps> = ({data}) => {

    const priceData={
        labels: data.map(item => item.date),
        datasets: [
            {
                label: 'Price',
                data: data.map(item => parseFloat(item.price)),
                borderColor: '#46c762', // Цвет линии,
                borderWidth: 4,
                tension: 0.3,
                fill: false
            },
        ],
    };

    return (
        <div style={{
            position: 'relative',
            height: '100%',
            width: '100%',
        }}>
            <Line data={priceData}/>
        </div>);
};

export default Schedule;
