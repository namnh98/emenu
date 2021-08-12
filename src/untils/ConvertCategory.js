export default ConvertCategory = (arrCategory, arrPromotion) => {
  if (!arrCategory.length) return [];

  let categoryAll = {
    id: 'all',
    name: 'Tất cả',
    items: [],
    isDown: true,
  };

  const categories = arrCategory.map((value, index) => {
    const foods = value.items.map((food) => {
      const promotion = arrPromotion.find((pro) => pro.id === food.id);

      const newFood = {
        ...food,
        categoryId: value.id,
        promotion: promotion || null,
      };

      categoryAll.items.push(newFood);
      return newFood;
    });

    return {
      id: value.id,
      name: value.name,
      items: foods,
      isDown: index === 0,
    };
  });

  const arrCate = [categoryAll, ...categories];
  return [categoryAll, arrCate];
};
