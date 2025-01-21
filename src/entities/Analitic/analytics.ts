// utils/analytics.ts
interface AnalyticsData {
    id: number;
    username: string;
    days: {
        date: string;
        events: {
            nameItem: string;
            count: string;
            type: string;
        }[];
    }[];
}

interface AnalyticsResult {
    period: string;
    added: string[];
    removed: string[];
}

function analyzeData(data: AnalyticsData, daysCount: number): AnalyticsResult {
    const added = data.days.reduce((acc, day) => {
        const filteredEvents = day.events.filter(event => event.type === 'add');
        const filteredEventsCount = filteredEvents.map(event => ({ name: event.nameItem, count: event.count }));
        return [...acc, ...filteredEventsCount];
    }, []);

    const removed = data.days.reduce((acc, day) => {
        const filteredEvents = day.events.filter(event => event.type === 'delete');
        const filteredEventsCount = filteredEvents.map(event => ({ name: event.nameItem, count: event.count }));
        return [...acc, ...filteredEventsCount];
    }, []);

    const startDate = data.days[0].date;
    const endDate = data.days[data.days.length - 1].date;
    const period = `В период с ${startDate} по ${endDate} (${getPeriod(startDate, endDate)})`;

    const filteredAdded = added.filter(item => item.count >= daysCount);
    const filteredRemoved = removed.filter(item => item.count >= daysCount);

    return {
        period,
        added: filteredAdded.map(item => `Добавлено: ${item.name} - ${item.count} ${getUnit(item.count)}`),
        removed: filteredRemoved.map(item => `Удалено: ${item.name} - ${item.count} ${getUnit(item.count)}`),
    };
}

function getPeriod(startDate: string, endDate: string): string {
    const startDateParts = startDate.split('.');
    const endDateParts = endDate.split('.');
    const startDateDate = new Date(startDateParts[2], startDateParts[1] - 1, startDateParts[0]);
    const endDateDate = new Date(endDateParts[2], endDateParts[1] - 1, endDateParts[0]);

    const differenceInDays = Math.abs((endDateDate.getTime() - startDateDate.getTime()) / (1000 * 60 * 60 * 24));

    if (differenceInDays === 7) {
        return 'неделю';
    } else if (differenceInDays > 7 && differenceInDays <= 30) {
        return `${Math.floor(differenceInDays / 7)} недели`;
    } else {
        return `${Math.floor(differenceInDays / 30)} месяцев`;
    }
}

function getUnit(quantity: number): string {
    if (quantity === 1) {
        return 'бутылку';
    } else {
        return 'бутылок';
    }
}

export default analyzeData;
