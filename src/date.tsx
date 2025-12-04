export function formatDate(date: Date): string {

    const weekday = new Intl.DateTimeFormat("en-US", { weekday: "long" }).format(date);
    const day = date.getDate();
    const month = new Intl.DateTimeFormat("en-US", { month: "long" }).format(date);
    const year = date.getFullYear();

    return `${weekday}, ${addOrdinal(day)} ${month}, ${year}`;
}

function addOrdinal(n: number): string {
    if (n % 10 == 1 && n % 100 != 11) return `${n}st`;
    if (n % 10 == 2 && n % 100 != 12) return `${n}nd`;
    if (n % 10 == 3 && n % 100 != 13) return `${n}rd`;
    return `${n}th`;
}
