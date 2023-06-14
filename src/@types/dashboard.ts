export type OrderDashboard = {
    date: Date | number | string;
    orders: number;
    pageviews: number;
    paidExcl: number;
    paidIncl: number;
    salesExcl: number;
    salesIncl: number;
    visitors: number;
}