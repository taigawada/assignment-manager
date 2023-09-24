const dayOfWeekStr = (start: 'monday' | 'sunday' | 0 | 1, index: number) => {
    let shifter = 0;
    if (start === 'monday' || start === 1) {
        shifter = 1;
    }
    switch (index + shifter) {
        case 0:
            return '日';
        case 1:
            return '月';
        case 2:
            return '火';
        case 3:
            return '水';
        case 4:
            return '木';
        case 5:
            return '金';
        case 6:
            return '土';
        case 7:
            return '日';
    }
};
function sortItems(key: string, order: 'asc' | 'desc' = 'asc', escape: string | RegExp = /[-/\\^$*+?#. ()|[\]{}]/g) {
    return (a: any, b: any) => {
        if (!Object.prototype.hasOwnProperty.call(a, key) || !Object.prototype.hasOwnProperty.call(b, key)) {
            return 0;
        }
        const elementA = typeof a[key] === 'string' ? a[key].toUpperCase().replace(escape, '') : a[key];
        const elementB = typeof b[key] === 'string' ? b[key].toUpperCase().replace(escape, '') : b[key];
        let comparison = 0;
        if (elementA > elementB) {
            comparison = 1;
        } else if (elementA < elementB) {
            comparison = -1;
        }
        return order === 'desc' ? comparison * -1 : comparison;
    };
}

export { dayOfWeekStr, sortItems };
