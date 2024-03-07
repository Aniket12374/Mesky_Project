export const defaultValues = {
  longDescription: "",
  howToUse: "",
  ingredients: "",
  dimension: "",
  subCategoryName: [],
  skuId: "",
  categoryName: "",
  name: "",
  tags: [],
  sold_by: "",
  shipped_from: "",
  imagesList: [],
  isActive: true,
  returnable: false,
  stockOut: false,
  videoUrls: [],
};

export const TransformToFormData = (data) => {
  return {
    longDescription: data.long_description,
    howToUse: data.how_to_use,
    ingredients: data.ingredients,
    skuId: data.sku_id,
    categoryName: data.category_name,
    categoryId: data.category_id,
    subCategoryName:
      data.subcategories && data.subcategories.map((cat) => cat.name),
    subcategoryIdList:
      data.subcategories && data.subcategories.map((x) => x.id),
    name: data.name,
    longName: data.name,
    shortName: data.short_name,
    tags: data.tags ? data.tags.map((item) => item.name) : [],
    tagIds: data.tags ? data.tags.map((tag) => Number(tag.id)) : [],
    sold_by: data.product_spec
      ? data.product_spec.sold_by
        ? data.product_spec.sold_by == "None"
          ? ""
          : data.product_spec.sold_by
        : ""
      : "",
    type: data.type ? data.type.name : "",
    typeId: data.type ? data.type.id : "",
    subType: data.subtype ? data.subtype?.name : "",
    subTypeId: data.subtype ? data.subtype.id : "",
    shippedFrom: data.product_spec
      ? data.product_spec.shipped_from
        ? data.product_spec.shipped_from == "None"
          ? ""
          : data.product_spec.shipped_from
        : ""
      : "",
    imagesList:
      data.images_list.length > 0 ? data.images_list : [data.default_image],
    weight: data.product_spec
      ? data.product_spec.weight
        ? Number(data.product_spec.weight)
        : ""
      : "",
    dimension: data.product_spec
      ? data.product_spec.dimension
        ? data.product_spec.dimension == "None"
          ? ""
          : data.product_spec.dimension
        : ""
      : "",
    subCategoryId: data.subcategory_id,
    hashtags: data.hashtags,
    isActive: data.is_active,
    returnable: data.allow_return,
    stockOut: data.quantity === 0,
    hsnCode: data.hsn_code,
    videoUrls: data.video_urls,
  };
};

export const TransformFormData = (data) => {
  return {
    long_description: data.longDescription,
    how_to_use: data.howToUse,
    ingredients: data.ingredients,
    subcategory_name: data.subCategoryName,
    subcategory_id: data.subcategory_id,
    sku_id: data.skuId,
    category_name: data.categoryName,
    category_id: data.categoryId,
    name: data.longName,
    short_name: data.shortName,
    tags: data.tagIds,
    subcategory_id_list: data.subcategoryIdList,
    sold_by: data.sold_by,
    shipped_from: data.shipped_from,
    dimension: data.dimension,
    weight: data.weight,
    type: data.typeId,
    subtype: data.subTypeId,
    images_list: data.imagesList,
    short_description: data.longDescription,
    country_of_origin: "India",
    brand_id: data.brandId,
    allow_return: false,
    is_active: data.isActive,
    allow_return: data.returnable,
    hsn_code: data.hsnCode,
    video_urls: data.videoUrls,
  };
};
