const formatMoney = (money:number) => {
  // const formatter = new Intl.NumberFormat('en-US', {
  //   style: 'currency',
  //   currency: 'USD',
  // });

  // return formatter.format(money)
  return money.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
}

export default formatMoney