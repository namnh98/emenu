export default ConvertFood = (
  arrOrder,
  combo_item_id,
  countRate,
  is_takeaway,
) => {
  const foodNoPrice = arrOrder.map((food) => {
    return {
      item_id: food.id,
      qty: food.count,
      note: food.description,
      is_takeaway,
      price: food?.price || food.sale_price,
    };
  });

  const foodPrice = [
    {
      combo_item_id,
      qty: countRate,
      note: '',
      order_items: foodNoPrice,
    },
  ];
  return [foodNoPrice, foodPrice];
};
