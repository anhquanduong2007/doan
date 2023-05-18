export const currency = (price: number) => {
    const currencyPrice = new Intl.NumberFormat(undefined, { style: 'currency', currency: 'USD' }).format(price)
    return currencyPrice
}