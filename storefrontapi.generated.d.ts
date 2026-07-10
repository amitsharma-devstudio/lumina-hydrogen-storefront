/* eslint-disable eslint-comments/disable-enable-pair */
/* eslint-disable eslint-comments/no-unlimited-disable */
/* eslint-disable */
import type * as StorefrontAPI from '@shopify/hydrogen/storefront-api-types';

export type FeaturedCollectionFragment = Pick<
  StorefrontAPI.Collection,
  'id' | 'title' | 'handle'
> & {
  image?: StorefrontAPI.Maybe<
    Pick<StorefrontAPI.Image, 'id' | 'url' | 'altText' | 'width' | 'height'>
  >;
  products: {
    nodes: Array<{
      featuredImage?: StorefrontAPI.Maybe<
        Pick<StorefrontAPI.Image, 'id' | 'url' | 'altText' | 'width' | 'height'>
      >;
      images: {
        nodes: Array<
          Pick<
            StorefrontAPI.Image,
            'id' | 'url' | 'altText' | 'width' | 'height'
          >
        >;
      };
    }>;
  };
};

export type ImageFieldsFragment = Pick<
  StorefrontAPI.Image,
  'url' | 'altText' | 'width' | 'height'
>;

export type MoneyFieldsFragment = Pick<
  StorefrontAPI.MoneyV2,
  'amount' | 'currencyCode'
>;

export type ProductBaseFieldsFragment = Pick<
  StorefrontAPI.Product,
  | 'id'
  | 'title'
  | 'vendor'
  | 'handle'
  | 'description'
  | 'descriptionHtml'
  | 'encodedVariantExistence'
  | 'encodedVariantAvailability'
> & {
  adjacentVariants: Array<
    Pick<
      StorefrontAPI.ProductVariant,
      'id' | 'title' | 'availableForSale' | 'quantityAvailable'
    > & {
      selectedOptions: Array<
        Pick<StorefrontAPI.SelectedOption, 'name' | 'value'>
      >;
      price: Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>;
      product: Pick<StorefrontAPI.Product, 'handle'>;
    }
  >;
  options: Array<
    Pick<StorefrontAPI.ProductOption, 'name'> & {
      optionValues: Array<
        Pick<StorefrontAPI.ProductOptionValue, 'name'> & {
          firstSelectableVariant?: StorefrontAPI.Maybe<
            Pick<
              StorefrontAPI.ProductVariant,
              'id' | 'title' | 'availableForSale' | 'quantityAvailable'
            > & {
              selectedOptions: Array<
                Pick<StorefrontAPI.SelectedOption, 'name' | 'value'>
              >;
              price: Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>;
              product: Pick<StorefrontAPI.Product, 'handle'>;
            }
          >;
        }
      >;
    }
  >;
};

export type ProductCardFragment = Pick<
  StorefrontAPI.Product,
  'id' | 'handle' | 'title' | 'tags' | 'availableForSale'
> & {
  featuredImage?: StorefrontAPI.Maybe<
    Pick<StorefrontAPI.Image, 'id' | 'altText' | 'url' | 'width' | 'height'>
  >;
  images: {
    nodes: Array<
      Pick<StorefrontAPI.Image, 'id' | 'altText' | 'url' | 'width' | 'height'>
    >;
  };
  priceRange: {
    minVariantPrice: Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>;
    maxVariantPrice: Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>;
  };
};

export type RecommendedProductFragment = Pick<
  StorefrontAPI.Product,
  'id' | 'title' | 'handle' | 'tags'
> & {
  priceRange: {
    minVariantPrice: Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>;
  };
  featuredImage?: StorefrontAPI.Maybe<
    Pick<StorefrontAPI.Image, 'id' | 'url' | 'altText' | 'width' | 'height'>
  >;
  images: {
    nodes: Array<
      Pick<StorefrontAPI.Image, 'id' | 'url' | 'altText' | 'width' | 'height'>
    >;
  };
};

export type RoutineProductFieldsFragment = Pick<
  StorefrontAPI.Product,
  'id' | 'handle' | 'title'
> & {
  featuredImage?: StorefrontAPI.Maybe<
    Pick<StorefrontAPI.Image, 'id' | 'url' | 'altText' | 'width' | 'height'>
  >;
  priceRange: {
    minVariantPrice: Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>;
  };
  step?: StorefrontAPI.Maybe<Pick<StorefrontAPI.Metafield, 'value'>>;
  skinCare?: StorefrontAPI.Maybe<{
    reference?: StorefrontAPI.Maybe<
      Pick<StorefrontAPI.Metaobject, 'id' | 'type'> & {
        fields: Array<Pick<StorefrontAPI.MetaobjectField, 'key' | 'value'>>;
      }
    >;
  }>;
};

export type MetaobjectFieldsFragment = Pick<
  StorefrontAPI.Metaobject,
  'id' | 'type'
> & {fields: Array<Pick<StorefrontAPI.MetaobjectField, 'key' | 'value'>>};

export type SkincareProductFragment = {
  heroClaim?: StorefrontAPI.Maybe<
    Pick<StorefrontAPI.Metafield, 'id' | 'type' | 'value'>
  >;
  howToUse?: StorefrontAPI.Maybe<
    Pick<StorefrontAPI.Metafield, 'id' | 'type' | 'value'>
  >;
  fullIngredients?: StorefrontAPI.Maybe<
    Pick<StorefrontAPI.Metafield, 'id' | 'type' | 'value'>
  >;
  shippingAndReturns?: StorefrontAPI.Maybe<
    Pick<StorefrontAPI.Metafield, 'id' | 'type' | 'value'>
  >;
  amPm?: StorefrontAPI.Maybe<
    Pick<StorefrontAPI.Metafield, 'id' | 'type' | 'value'>
  >;
  safeWith?: StorefrontAPI.Maybe<{
    references?: StorefrontAPI.Maybe<{
      nodes: Array<
        Pick<StorefrontAPI.Metaobject, 'id' | 'type'> & {
          fields: Array<Pick<StorefrontAPI.MetaobjectField, 'key' | 'value'>>;
        }
      >;
    }>;
  }>;
  avoidWith?: StorefrontAPI.Maybe<{
    references?: StorefrontAPI.Maybe<{
      nodes: Array<
        Pick<StorefrontAPI.Metaobject, 'id' | 'type'> & {
          fields: Array<Pick<StorefrontAPI.MetaobjectField, 'key' | 'value'>>;
        }
      >;
    }>;
  }>;
  productBenefits?: StorefrontAPI.Maybe<{
    references?: StorefrontAPI.Maybe<{
      nodes: Array<
        Pick<StorefrontAPI.Metaobject, 'id' | 'type'> & {
          fields: Array<Pick<StorefrontAPI.MetaobjectField, 'key' | 'value'>>;
        }
      >;
    }>;
  }>;
  reviewCount?: StorefrontAPI.Maybe<
    Pick<StorefrontAPI.Metafield, 'id' | 'type' | 'value'>
  >;
  rating?: StorefrontAPI.Maybe<
    Pick<StorefrontAPI.Metafield, 'id' | 'type' | 'value'>
  >;
  step?: StorefrontAPI.Maybe<
    Pick<StorefrontAPI.Metafield, 'id' | 'type' | 'value'>
  >;
  skinTypes?: StorefrontAPI.Maybe<{
    references?: StorefrontAPI.Maybe<{
      nodes: Array<
        Pick<StorefrontAPI.Metaobject, 'id' | 'type'> & {
          fields: Array<Pick<StorefrontAPI.MetaobjectField, 'key' | 'value'>>;
        }
      >;
    }>;
  }>;
  skinCare?: StorefrontAPI.Maybe<{
    reference?: StorefrontAPI.Maybe<
      Pick<StorefrontAPI.Metaobject, 'id' | 'type'> & {
        fields: Array<Pick<StorefrontAPI.MetaobjectField, 'key' | 'value'>>;
      }
    >;
  }>;
  ingredients?: StorefrontAPI.Maybe<{
    references?: StorefrontAPI.Maybe<{
      nodes: Array<
        Pick<StorefrontAPI.Metaobject, 'id' | 'type'> & {
          fields: Array<Pick<StorefrontAPI.MetaobjectField, 'key' | 'value'>>;
        }
      >;
    }>;
  }>;
  regimen?: StorefrontAPI.Maybe<{
    reference?: StorefrontAPI.Maybe<
      Pick<StorefrontAPI.Metaobject, 'id' | 'type' | 'handle'> & {
        fields: Array<
          Pick<StorefrontAPI.MetaobjectField, 'key' | 'value'> & {
            references?: StorefrontAPI.Maybe<{
              nodes: Array<
                Pick<StorefrontAPI.Product, 'id' | 'handle' | 'title'> & {
                  featuredImage?: StorefrontAPI.Maybe<
                    Pick<
                      StorefrontAPI.Image,
                      'id' | 'url' | 'altText' | 'width' | 'height'
                    >
                  >;
                  priceRange: {
                    minVariantPrice: Pick<
                      StorefrontAPI.MoneyV2,
                      'amount' | 'currencyCode'
                    >;
                  };
                  step?: StorefrontAPI.Maybe<
                    Pick<StorefrontAPI.Metafield, 'value'>
                  >;
                  skinCare?: StorefrontAPI.Maybe<{
                    reference?: StorefrontAPI.Maybe<
                      Pick<StorefrontAPI.Metaobject, 'id' | 'type'> & {
                        fields: Array<
                          Pick<StorefrontAPI.MetaobjectField, 'key' | 'value'>
                        >;
                      }
                    >;
                  }>;
                }
              >;
            }>;
          }
        >;
      }
    >;
  }>;
  routineProducts?: StorefrontAPI.Maybe<{
    references?: StorefrontAPI.Maybe<{
      nodes: Array<
        Pick<StorefrontAPI.Product, 'id' | 'handle' | 'title'> & {
          featuredImage?: StorefrontAPI.Maybe<
            Pick<
              StorefrontAPI.Image,
              'id' | 'url' | 'altText' | 'width' | 'height'
            >
          >;
          priceRange: {
            minVariantPrice: Pick<
              StorefrontAPI.MoneyV2,
              'amount' | 'currencyCode'
            >;
          };
          step?: StorefrontAPI.Maybe<Pick<StorefrontAPI.Metafield, 'value'>>;
          skinCare?: StorefrontAPI.Maybe<{
            reference?: StorefrontAPI.Maybe<
              Pick<StorefrontAPI.Metaobject, 'id' | 'type'> & {
                fields: Array<
                  Pick<StorefrontAPI.MetaobjectField, 'key' | 'value'>
                >;
              }
            >;
          }>;
        }
      >;
    }>;
  }>;
};

export type VariantFieldsFragment = Pick<
  StorefrontAPI.ProductVariant,
  'id' | 'title' | 'availableForSale' | 'quantityAvailable'
> & {
  selectedOptions: Array<Pick<StorefrontAPI.SelectedOption, 'name' | 'value'>>;
  price: Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>;
  product: Pick<StorefrontAPI.Product, 'handle'>;
};

export type BestsellersProductsQueryVariables = StorefrontAPI.Exact<{
  country?: StorefrontAPI.InputMaybe<StorefrontAPI.CountryCode>;
  language?: StorefrontAPI.InputMaybe<StorefrontAPI.LanguageCode>;
  handle: StorefrontAPI.Scalars['String']['input'];
}>;

export type BestsellersProductsQuery = {
  collection?: StorefrontAPI.Maybe<
    Pick<StorefrontAPI.Collection, 'id' | 'title' | 'handle'> & {
      products: {
        nodes: Array<
          Pick<StorefrontAPI.Product, 'id' | 'title' | 'handle' | 'tags'> & {
            priceRange: {
              minVariantPrice: Pick<
                StorefrontAPI.MoneyV2,
                'amount' | 'currencyCode'
              >;
            };
            featuredImage?: StorefrontAPI.Maybe<
              Pick<
                StorefrontAPI.Image,
                'id' | 'url' | 'altText' | 'width' | 'height'
              >
            >;
            images: {
              nodes: Array<
                Pick<
                  StorefrontAPI.Image,
                  'id' | 'url' | 'altText' | 'width' | 'height'
                >
              >;
            };
          }
        >;
      };
    }
  >;
};

export type CatalogProductsQueryVariables = StorefrontAPI.Exact<{
  country?: StorefrontAPI.InputMaybe<StorefrontAPI.CountryCode>;
  language?: StorefrontAPI.InputMaybe<StorefrontAPI.LanguageCode>;
  sortKey?: StorefrontAPI.InputMaybe<StorefrontAPI.ProductSortKeys>;
  reverse?: StorefrontAPI.InputMaybe<StorefrontAPI.Scalars['Boolean']['input']>;
  first?: StorefrontAPI.InputMaybe<StorefrontAPI.Scalars['Int']['input']>;
  last?: StorefrontAPI.InputMaybe<StorefrontAPI.Scalars['Int']['input']>;
  startCursor?: StorefrontAPI.InputMaybe<
    StorefrontAPI.Scalars['String']['input']
  >;
  endCursor?: StorefrontAPI.InputMaybe<
    StorefrontAPI.Scalars['String']['input']
  >;
}>;

export type CatalogProductsQuery = {
  products: {
    nodes: Array<
      Pick<
        StorefrontAPI.Product,
        'id' | 'handle' | 'title' | 'tags' | 'availableForSale'
      > & {
        featuredImage?: StorefrontAPI.Maybe<
          Pick<
            StorefrontAPI.Image,
            'id' | 'altText' | 'url' | 'width' | 'height'
          >
        >;
        images: {
          nodes: Array<
            Pick<
              StorefrontAPI.Image,
              'id' | 'altText' | 'url' | 'width' | 'height'
            >
          >;
        };
        priceRange: {
          minVariantPrice: Pick<
            StorefrontAPI.MoneyV2,
            'amount' | 'currencyCode'
          >;
          maxVariantPrice: Pick<
            StorefrontAPI.MoneyV2,
            'amount' | 'currencyCode'
          >;
        };
      }
    >;
    pageInfo: Pick<
      StorefrontAPI.PageInfo,
      'hasPreviousPage' | 'hasNextPage' | 'endCursor' | 'startCursor'
    >;
  };
};

export type CollectionProductsQueryVariables = StorefrontAPI.Exact<{
  handle: StorefrontAPI.Scalars['String']['input'];
  country?: StorefrontAPI.InputMaybe<StorefrontAPI.CountryCode>;
  language?: StorefrontAPI.InputMaybe<StorefrontAPI.LanguageCode>;
  sortKey?: StorefrontAPI.InputMaybe<StorefrontAPI.ProductCollectionSortKeys>;
  reverse?: StorefrontAPI.InputMaybe<StorefrontAPI.Scalars['Boolean']['input']>;
  first?: StorefrontAPI.InputMaybe<StorefrontAPI.Scalars['Int']['input']>;
  last?: StorefrontAPI.InputMaybe<StorefrontAPI.Scalars['Int']['input']>;
  startCursor?: StorefrontAPI.InputMaybe<
    StorefrontAPI.Scalars['String']['input']
  >;
  endCursor?: StorefrontAPI.InputMaybe<
    StorefrontAPI.Scalars['String']['input']
  >;
  filters?: StorefrontAPI.InputMaybe<
    Array<StorefrontAPI.ProductFilter> | StorefrontAPI.ProductFilter
  >;
}>;

export type CollectionProductsQuery = {
  collection?: StorefrontAPI.Maybe<
    Pick<
      StorefrontAPI.Collection,
      'id' | 'handle' | 'title' | 'description'
    > & {
      image?: StorefrontAPI.Maybe<
        Pick<StorefrontAPI.Image, 'id' | 'url' | 'altText' | 'width' | 'height'>
      >;
      products: {
        nodes: Array<
          Pick<
            StorefrontAPI.Product,
            'id' | 'handle' | 'title' | 'tags' | 'availableForSale'
          > & {
            featuredImage?: StorefrontAPI.Maybe<
              Pick<
                StorefrontAPI.Image,
                'id' | 'altText' | 'url' | 'width' | 'height'
              >
            >;
            images: {
              nodes: Array<
                Pick<
                  StorefrontAPI.Image,
                  'id' | 'altText' | 'url' | 'width' | 'height'
                >
              >;
            };
            priceRange: {
              minVariantPrice: Pick<
                StorefrontAPI.MoneyV2,
                'amount' | 'currencyCode'
              >;
              maxVariantPrice: Pick<
                StorefrontAPI.MoneyV2,
                'amount' | 'currencyCode'
              >;
            };
          }
        >;
        filters: Array<
          Pick<StorefrontAPI.Filter, 'id' | 'label' | 'type'> & {
            values: Array<
              Pick<
                StorefrontAPI.FilterValue,
                'id' | 'label' | 'count' | 'input'
              >
            >;
          }
        >;
        pageInfo: Pick<
          StorefrontAPI.PageInfo,
          'hasPreviousPage' | 'hasNextPage' | 'endCursor' | 'startCursor'
        >;
      };
    }
  >;
};

export type FeaturedCollectionsQueryVariables = StorefrontAPI.Exact<{
  country?: StorefrontAPI.InputMaybe<StorefrontAPI.CountryCode>;
  language?: StorefrontAPI.InputMaybe<StorefrontAPI.LanguageCode>;
  first?: StorefrontAPI.InputMaybe<StorefrontAPI.Scalars['Int']['input']>;
}>;

export type FeaturedCollectionsQuery = {
  collections: {
    nodes: Array<
      Pick<StorefrontAPI.Collection, 'id' | 'title' | 'handle'> & {
        image?: StorefrontAPI.Maybe<
          Pick<
            StorefrontAPI.Image,
            'id' | 'url' | 'altText' | 'width' | 'height'
          >
        >;
        products: {
          nodes: Array<{
            featuredImage?: StorefrontAPI.Maybe<
              Pick<
                StorefrontAPI.Image,
                'id' | 'url' | 'altText' | 'width' | 'height'
              >
            >;
            images: {
              nodes: Array<
                Pick<
                  StorefrontAPI.Image,
                  'id' | 'url' | 'altText' | 'width' | 'height'
                >
              >;
            };
          }>;
        };
      }
    >;
  };
};

export type HomeHeroMetaobjectQueryVariables = StorefrontAPI.Exact<{
  country?: StorefrontAPI.InputMaybe<StorefrontAPI.CountryCode>;
  language?: StorefrontAPI.InputMaybe<StorefrontAPI.LanguageCode>;
  type: StorefrontAPI.Scalars['String']['input'];
}>;

export type HomeHeroMetaobjectQuery = {
  metaobjects: {
    nodes: Array<
      Pick<StorefrontAPI.Metaobject, 'id' | 'type' | 'handle'> & {
        fields: Array<
          Pick<StorefrontAPI.MetaobjectField, 'key' | 'value'> & {
            reference?: StorefrontAPI.Maybe<
              | {
                  __typename:
                    | 'Article'
                    | 'Collection'
                    | 'GenericFile'
                    | 'Metaobject'
                    | 'Model3d'
                    | 'Page'
                    | 'Product'
                    | 'ProductVariant'
                    | 'Video';
                }
              | ({__typename: 'MediaImage'} & Pick<
                  StorefrontAPI.MediaImage,
                  'id'
                > & {
                    image?: StorefrontAPI.Maybe<
                      Pick<
                        StorefrontAPI.Image,
                        'id' | 'url' | 'altText' | 'width' | 'height'
                      >
                    >;
                  })
            >;
            references?: StorefrontAPI.Maybe<{
              nodes: Array<
                | {
                    __typename:
                      | 'Article'
                      | 'Collection'
                      | 'GenericFile'
                      | 'MediaImage'
                      | 'Model3d'
                      | 'Page'
                      | 'Product'
                      | 'ProductVariant'
                      | 'Video';
                  }
                | ({__typename: 'Metaobject'} & Pick<
                    StorefrontAPI.Metaobject,
                    'id' | 'type'
                  > & {
                      fields: Array<
                        Pick<StorefrontAPI.MetaobjectField, 'key' | 'value'> & {
                          reference?: StorefrontAPI.Maybe<
                            | {
                                __typename:
                                  | 'Article'
                                  | 'Collection'
                                  | 'GenericFile'
                                  | 'MediaImage'
                                  | 'Metaobject'
                                  | 'Model3d'
                                  | 'Page'
                                  | 'ProductVariant'
                                  | 'Video';
                              }
                            | ({__typename: 'Product'} & Pick<
                                StorefrontAPI.Product,
                                'id' | 'handle' | 'title'
                              > & {
                                  featuredImage?: StorefrontAPI.Maybe<
                                    Pick<
                                      StorefrontAPI.Image,
                                      | 'id'
                                      | 'url'
                                      | 'altText'
                                      | 'width'
                                      | 'height'
                                    >
                                  >;
                                  priceRange: {
                                    minVariantPrice: Pick<
                                      StorefrontAPI.MoneyV2,
                                      'amount' | 'currencyCode'
                                    >;
                                  };
                                })
                          >;
                        }
                      >;
                    })
              >;
            }>;
          }
        >;
      }
    >;
  };
};

export type HomePromoBannersQueryVariables = StorefrontAPI.Exact<{
  country?: StorefrontAPI.InputMaybe<StorefrontAPI.CountryCode>;
  language?: StorefrontAPI.InputMaybe<StorefrontAPI.LanguageCode>;
  type: StorefrontAPI.Scalars['String']['input'];
  first: StorefrontAPI.Scalars['Int']['input'];
}>;

export type HomePromoBannersQuery = {
  metaobjects: {
    nodes: Array<
      Pick<StorefrontAPI.Metaobject, 'id' | 'type' | 'handle'> & {
        fields: Array<
          Pick<StorefrontAPI.MetaobjectField, 'key' | 'value'> & {
            reference?: StorefrontAPI.Maybe<
              | {
                  __typename:
                    | 'Article'
                    | 'Collection'
                    | 'GenericFile'
                    | 'Metaobject'
                    | 'Model3d'
                    | 'Page'
                    | 'Product'
                    | 'ProductVariant'
                    | 'Video';
                }
              | ({__typename: 'MediaImage'} & Pick<
                  StorefrontAPI.MediaImage,
                  'id'
                > & {
                    image?: StorefrontAPI.Maybe<
                      Pick<
                        StorefrontAPI.Image,
                        'id' | 'url' | 'altText' | 'width' | 'height'
                      >
                    >;
                  })
            >;
          }
        >;
      }
    >;
  };
};

export type ProductByHandleQueryVariables = StorefrontAPI.Exact<{
  handle: StorefrontAPI.Scalars['String']['input'];
  selectedOptions:
    | Array<StorefrontAPI.SelectedOptionInput>
    | StorefrontAPI.SelectedOptionInput;
  country?: StorefrontAPI.InputMaybe<StorefrontAPI.CountryCode>;
  language?: StorefrontAPI.InputMaybe<StorefrontAPI.LanguageCode>;
}>;

export type ProductByHandleQuery = {
  product?: StorefrontAPI.Maybe<
    Pick<
      StorefrontAPI.Product,
      | 'id'
      | 'title'
      | 'vendor'
      | 'handle'
      | 'description'
      | 'descriptionHtml'
      | 'encodedVariantExistence'
      | 'encodedVariantAvailability'
    > & {
      selectedOrFirstAvailableVariant?: StorefrontAPI.Maybe<
        Pick<
          StorefrontAPI.ProductVariant,
          'id' | 'title' | 'availableForSale' | 'quantityAvailable'
        > & {
          selectedOptions: Array<
            Pick<StorefrontAPI.SelectedOption, 'name' | 'value'>
          >;
          price: Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>;
          product: Pick<StorefrontAPI.Product, 'handle'>;
        }
      >;
      variants: {
        nodes: Array<
          Pick<
            StorefrontAPI.ProductVariant,
            'id' | 'title' | 'availableForSale' | 'quantityAvailable'
          > & {
            selectedOptions: Array<
              Pick<StorefrontAPI.SelectedOption, 'name' | 'value'>
            >;
            price: Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>;
            product: Pick<StorefrontAPI.Product, 'handle'>;
          }
        >;
      };
      images: {
        nodes: Array<
          Pick<StorefrontAPI.Image, 'url' | 'altText' | 'width' | 'height'>
        >;
      };
      adjacentVariants: Array<
        Pick<
          StorefrontAPI.ProductVariant,
          'id' | 'title' | 'availableForSale' | 'quantityAvailable'
        > & {
          selectedOptions: Array<
            Pick<StorefrontAPI.SelectedOption, 'name' | 'value'>
          >;
          price: Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>;
          product: Pick<StorefrontAPI.Product, 'handle'>;
        }
      >;
      options: Array<
        Pick<StorefrontAPI.ProductOption, 'name'> & {
          optionValues: Array<
            Pick<StorefrontAPI.ProductOptionValue, 'name'> & {
              firstSelectableVariant?: StorefrontAPI.Maybe<
                Pick<
                  StorefrontAPI.ProductVariant,
                  'id' | 'title' | 'availableForSale' | 'quantityAvailable'
                > & {
                  selectedOptions: Array<
                    Pick<StorefrontAPI.SelectedOption, 'name' | 'value'>
                  >;
                  price: Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>;
                  product: Pick<StorefrontAPI.Product, 'handle'>;
                }
              >;
            }
          >;
        }
      >;
      heroClaim?: StorefrontAPI.Maybe<
        Pick<StorefrontAPI.Metafield, 'id' | 'type' | 'value'>
      >;
      howToUse?: StorefrontAPI.Maybe<
        Pick<StorefrontAPI.Metafield, 'id' | 'type' | 'value'>
      >;
      fullIngredients?: StorefrontAPI.Maybe<
        Pick<StorefrontAPI.Metafield, 'id' | 'type' | 'value'>
      >;
      shippingAndReturns?: StorefrontAPI.Maybe<
        Pick<StorefrontAPI.Metafield, 'id' | 'type' | 'value'>
      >;
      amPm?: StorefrontAPI.Maybe<
        Pick<StorefrontAPI.Metafield, 'id' | 'type' | 'value'>
      >;
      safeWith?: StorefrontAPI.Maybe<{
        references?: StorefrontAPI.Maybe<{
          nodes: Array<
            Pick<StorefrontAPI.Metaobject, 'id' | 'type'> & {
              fields: Array<
                Pick<StorefrontAPI.MetaobjectField, 'key' | 'value'>
              >;
            }
          >;
        }>;
      }>;
      avoidWith?: StorefrontAPI.Maybe<{
        references?: StorefrontAPI.Maybe<{
          nodes: Array<
            Pick<StorefrontAPI.Metaobject, 'id' | 'type'> & {
              fields: Array<
                Pick<StorefrontAPI.MetaobjectField, 'key' | 'value'>
              >;
            }
          >;
        }>;
      }>;
      productBenefits?: StorefrontAPI.Maybe<{
        references?: StorefrontAPI.Maybe<{
          nodes: Array<
            Pick<StorefrontAPI.Metaobject, 'id' | 'type'> & {
              fields: Array<
                Pick<StorefrontAPI.MetaobjectField, 'key' | 'value'>
              >;
            }
          >;
        }>;
      }>;
      reviewCount?: StorefrontAPI.Maybe<
        Pick<StorefrontAPI.Metafield, 'id' | 'type' | 'value'>
      >;
      rating?: StorefrontAPI.Maybe<
        Pick<StorefrontAPI.Metafield, 'id' | 'type' | 'value'>
      >;
      step?: StorefrontAPI.Maybe<
        Pick<StorefrontAPI.Metafield, 'id' | 'type' | 'value'>
      >;
      skinTypes?: StorefrontAPI.Maybe<{
        references?: StorefrontAPI.Maybe<{
          nodes: Array<
            Pick<StorefrontAPI.Metaobject, 'id' | 'type'> & {
              fields: Array<
                Pick<StorefrontAPI.MetaobjectField, 'key' | 'value'>
              >;
            }
          >;
        }>;
      }>;
      skinCare?: StorefrontAPI.Maybe<{
        reference?: StorefrontAPI.Maybe<
          Pick<StorefrontAPI.Metaobject, 'id' | 'type'> & {
            fields: Array<Pick<StorefrontAPI.MetaobjectField, 'key' | 'value'>>;
          }
        >;
      }>;
      ingredients?: StorefrontAPI.Maybe<{
        references?: StorefrontAPI.Maybe<{
          nodes: Array<
            Pick<StorefrontAPI.Metaobject, 'id' | 'type'> & {
              fields: Array<
                Pick<StorefrontAPI.MetaobjectField, 'key' | 'value'>
              >;
            }
          >;
        }>;
      }>;
      regimen?: StorefrontAPI.Maybe<{
        reference?: StorefrontAPI.Maybe<
          Pick<StorefrontAPI.Metaobject, 'id' | 'type' | 'handle'> & {
            fields: Array<
              Pick<StorefrontAPI.MetaobjectField, 'key' | 'value'> & {
                references?: StorefrontAPI.Maybe<{
                  nodes: Array<
                    Pick<StorefrontAPI.Product, 'id' | 'handle' | 'title'> & {
                      featuredImage?: StorefrontAPI.Maybe<
                        Pick<
                          StorefrontAPI.Image,
                          'id' | 'url' | 'altText' | 'width' | 'height'
                        >
                      >;
                      priceRange: {
                        minVariantPrice: Pick<
                          StorefrontAPI.MoneyV2,
                          'amount' | 'currencyCode'
                        >;
                      };
                      step?: StorefrontAPI.Maybe<
                        Pick<StorefrontAPI.Metafield, 'value'>
                      >;
                      skinCare?: StorefrontAPI.Maybe<{
                        reference?: StorefrontAPI.Maybe<
                          Pick<StorefrontAPI.Metaobject, 'id' | 'type'> & {
                            fields: Array<
                              Pick<
                                StorefrontAPI.MetaobjectField,
                                'key' | 'value'
                              >
                            >;
                          }
                        >;
                      }>;
                    }
                  >;
                }>;
              }
            >;
          }
        >;
      }>;
      routineProducts?: StorefrontAPI.Maybe<{
        references?: StorefrontAPI.Maybe<{
          nodes: Array<
            Pick<StorefrontAPI.Product, 'id' | 'handle' | 'title'> & {
              featuredImage?: StorefrontAPI.Maybe<
                Pick<
                  StorefrontAPI.Image,
                  'id' | 'url' | 'altText' | 'width' | 'height'
                >
              >;
              priceRange: {
                minVariantPrice: Pick<
                  StorefrontAPI.MoneyV2,
                  'amount' | 'currencyCode'
                >;
              };
              step?: StorefrontAPI.Maybe<
                Pick<StorefrontAPI.Metafield, 'value'>
              >;
              skinCare?: StorefrontAPI.Maybe<{
                reference?: StorefrontAPI.Maybe<
                  Pick<StorefrontAPI.Metaobject, 'id' | 'type'> & {
                    fields: Array<
                      Pick<StorefrontAPI.MetaobjectField, 'key' | 'value'>
                    >;
                  }
                >;
              }>;
            }
          >;
        }>;
      }>;
    }
  >;
};

export type ProductRecommendationsQueryVariables = StorefrontAPI.Exact<{
  productId: StorefrontAPI.Scalars['ID']['input'];
  country?: StorefrontAPI.InputMaybe<StorefrontAPI.CountryCode>;
  language?: StorefrontAPI.InputMaybe<StorefrontAPI.LanguageCode>;
}>;

export type ProductRecommendationsQuery = {
  productRecommendations?: StorefrontAPI.Maybe<
    Array<
      Pick<StorefrontAPI.Product, 'id' | 'title' | 'handle' | 'tags'> & {
        priceRange: {
          minVariantPrice: Pick<
            StorefrontAPI.MoneyV2,
            'amount' | 'currencyCode'
          >;
        };
        featuredImage?: StorefrontAPI.Maybe<
          Pick<
            StorefrontAPI.Image,
            'id' | 'url' | 'altText' | 'width' | 'height'
          >
        >;
        images: {
          nodes: Array<
            Pick<
              StorefrontAPI.Image,
              'id' | 'url' | 'altText' | 'width' | 'height'
            >
          >;
        };
      }
    >
  >;
};

export type RoutineCollectionProductsQueryVariables = StorefrontAPI.Exact<{
  country?: StorefrontAPI.InputMaybe<StorefrontAPI.CountryCode>;
  language?: StorefrontAPI.InputMaybe<StorefrontAPI.LanguageCode>;
  handle: StorefrontAPI.Scalars['String']['input'];
  first: StorefrontAPI.Scalars['Int']['input'];
}>;

export type RoutineCollectionProductsQuery = {
  collection?: StorefrontAPI.Maybe<
    Pick<StorefrontAPI.Collection, 'id' | 'handle' | 'title'> & {
      products: {
        nodes: Array<
          Pick<StorefrontAPI.Product, 'id' | 'title' | 'handle' | 'tags'> & {
            routineStepType?: StorefrontAPI.Maybe<
              Pick<StorefrontAPI.Metafield, 'value'>
            >;
            firstVariant: {
              nodes: Array<
                Pick<StorefrontAPI.ProductVariant, 'id' | 'availableForSale'>
              >;
            };
            priceRange: {
              minVariantPrice: Pick<
                StorefrontAPI.MoneyV2,
                'amount' | 'currencyCode'
              >;
            };
            featuredImage?: StorefrontAPI.Maybe<
              Pick<
                StorefrontAPI.Image,
                'id' | 'url' | 'altText' | 'width' | 'height'
              >
            >;
            images: {
              nodes: Array<
                Pick<
                  StorefrontAPI.Image,
                  'id' | 'url' | 'altText' | 'width' | 'height'
                >
              >;
            };
          }
        >;
      };
    }
  >;
};

export type MoneyFragment = Pick<
  StorefrontAPI.MoneyV2,
  'currencyCode' | 'amount'
>;

export type CartLineFragment = Pick<
  StorefrontAPI.CartLine,
  'id' | 'quantity'
> & {
  attributes: Array<Pick<StorefrontAPI.Attribute, 'key' | 'value'>>;
  cost: {
    totalAmount: Pick<StorefrontAPI.MoneyV2, 'currencyCode' | 'amount'>;
    amountPerQuantity: Pick<StorefrontAPI.MoneyV2, 'currencyCode' | 'amount'>;
    compareAtAmountPerQuantity?: StorefrontAPI.Maybe<
      Pick<StorefrontAPI.MoneyV2, 'currencyCode' | 'amount'>
    >;
  };
  merchandise: Pick<
    StorefrontAPI.ProductVariant,
    'id' | 'availableForSale' | 'requiresShipping' | 'title'
  > & {
    compareAtPrice?: StorefrontAPI.Maybe<
      Pick<StorefrontAPI.MoneyV2, 'currencyCode' | 'amount'>
    >;
    price: Pick<StorefrontAPI.MoneyV2, 'currencyCode' | 'amount'>;
    image?: StorefrontAPI.Maybe<
      Pick<StorefrontAPI.Image, 'id' | 'url' | 'altText' | 'width' | 'height'>
    >;
    product: Pick<StorefrontAPI.Product, 'handle' | 'title' | 'id' | 'vendor'>;
    selectedOptions: Array<
      Pick<StorefrontAPI.SelectedOption, 'name' | 'value'>
    >;
  };
};

export type CartLineComponentFragment = Pick<
  StorefrontAPI.ComponentizableCartLine,
  'id' | 'quantity'
> & {
  attributes: Array<Pick<StorefrontAPI.Attribute, 'key' | 'value'>>;
  cost: {
    totalAmount: Pick<StorefrontAPI.MoneyV2, 'currencyCode' | 'amount'>;
    amountPerQuantity: Pick<StorefrontAPI.MoneyV2, 'currencyCode' | 'amount'>;
    compareAtAmountPerQuantity?: StorefrontAPI.Maybe<
      Pick<StorefrontAPI.MoneyV2, 'currencyCode' | 'amount'>
    >;
  };
  merchandise: Pick<
    StorefrontAPI.ProductVariant,
    'id' | 'availableForSale' | 'requiresShipping' | 'title'
  > & {
    compareAtPrice?: StorefrontAPI.Maybe<
      Pick<StorefrontAPI.MoneyV2, 'currencyCode' | 'amount'>
    >;
    price: Pick<StorefrontAPI.MoneyV2, 'currencyCode' | 'amount'>;
    image?: StorefrontAPI.Maybe<
      Pick<StorefrontAPI.Image, 'id' | 'url' | 'altText' | 'width' | 'height'>
    >;
    product: Pick<StorefrontAPI.Product, 'handle' | 'title' | 'id' | 'vendor'>;
    selectedOptions: Array<
      Pick<StorefrontAPI.SelectedOption, 'name' | 'value'>
    >;
  };
};

export type CartApiQueryFragment = Pick<
  StorefrontAPI.Cart,
  'updatedAt' | 'id' | 'checkoutUrl' | 'totalQuantity' | 'note'
> & {
  appliedGiftCards: Array<
    Pick<StorefrontAPI.AppliedGiftCard, 'id' | 'lastCharacters'> & {
      amountUsed: Pick<StorefrontAPI.MoneyV2, 'currencyCode' | 'amount'>;
    }
  >;
  buyerIdentity: Pick<
    StorefrontAPI.CartBuyerIdentity,
    'countryCode' | 'email' | 'phone'
  > & {
    customer?: StorefrontAPI.Maybe<
      Pick<
        StorefrontAPI.Customer,
        'id' | 'email' | 'firstName' | 'lastName' | 'displayName'
      >
    >;
  };
  lines: {
    nodes: Array<
      | (Pick<StorefrontAPI.CartLine, 'id' | 'quantity'> & {
          attributes: Array<Pick<StorefrontAPI.Attribute, 'key' | 'value'>>;
          cost: {
            totalAmount: Pick<StorefrontAPI.MoneyV2, 'currencyCode' | 'amount'>;
            amountPerQuantity: Pick<
              StorefrontAPI.MoneyV2,
              'currencyCode' | 'amount'
            >;
            compareAtAmountPerQuantity?: StorefrontAPI.Maybe<
              Pick<StorefrontAPI.MoneyV2, 'currencyCode' | 'amount'>
            >;
          };
          merchandise: Pick<
            StorefrontAPI.ProductVariant,
            'id' | 'availableForSale' | 'requiresShipping' | 'title'
          > & {
            compareAtPrice?: StorefrontAPI.Maybe<
              Pick<StorefrontAPI.MoneyV2, 'currencyCode' | 'amount'>
            >;
            price: Pick<StorefrontAPI.MoneyV2, 'currencyCode' | 'amount'>;
            image?: StorefrontAPI.Maybe<
              Pick<
                StorefrontAPI.Image,
                'id' | 'url' | 'altText' | 'width' | 'height'
              >
            >;
            product: Pick<
              StorefrontAPI.Product,
              'handle' | 'title' | 'id' | 'vendor'
            >;
            selectedOptions: Array<
              Pick<StorefrontAPI.SelectedOption, 'name' | 'value'>
            >;
          };
        })
      | (Pick<StorefrontAPI.ComponentizableCartLine, 'id' | 'quantity'> & {
          attributes: Array<Pick<StorefrontAPI.Attribute, 'key' | 'value'>>;
          cost: {
            totalAmount: Pick<StorefrontAPI.MoneyV2, 'currencyCode' | 'amount'>;
            amountPerQuantity: Pick<
              StorefrontAPI.MoneyV2,
              'currencyCode' | 'amount'
            >;
            compareAtAmountPerQuantity?: StorefrontAPI.Maybe<
              Pick<StorefrontAPI.MoneyV2, 'currencyCode' | 'amount'>
            >;
          };
          merchandise: Pick<
            StorefrontAPI.ProductVariant,
            'id' | 'availableForSale' | 'requiresShipping' | 'title'
          > & {
            compareAtPrice?: StorefrontAPI.Maybe<
              Pick<StorefrontAPI.MoneyV2, 'currencyCode' | 'amount'>
            >;
            price: Pick<StorefrontAPI.MoneyV2, 'currencyCode' | 'amount'>;
            image?: StorefrontAPI.Maybe<
              Pick<
                StorefrontAPI.Image,
                'id' | 'url' | 'altText' | 'width' | 'height'
              >
            >;
            product: Pick<
              StorefrontAPI.Product,
              'handle' | 'title' | 'id' | 'vendor'
            >;
            selectedOptions: Array<
              Pick<StorefrontAPI.SelectedOption, 'name' | 'value'>
            >;
          };
        })
    >;
  };
  cost: {
    subtotalAmount: Pick<StorefrontAPI.MoneyV2, 'currencyCode' | 'amount'>;
    totalAmount: Pick<StorefrontAPI.MoneyV2, 'currencyCode' | 'amount'>;
    totalDutyAmount?: StorefrontAPI.Maybe<
      Pick<StorefrontAPI.MoneyV2, 'currencyCode' | 'amount'>
    >;
    totalTaxAmount?: StorefrontAPI.Maybe<
      Pick<StorefrontAPI.MoneyV2, 'currencyCode' | 'amount'>
    >;
  };
  attributes: Array<Pick<StorefrontAPI.Attribute, 'key' | 'value'>>;
  discountCodes: Array<
    Pick<StorefrontAPI.CartDiscountCode, 'code' | 'applicable'>
  >;
};

export type MenuItemFragment = Pick<
  StorefrontAPI.MenuItem,
  'id' | 'resourceId' | 'tags' | 'title' | 'type' | 'url'
>;

export type ChildMenuItemFragment = Pick<
  StorefrontAPI.MenuItem,
  'id' | 'resourceId' | 'tags' | 'title' | 'type' | 'url'
>;

export type ParentMenuItemFragment = Pick<
  StorefrontAPI.MenuItem,
  'id' | 'resourceId' | 'tags' | 'title' | 'type' | 'url'
> & {
  items: Array<
    Pick<
      StorefrontAPI.MenuItem,
      'id' | 'resourceId' | 'tags' | 'title' | 'type' | 'url'
    >
  >;
};

export type MenuFragment = Pick<StorefrontAPI.Menu, 'id'> & {
  items: Array<
    Pick<
      StorefrontAPI.MenuItem,
      'id' | 'resourceId' | 'tags' | 'title' | 'type' | 'url'
    > & {
      items: Array<
        Pick<
          StorefrontAPI.MenuItem,
          'id' | 'resourceId' | 'tags' | 'title' | 'type' | 'url'
        >
      >;
    }
  >;
};

export type ShopFragment = Pick<
  StorefrontAPI.Shop,
  'id' | 'name' | 'description'
> & {
  primaryDomain: Pick<StorefrontAPI.Domain, 'url'>;
  brand?: StorefrontAPI.Maybe<{
    logo?: StorefrontAPI.Maybe<{
      image?: StorefrontAPI.Maybe<Pick<StorefrontAPI.Image, 'url'>>;
    }>;
  }>;
};

export type HeaderQueryVariables = StorefrontAPI.Exact<{
  country?: StorefrontAPI.InputMaybe<StorefrontAPI.CountryCode>;
  headerMenuHandle: StorefrontAPI.Scalars['String']['input'];
  language?: StorefrontAPI.InputMaybe<StorefrontAPI.LanguageCode>;
}>;

export type HeaderQuery = {
  shop: Pick<StorefrontAPI.Shop, 'id' | 'name' | 'description'> & {
    primaryDomain: Pick<StorefrontAPI.Domain, 'url'>;
    brand?: StorefrontAPI.Maybe<{
      logo?: StorefrontAPI.Maybe<{
        image?: StorefrontAPI.Maybe<Pick<StorefrontAPI.Image, 'url'>>;
      }>;
    }>;
  };
  menu?: StorefrontAPI.Maybe<
    Pick<StorefrontAPI.Menu, 'id'> & {
      items: Array<
        Pick<
          StorefrontAPI.MenuItem,
          'id' | 'resourceId' | 'tags' | 'title' | 'type' | 'url'
        > & {
          items: Array<
            Pick<
              StorefrontAPI.MenuItem,
              'id' | 'resourceId' | 'tags' | 'title' | 'type' | 'url'
            >
          >;
        }
      >;
    }
  >;
};

export type FooterQueryVariables = StorefrontAPI.Exact<{
  country?: StorefrontAPI.InputMaybe<StorefrontAPI.CountryCode>;
  footerMenuHandle: StorefrontAPI.Scalars['String']['input'];
  language?: StorefrontAPI.InputMaybe<StorefrontAPI.LanguageCode>;
}>;

export type FooterQuery = {
  menu?: StorefrontAPI.Maybe<
    Pick<StorefrontAPI.Menu, 'id'> & {
      items: Array<
        Pick<
          StorefrontAPI.MenuItem,
          'id' | 'resourceId' | 'tags' | 'title' | 'type' | 'url'
        > & {
          items: Array<
            Pick<
              StorefrontAPI.MenuItem,
              'id' | 'resourceId' | 'tags' | 'title' | 'type' | 'url'
            >
          >;
        }
      >;
    }
  >;
};

export type ArticleQueryVariables = StorefrontAPI.Exact<{
  articleHandle: StorefrontAPI.Scalars['String']['input'];
  blogHandle: StorefrontAPI.Scalars['String']['input'];
  country?: StorefrontAPI.InputMaybe<StorefrontAPI.CountryCode>;
  language?: StorefrontAPI.InputMaybe<StorefrontAPI.LanguageCode>;
}>;

export type ArticleQuery = {
  blog?: StorefrontAPI.Maybe<
    Pick<StorefrontAPI.Blog, 'handle'> & {
      articleByHandle?: StorefrontAPI.Maybe<
        Pick<
          StorefrontAPI.Article,
          'handle' | 'title' | 'contentHtml' | 'publishedAt'
        > & {
          author?: StorefrontAPI.Maybe<
            Pick<StorefrontAPI.ArticleAuthor, 'name'>
          >;
          image?: StorefrontAPI.Maybe<
            Pick<
              StorefrontAPI.Image,
              'id' | 'altText' | 'url' | 'width' | 'height'
            >
          >;
          seo?: StorefrontAPI.Maybe<
            Pick<StorefrontAPI.Seo, 'description' | 'title'>
          >;
        }
      >;
    }
  >;
};

export type BlogQueryVariables = StorefrontAPI.Exact<{
  language?: StorefrontAPI.InputMaybe<StorefrontAPI.LanguageCode>;
  blogHandle: StorefrontAPI.Scalars['String']['input'];
  first?: StorefrontAPI.InputMaybe<StorefrontAPI.Scalars['Int']['input']>;
  last?: StorefrontAPI.InputMaybe<StorefrontAPI.Scalars['Int']['input']>;
  startCursor?: StorefrontAPI.InputMaybe<
    StorefrontAPI.Scalars['String']['input']
  >;
  endCursor?: StorefrontAPI.InputMaybe<
    StorefrontAPI.Scalars['String']['input']
  >;
}>;

export type BlogQuery = {
  blog?: StorefrontAPI.Maybe<
    Pick<StorefrontAPI.Blog, 'title' | 'handle'> & {
      seo?: StorefrontAPI.Maybe<
        Pick<StorefrontAPI.Seo, 'title' | 'description'>
      >;
      articles: {
        nodes: Array<
          Pick<
            StorefrontAPI.Article,
            'contentHtml' | 'handle' | 'id' | 'publishedAt' | 'title'
          > & {
            author?: StorefrontAPI.Maybe<
              Pick<StorefrontAPI.ArticleAuthor, 'name'>
            >;
            image?: StorefrontAPI.Maybe<
              Pick<
                StorefrontAPI.Image,
                'id' | 'altText' | 'url' | 'width' | 'height'
              >
            >;
            blog: Pick<StorefrontAPI.Blog, 'handle'>;
          }
        >;
        pageInfo: Pick<
          StorefrontAPI.PageInfo,
          'hasPreviousPage' | 'hasNextPage' | 'endCursor' | 'startCursor'
        >;
      };
    }
  >;
};

export type ArticleItemFragment = Pick<
  StorefrontAPI.Article,
  'contentHtml' | 'handle' | 'id' | 'publishedAt' | 'title'
> & {
  author?: StorefrontAPI.Maybe<Pick<StorefrontAPI.ArticleAuthor, 'name'>>;
  image?: StorefrontAPI.Maybe<
    Pick<StorefrontAPI.Image, 'id' | 'altText' | 'url' | 'width' | 'height'>
  >;
  blog: Pick<StorefrontAPI.Blog, 'handle'>;
};

export type BlogsQueryVariables = StorefrontAPI.Exact<{
  country?: StorefrontAPI.InputMaybe<StorefrontAPI.CountryCode>;
  endCursor?: StorefrontAPI.InputMaybe<
    StorefrontAPI.Scalars['String']['input']
  >;
  first?: StorefrontAPI.InputMaybe<StorefrontAPI.Scalars['Int']['input']>;
  language?: StorefrontAPI.InputMaybe<StorefrontAPI.LanguageCode>;
  last?: StorefrontAPI.InputMaybe<StorefrontAPI.Scalars['Int']['input']>;
  startCursor?: StorefrontAPI.InputMaybe<
    StorefrontAPI.Scalars['String']['input']
  >;
}>;

export type BlogsQuery = {
  blogs: {
    pageInfo: Pick<
      StorefrontAPI.PageInfo,
      'hasNextPage' | 'hasPreviousPage' | 'startCursor' | 'endCursor'
    >;
    nodes: Array<
      Pick<StorefrontAPI.Blog, 'title' | 'handle'> & {
        seo?: StorefrontAPI.Maybe<
          Pick<StorefrontAPI.Seo, 'title' | 'description'>
        >;
      }
    >;
  };
};

export type PageQueryVariables = StorefrontAPI.Exact<{
  language?: StorefrontAPI.InputMaybe<StorefrontAPI.LanguageCode>;
  country?: StorefrontAPI.InputMaybe<StorefrontAPI.CountryCode>;
  handle: StorefrontAPI.Scalars['String']['input'];
}>;

export type PageQuery = {
  page?: StorefrontAPI.Maybe<
    Pick<StorefrontAPI.Page, 'handle' | 'id' | 'title' | 'body'> & {
      seo?: StorefrontAPI.Maybe<
        Pick<StorefrontAPI.Seo, 'description' | 'title'>
      >;
    }
  >;
};

export type PolicyFragment = Pick<
  StorefrontAPI.ShopPolicy,
  'body' | 'handle' | 'id' | 'title' | 'url'
>;

export type PolicyQueryVariables = StorefrontAPI.Exact<{
  country?: StorefrontAPI.InputMaybe<StorefrontAPI.CountryCode>;
  language?: StorefrontAPI.InputMaybe<StorefrontAPI.LanguageCode>;
  privacyPolicy: StorefrontAPI.Scalars['Boolean']['input'];
  refundPolicy: StorefrontAPI.Scalars['Boolean']['input'];
  shippingPolicy: StorefrontAPI.Scalars['Boolean']['input'];
  termsOfService: StorefrontAPI.Scalars['Boolean']['input'];
}>;

export type PolicyQuery = {
  shop: {
    privacyPolicy?: StorefrontAPI.Maybe<
      Pick<StorefrontAPI.ShopPolicy, 'body' | 'handle' | 'id' | 'title' | 'url'>
    >;
    shippingPolicy?: StorefrontAPI.Maybe<
      Pick<StorefrontAPI.ShopPolicy, 'body' | 'handle' | 'id' | 'title' | 'url'>
    >;
    termsOfService?: StorefrontAPI.Maybe<
      Pick<StorefrontAPI.ShopPolicy, 'body' | 'handle' | 'id' | 'title' | 'url'>
    >;
    refundPolicy?: StorefrontAPI.Maybe<
      Pick<StorefrontAPI.ShopPolicy, 'body' | 'handle' | 'id' | 'title' | 'url'>
    >;
  };
};

export type PolicyItemFragment = Pick<
  StorefrontAPI.ShopPolicy,
  'id' | 'title' | 'handle'
>;

export type PoliciesQueryVariables = StorefrontAPI.Exact<{
  country?: StorefrontAPI.InputMaybe<StorefrontAPI.CountryCode>;
  language?: StorefrontAPI.InputMaybe<StorefrontAPI.LanguageCode>;
}>;

export type PoliciesQuery = {
  shop: {
    privacyPolicy?: StorefrontAPI.Maybe<
      Pick<StorefrontAPI.ShopPolicy, 'id' | 'title' | 'handle'>
    >;
    shippingPolicy?: StorefrontAPI.Maybe<
      Pick<StorefrontAPI.ShopPolicy, 'id' | 'title' | 'handle'>
    >;
    termsOfService?: StorefrontAPI.Maybe<
      Pick<StorefrontAPI.ShopPolicy, 'id' | 'title' | 'handle'>
    >;
    refundPolicy?: StorefrontAPI.Maybe<
      Pick<StorefrontAPI.ShopPolicy, 'id' | 'title' | 'handle'>
    >;
    subscriptionPolicy?: StorefrontAPI.Maybe<
      Pick<StorefrontAPI.ShopPolicyWithDefault, 'id' | 'title' | 'handle'>
    >;
  };
};

export type SearchProductFragment = {__typename: 'Product'} & Pick<
  StorefrontAPI.Product,
  'trackingParameters' | 'id' | 'handle' | 'title' | 'tags' | 'availableForSale'
> & {
    featuredImage?: StorefrontAPI.Maybe<
      Pick<StorefrontAPI.Image, 'id' | 'altText' | 'url' | 'width' | 'height'>
    >;
    images: {
      nodes: Array<
        Pick<StorefrontAPI.Image, 'id' | 'altText' | 'url' | 'width' | 'height'>
      >;
    };
    priceRange: {
      minVariantPrice: Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>;
      maxVariantPrice: Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>;
    };
  };

export type SearchPageFragment = {__typename: 'Page'} & Pick<
  StorefrontAPI.Page,
  'handle' | 'id' | 'title' | 'trackingParameters'
>;

export type SearchArticleFragment = {__typename: 'Article'} & Pick<
  StorefrontAPI.Article,
  'handle' | 'id' | 'title' | 'trackingParameters'
>;

export type PageInfoFragmentFragment = Pick<
  StorefrontAPI.PageInfo,
  'hasNextPage' | 'hasPreviousPage' | 'startCursor' | 'endCursor'
>;

export type RegularSearchQueryVariables = StorefrontAPI.Exact<{
  country?: StorefrontAPI.InputMaybe<StorefrontAPI.CountryCode>;
  endCursor?: StorefrontAPI.InputMaybe<
    StorefrontAPI.Scalars['String']['input']
  >;
  first?: StorefrontAPI.InputMaybe<StorefrontAPI.Scalars['Int']['input']>;
  language?: StorefrontAPI.InputMaybe<StorefrontAPI.LanguageCode>;
  last?: StorefrontAPI.InputMaybe<StorefrontAPI.Scalars['Int']['input']>;
  term: StorefrontAPI.Scalars['String']['input'];
  startCursor?: StorefrontAPI.InputMaybe<
    StorefrontAPI.Scalars['String']['input']
  >;
}>;

export type RegularSearchQuery = {
  articles: {
    nodes: Array<
      {__typename: 'Article'} & Pick<
        StorefrontAPI.Article,
        'handle' | 'id' | 'title' | 'trackingParameters'
      >
    >;
  };
  pages: {
    nodes: Array<
      {__typename: 'Page'} & Pick<
        StorefrontAPI.Page,
        'handle' | 'id' | 'title' | 'trackingParameters'
      >
    >;
  };
  products: {
    nodes: Array<
      {__typename: 'Product'} & Pick<
        StorefrontAPI.Product,
        | 'trackingParameters'
        | 'id'
        | 'handle'
        | 'title'
        | 'tags'
        | 'availableForSale'
      > & {
          featuredImage?: StorefrontAPI.Maybe<
            Pick<
              StorefrontAPI.Image,
              'id' | 'altText' | 'url' | 'width' | 'height'
            >
          >;
          images: {
            nodes: Array<
              Pick<
                StorefrontAPI.Image,
                'id' | 'altText' | 'url' | 'width' | 'height'
              >
            >;
          };
          priceRange: {
            minVariantPrice: Pick<
              StorefrontAPI.MoneyV2,
              'amount' | 'currencyCode'
            >;
            maxVariantPrice: Pick<
              StorefrontAPI.MoneyV2,
              'amount' | 'currencyCode'
            >;
          };
        }
    >;
    pageInfo: Pick<
      StorefrontAPI.PageInfo,
      'hasNextPage' | 'hasPreviousPage' | 'startCursor' | 'endCursor'
    >;
  };
};

export type PredictiveArticleFragment = {__typename: 'Article'} & Pick<
  StorefrontAPI.Article,
  'id' | 'title' | 'handle' | 'trackingParameters'
> & {
    blog: Pick<StorefrontAPI.Blog, 'handle'>;
    image?: StorefrontAPI.Maybe<
      Pick<StorefrontAPI.Image, 'url' | 'altText' | 'width' | 'height'>
    >;
  };

export type PredictiveCollectionFragment = {__typename: 'Collection'} & Pick<
  StorefrontAPI.Collection,
  'id' | 'title' | 'handle' | 'trackingParameters'
> & {
    image?: StorefrontAPI.Maybe<
      Pick<StorefrontAPI.Image, 'url' | 'altText' | 'width' | 'height'>
    >;
  };

export type PredictivePageFragment = {__typename: 'Page'} & Pick<
  StorefrontAPI.Page,
  'id' | 'title' | 'handle' | 'trackingParameters'
>;

export type PredictiveProductFragment = {__typename: 'Product'} & Pick<
  StorefrontAPI.Product,
  'id' | 'title' | 'handle' | 'trackingParameters'
> & {
    selectedOrFirstAvailableVariant?: StorefrontAPI.Maybe<
      Pick<StorefrontAPI.ProductVariant, 'id'> & {
        image?: StorefrontAPI.Maybe<
          Pick<StorefrontAPI.Image, 'url' | 'altText' | 'width' | 'height'>
        >;
        price: Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>;
      }
    >;
  };

export type PredictiveQueryFragment = {
  __typename: 'SearchQuerySuggestion';
} & Pick<
  StorefrontAPI.SearchQuerySuggestion,
  'text' | 'styledText' | 'trackingParameters'
>;

export type PredictiveSearchQueryVariables = StorefrontAPI.Exact<{
  country?: StorefrontAPI.InputMaybe<StorefrontAPI.CountryCode>;
  language?: StorefrontAPI.InputMaybe<StorefrontAPI.LanguageCode>;
  limit: StorefrontAPI.Scalars['Int']['input'];
  limitScope: StorefrontAPI.PredictiveSearchLimitScope;
  term: StorefrontAPI.Scalars['String']['input'];
  types?: StorefrontAPI.InputMaybe<
    | Array<StorefrontAPI.PredictiveSearchType>
    | StorefrontAPI.PredictiveSearchType
  >;
}>;

export type PredictiveSearchQuery = {
  predictiveSearch?: StorefrontAPI.Maybe<{
    articles: Array<
      {__typename: 'Article'} & Pick<
        StorefrontAPI.Article,
        'id' | 'title' | 'handle' | 'trackingParameters'
      > & {
          blog: Pick<StorefrontAPI.Blog, 'handle'>;
          image?: StorefrontAPI.Maybe<
            Pick<StorefrontAPI.Image, 'url' | 'altText' | 'width' | 'height'>
          >;
        }
    >;
    collections: Array<
      {__typename: 'Collection'} & Pick<
        StorefrontAPI.Collection,
        'id' | 'title' | 'handle' | 'trackingParameters'
      > & {
          image?: StorefrontAPI.Maybe<
            Pick<StorefrontAPI.Image, 'url' | 'altText' | 'width' | 'height'>
          >;
        }
    >;
    pages: Array<
      {__typename: 'Page'} & Pick<
        StorefrontAPI.Page,
        'id' | 'title' | 'handle' | 'trackingParameters'
      >
    >;
    products: Array<
      {__typename: 'Product'} & Pick<
        StorefrontAPI.Product,
        'id' | 'title' | 'handle' | 'trackingParameters'
      > & {
          selectedOrFirstAvailableVariant?: StorefrontAPI.Maybe<
            Pick<StorefrontAPI.ProductVariant, 'id'> & {
              image?: StorefrontAPI.Maybe<
                Pick<
                  StorefrontAPI.Image,
                  'url' | 'altText' | 'width' | 'height'
                >
              >;
              price: Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>;
            }
          >;
        }
    >;
    queries: Array<
      {__typename: 'SearchQuerySuggestion'} & Pick<
        StorefrontAPI.SearchQuerySuggestion,
        'text' | 'styledText' | 'trackingParameters'
      >
    >;
  }>;
};

export type StoreRobotsQueryVariables = StorefrontAPI.Exact<{
  country?: StorefrontAPI.InputMaybe<StorefrontAPI.CountryCode>;
  language?: StorefrontAPI.InputMaybe<StorefrontAPI.LanguageCode>;
}>;

export type StoreRobotsQuery = {shop: Pick<StorefrontAPI.Shop, 'id'>};

interface GeneratedQueryTypes {
  '#graphql\n  query BestsellersProducts(\n    $country: CountryCode\n    $language: LanguageCode\n    $handle: String!\n  ) @inContext(country: $country, language: $language) {\n    collection(handle: $handle) {\n      id\n      title\n      handle\n      products(first: 5) {\n        nodes {\n          ...RecommendedProduct\n        }\n      }\n    }\n  }\n  #graphql\n  fragment RecommendedProduct on Product {\n    id\n    title\n    handle\n    tags\n    priceRange {\n      minVariantPrice {\n        amount\n        currencyCode\n      }\n    }\n    featuredImage {\n      id\n      url\n      altText\n      width\n      height\n    }\n    images(first: 5) {\n      nodes {\n        id\n        url\n        altText\n        width\n        height\n      }\n    }\n  }\n\n': {
    return: BestsellersProductsQuery;
    variables: BestsellersProductsQueryVariables;
  };
  '#graphql\n  query CatalogProducts(\n    $country: CountryCode\n    $language: LanguageCode\n    $sortKey: ProductSortKeys\n    $reverse: Boolean\n    $first: Int\n    $last: Int\n    $startCursor: String\n    $endCursor: String\n  ) @inContext(country: $country, language: $language) {\n    products(\n      first: $first\n      last: $last\n      before: $startCursor\n      after: $endCursor\n      sortKey: $sortKey\n      reverse: $reverse\n    ) {\n      nodes {\n        ...ProductCard\n      }\n      pageInfo {\n        hasPreviousPage\n        hasNextPage\n        endCursor\n        startCursor\n      }\n    }\n  }\n  #graphql\n  fragment ProductCard on Product {\n    id\n    handle\n    title\n    tags\n    availableForSale\n    featuredImage {\n      id\n      altText\n      url\n      width\n      height\n    }\n    images(first: 5) {\n      nodes {\n        id\n        altText\n        url\n        width\n        height\n      }\n    }\n    priceRange {\n      minVariantPrice {\n        ...MoneyFields\n      }\n      maxVariantPrice {\n        ...MoneyFields\n      }\n    }\n  }\n  #graphql\n    fragment MoneyFields on MoneyV2 {\n        amount\n        currencyCode\n    }\n\n\n': {
    return: CatalogProductsQuery;
    variables: CatalogProductsQueryVariables;
  };
  '#graphql\n  query CollectionProducts(\n    $handle: String!\n    $country: CountryCode\n    $language: LanguageCode\n    $sortKey: ProductCollectionSortKeys\n    $reverse: Boolean\n    $first: Int\n    $last: Int\n    $startCursor: String\n    $endCursor: String\n    $filters: [ProductFilter!]\n  ) @inContext(country: $country, language: $language) {\n    collection(handle: $handle) {\n      id\n      handle\n      title\n      description\n      image {\n        id\n        url\n        altText\n        width\n        height\n      }\n      products(\n        sortKey: $sortKey\n        reverse: $reverse\n        first: $first\n        last: $last\n        before: $startCursor\n        after: $endCursor\n        filters: $filters\n      ) {\n        nodes {\n          ...ProductCard\n        }\n        filters {\n          id\n          label\n          type\n          values {\n            id\n            label\n            count\n            input\n          }\n        }\n        pageInfo {\n          hasPreviousPage\n          hasNextPage\n          endCursor\n          startCursor\n        }\n      }\n    }\n  }\n  #graphql\n  fragment ProductCard on Product {\n    id\n    handle\n    title\n    tags\n    availableForSale\n    featuredImage {\n      id\n      altText\n      url\n      width\n      height\n    }\n    images(first: 5) {\n      nodes {\n        id\n        altText\n        url\n        width\n        height\n      }\n    }\n    priceRange {\n      minVariantPrice {\n        ...MoneyFields\n      }\n      maxVariantPrice {\n        ...MoneyFields\n      }\n    }\n  }\n  #graphql\n    fragment MoneyFields on MoneyV2 {\n        amount\n        currencyCode\n    }\n\n\n': {
    return: CollectionProductsQuery;
    variables: CollectionProductsQueryVariables;
  };
  '#graphql\n  query FeaturedCollections(\n    $country: CountryCode\n    $language: LanguageCode\n    $first: Int = 24\n  ) @inContext(country: $country, language: $language) {\n    collections(first: $first, sortKey: UPDATED_AT, reverse: true) {\n      nodes {\n        ...FeaturedCollection\n      }\n    }\n  }\n  #graphql\n  fragment FeaturedCollection on Collection {\n    id\n    title\n    handle\n    image {\n      id\n      url\n      altText\n      width\n      height\n    }\n    products(first: 1) {\n      nodes {\n        featuredImage {\n          id\n          url\n          altText\n          width\n          height\n        }\n        images(first: 1) {\n          nodes {\n            id\n            url\n            altText\n            width\n            height\n          }\n        }\n      }\n    }\n  }\n\n': {
    return: FeaturedCollectionsQuery;
    variables: FeaturedCollectionsQueryVariables;
  };
  '#graphql\n  query HomeHeroMetaobject(\n    $country: CountryCode\n    $language: LanguageCode\n    $type: String!\n  ) @inContext(country: $country, language: $language) {\n    metaobjects(type: $type, first: 1) {\n      nodes {\n        id\n        type\n        handle\n        fields {\n          key\n          value\n          reference {\n            __typename\n            ... on MediaImage {\n              id\n              image {\n                id\n                url\n                altText\n                width\n                height\n              }\n            }\n          }\n          references(first: 5) {\n            nodes {\n              __typename\n              ... on Metaobject {\n                id\n                type\n                fields {\n                  key\n                  value\n                  reference {\n                    __typename\n                    ... on Product {\n                      id\n                      handle\n                      title\n                      featuredImage {\n                        id\n                        url\n                        altText\n                        width\n                        height\n                      }\n                      priceRange {\n                        minVariantPrice {\n                          amount\n                          currencyCode\n                        }\n                      }\n                    }\n                  }\n                }\n              }\n            }\n          }\n        }\n      }\n    }\n  }\n': {
    return: HomeHeroMetaobjectQuery;
    variables: HomeHeroMetaobjectQueryVariables;
  };
  '#graphql\n  query HomePromoBanners(\n    $country: CountryCode\n    $language: LanguageCode\n    $type: String!\n    $first: Int!\n  ) @inContext(country: $country, language: $language) {\n    metaobjects(type: $type, first: $first) {\n      nodes {\n        id\n        type\n        handle\n        fields {\n          key\n          value\n          reference {\n            __typename\n            ... on MediaImage {\n              id\n              image {\n                id\n                url\n                altText\n                width\n                height\n              }\n            }\n          }\n        }\n      }\n    }\n  }\n': {
    return: HomePromoBannersQuery;
    variables: HomePromoBannersQueryVariables;
  };
  '#graphql\n    query ProductByHandle(\n        $handle: String!,\n        $selectedOptions: [SelectedOptionInput!]!,\n        $country: CountryCode,\n        $language: LanguageCode\n    ) @inContext(country: $country, language: $language) {\n        product(handle: $handle) {\n            ...ProductBaseFields\n            \n            selectedOrFirstAvailableVariant(\n                selectedOptions: $selectedOptions, \n                ignoreUnknownOptions: true, \n                caseInsensitiveMatch: true\n            ) {\n                ...VariantFields\n            }\n\n            variants(first: 100) {\n                nodes {\n                    ...VariantFields\n                }\n            }\n\n            images(first: 10) {\n                nodes { # Switched to nodes for cleaner mapping\n                    ...ImageFields\n                }\n            }\n\n            ...SkincareProduct\n        }\n    }\n    #graphql\n    fragment ProductBaseFields on Product {\n        id\n        title\n        vendor\n        handle\n        description\n        descriptionHtml\n        \n        encodedVariantExistence\n        encodedVariantAvailability\n\n        adjacentVariants (selectedOptions: $selectedOptions) {\n            ...VariantFields\n        }\n\n        options {\n            name\n            optionValues {\n                name\n                firstSelectableVariant {\n                    ...VariantFields\n                }\n                # ... swatch fields\n            }\n        }\n    }\n\n    #graphql\n    fragment ImageFields on Image {\n        url\n        altText\n        width\n        height\n    }\n\n    #graphql\n    fragment MoneyFields on MoneyV2 {\n        amount\n        currencyCode\n    }\n\n    #graphql\n  fragment VariantFields on ProductVariant {\n    id\n    title\n    availableForSale\n    quantityAvailable\n    selectedOptions {\n      name\n      value\n    }\n    price {\n      ...MoneyFields\n    }\n    # ARCHITECT MOVE: Every variant now knows its parent handle\n    # This satisfies getProductOptions and getAdjacentAndFirstAvailableVariants\n    product {\n      handle\n    }\n  }\n\n    #graphql\n  fragment SkincareProduct on Product {\n    heroClaim: metafield(namespace: "custom", key: "lumina_hero_claim") {\n      id\n      type\n      value\n    }\n\n    howToUse: metafield(namespace: "custom", key: "lumina_how_to_use") {\n      id\n      type\n      value\n    }\n\n    fullIngredients: metafield(namespace: "custom", key: "lumina_full_ingredients") {\n      id\n      type\n      value\n    }\n\n    shippingAndReturns: metafield(namespace: "custom", key: "lumina_shipping_returns") {\n      id\n      type\n      value\n    }\n\n    amPm: metafield(namespace: "custom", key: "lumina_am_pm") {\n      id\n      type\n      value\n    }\n\n    safeWith: metafield(namespace: "custom", key: "lumina_safe_with") {\n      references(first: 10) {\n        nodes {\n          ... on Metaobject {\n            ...MetaobjectFields\n          }\n        }\n      }\n    }\n\n    avoidWith: metafield(namespace: "custom", key: "lumina_avoid_with") {\n      references(first: 10) {\n        nodes {\n          ... on Metaobject {\n            ...MetaobjectFields\n          }\n        }\n      }\n    }\n\n    productBenefits: metafield(namespace: "custom", key: "lumina_product_benefits") {\n      references(first: 5) {\n        nodes {\n          ... on Metaobject {\n            ...MetaobjectFields\n          }\n        }\n      }\n    }\n\n    reviewCount: metafield(namespace: "custom", key: "lumina_reviews") {\n      id\n      type\n      value\n    }\n\n    rating: metafield(namespace: "custom", key: "lumina_rating") {\n      id\n      type\n      value\n    }\n\n    step: metafield(namespace: "custom", key: "lumina_step_order") {\n      id\n      type\n      value\n    }\n\n    skinTypes: metafield(namespace: "custom", key: "skin_compatibility") {\n      references(first: 10) {\n        nodes {\n          ... on Metaobject {\n            ...MetaobjectFields\n          }\n        }\n      }\n    }\n\n    skinCare: metafield(namespace: "custom", key: "lumina_skin_care") {\n      reference {\n        ... on Metaobject {\n          ...MetaobjectFields\n        }\n      }\n    }\n\n    ingredients: metafield(namespace: "custom", key: "lumina_hero_ingredients") {\n      references(first: 10) {\n        nodes {\n          ... on Metaobject {\n            ...MetaobjectFields\n          }\n        }\n      }\n    }\n\n    regimen: metafield(namespace: "custom", key: "lumina_regimen") {\n      reference {\n        ... on Metaobject {\n          id\n          type\n          handle\n          fields {\n            key\n            value\n            references(first: 5) {\n              nodes {\n                ... on Product {\n                  ...RoutineProductFields\n                }\n              }\n            }\n          }\n        }\n      }\n    }\n\n    routineProducts: metafield(namespace: "custom", key: "lumina_routine_products") {\n      references(first: 5) {\n        nodes {\n          ... on Product {\n            ...RoutineProductFields\n          }\n        }\n      }\n    }\n  }\n  #graphql\n  fragment MetaobjectFields on Metaobject {\n    id\n    type\n    fields {\n      key\n      value\n    }\n  }\n\n  #graphql\n  fragment RoutineProductFields on Product {\n    id\n    handle\n    title\n    featuredImage {\n      id\n      url\n      altText\n      width\n      height\n    }\n    priceRange {\n      minVariantPrice {\n        amount\n        currencyCode\n      }\n    }\n    step: metafield(namespace: "custom", key: "lumina_step_order") {\n      value\n    }\n    skinCare: metafield(namespace: "custom", key: "lumina_skin_care") {\n      reference {\n        ... on Metaobject {\n          id\n          type\n          fields {\n            key\n            value\n          }\n        }\n      }\n    }\n  }\n\n\n': {
    return: ProductByHandleQuery;
    variables: ProductByHandleQueryVariables;
  };
  '#graphql\n  query ProductRecommendations(\n    $productId: ID!\n    $country: CountryCode\n    $language: LanguageCode\n  ) @inContext(country: $country, language: $language) {\n    productRecommendations(productId: $productId) {\n      ...RecommendedProduct\n    }\n  }\n  #graphql\n  fragment RecommendedProduct on Product {\n    id\n    title\n    handle\n    tags\n    priceRange {\n      minVariantPrice {\n        amount\n        currencyCode\n      }\n    }\n    featuredImage {\n      id\n      url\n      altText\n      width\n      height\n    }\n    images(first: 5) {\n      nodes {\n        id\n        url\n        altText\n        width\n        height\n      }\n    }\n  }\n\n': {
    return: ProductRecommendationsQuery;
    variables: ProductRecommendationsQueryVariables;
  };
  '#graphql\n  query RoutineCollectionProducts(\n    $country: CountryCode\n    $language: LanguageCode\n    $handle: String!\n    $first: Int!\n  ) @inContext(country: $country, language: $language) {\n    collection(handle: $handle) {\n      id\n      handle\n      title\n      products(first: $first) {\n        nodes {\n          ...RecommendedProduct\n          routineStepType: metafield(\n            namespace: "custom"\n            key: "lumina_routine_step_type"\n          ) {\n            value\n          }\n          firstVariant: variants(first: 1) {\n            nodes {\n              id\n              availableForSale\n            }\n          }\n        }\n      }\n    }\n  }\n  #graphql\n  fragment RecommendedProduct on Product {\n    id\n    title\n    handle\n    tags\n    priceRange {\n      minVariantPrice {\n        amount\n        currencyCode\n      }\n    }\n    featuredImage {\n      id\n      url\n      altText\n      width\n      height\n    }\n    images(first: 5) {\n      nodes {\n        id\n        url\n        altText\n        width\n        height\n      }\n    }\n  }\n\n': {
    return: RoutineCollectionProductsQuery;
    variables: RoutineCollectionProductsQueryVariables;
  };
  '#graphql\n  fragment Shop on Shop {\n    id\n    name\n    description\n    primaryDomain {\n      url\n    }\n    brand {\n      logo {\n        image {\n          url\n        }\n      }\n    }\n  }\n  query Header(\n    $country: CountryCode\n    $headerMenuHandle: String!\n    $language: LanguageCode\n  ) @inContext(language: $language, country: $country) {\n    shop {\n      ...Shop\n    }\n    menu(handle: $headerMenuHandle) {\n      ...Menu\n    }\n  }\n  #graphql\n  fragment MenuItem on MenuItem {\n    id\n    resourceId\n    tags\n    title\n    type\n    url\n  }\n  fragment ChildMenuItem on MenuItem {\n    ...MenuItem\n  }\n  fragment ParentMenuItem on MenuItem {\n    ...MenuItem\n    items {\n      ...ChildMenuItem\n    }\n  }\n  fragment Menu on Menu {\n    id\n    items {\n      ...ParentMenuItem\n    }\n  }\n\n': {
    return: HeaderQuery;
    variables: HeaderQueryVariables;
  };
  '#graphql\n  query Footer(\n    $country: CountryCode\n    $footerMenuHandle: String!\n    $language: LanguageCode\n  ) @inContext(language: $language, country: $country) {\n    menu(handle: $footerMenuHandle) {\n      ...Menu\n    }\n  }\n  #graphql\n  fragment MenuItem on MenuItem {\n    id\n    resourceId\n    tags\n    title\n    type\n    url\n  }\n  fragment ChildMenuItem on MenuItem {\n    ...MenuItem\n  }\n  fragment ParentMenuItem on MenuItem {\n    ...MenuItem\n    items {\n      ...ChildMenuItem\n    }\n  }\n  fragment Menu on Menu {\n    id\n    items {\n      ...ParentMenuItem\n    }\n  }\n\n': {
    return: FooterQuery;
    variables: FooterQueryVariables;
  };
  '#graphql\n  query Article(\n    $articleHandle: String!\n    $blogHandle: String!\n    $country: CountryCode\n    $language: LanguageCode\n  ) @inContext(language: $language, country: $country) {\n    blog(handle: $blogHandle) {\n      handle\n      articleByHandle(handle: $articleHandle) {\n        handle\n        title\n        contentHtml\n        publishedAt\n        author: authorV2 {\n          name\n        }\n        image {\n          id\n          altText\n          url\n          width\n          height\n        }\n        seo {\n          description\n          title\n        }\n      }\n    }\n  }\n': {
    return: ArticleQuery;
    variables: ArticleQueryVariables;
  };
  '#graphql\n  query Blog(\n    $language: LanguageCode\n    $blogHandle: String!\n    $first: Int\n    $last: Int\n    $startCursor: String\n    $endCursor: String\n  ) @inContext(language: $language) {\n    blog(handle: $blogHandle) {\n      title\n      handle\n      seo {\n        title\n        description\n      }\n      articles(\n        first: $first,\n        last: $last,\n        before: $startCursor,\n        after: $endCursor\n      ) {\n        nodes {\n          ...ArticleItem\n        }\n        pageInfo {\n          hasPreviousPage\n          hasNextPage\n          hasNextPage\n          endCursor\n          startCursor\n        }\n\n      }\n    }\n  }\n  fragment ArticleItem on Article {\n    author: authorV2 {\n      name\n    }\n    contentHtml\n    handle\n    id\n    image {\n      id\n      altText\n      url\n      width\n      height\n    }\n    publishedAt\n    title\n    blog {\n      handle\n    }\n  }\n': {
    return: BlogQuery;
    variables: BlogQueryVariables;
  };
  '#graphql\n  query Blogs(\n    $country: CountryCode\n    $endCursor: String\n    $first: Int\n    $language: LanguageCode\n    $last: Int\n    $startCursor: String\n  ) @inContext(country: $country, language: $language) {\n    blogs(\n      first: $first,\n      last: $last,\n      before: $startCursor,\n      after: $endCursor\n    ) {\n      pageInfo {\n        hasNextPage\n        hasPreviousPage\n        startCursor\n        endCursor\n      }\n      nodes {\n        title\n        handle\n        seo {\n          title\n          description\n        }\n      }\n    }\n  }\n': {
    return: BlogsQuery;
    variables: BlogsQueryVariables;
  };
  '#graphql\n  query Page(\n    $language: LanguageCode,\n    $country: CountryCode,\n    $handle: String!\n  )\n  @inContext(language: $language, country: $country) {\n    page(handle: $handle) {\n      handle\n      id\n      title\n      body\n      seo {\n        description\n        title\n      }\n    }\n  }\n': {
    return: PageQuery;
    variables: PageQueryVariables;
  };
  '#graphql\n  fragment Policy on ShopPolicy {\n    body\n    handle\n    id\n    title\n    url\n  }\n  query Policy(\n    $country: CountryCode\n    $language: LanguageCode\n    $privacyPolicy: Boolean!\n    $refundPolicy: Boolean!\n    $shippingPolicy: Boolean!\n    $termsOfService: Boolean!\n  ) @inContext(language: $language, country: $country) {\n    shop {\n      privacyPolicy @include(if: $privacyPolicy) {\n        ...Policy\n      }\n      shippingPolicy @include(if: $shippingPolicy) {\n        ...Policy\n      }\n      termsOfService @include(if: $termsOfService) {\n        ...Policy\n      }\n      refundPolicy @include(if: $refundPolicy) {\n        ...Policy\n      }\n    }\n  }\n': {
    return: PolicyQuery;
    variables: PolicyQueryVariables;
  };
  '#graphql\n  fragment PolicyItem on ShopPolicy {\n    id\n    title\n    handle\n  }\n  query Policies ($country: CountryCode, $language: LanguageCode)\n    @inContext(country: $country, language: $language) {\n    shop {\n      privacyPolicy {\n        ...PolicyItem\n      }\n      shippingPolicy {\n        ...PolicyItem\n      }\n      termsOfService {\n        ...PolicyItem\n      }\n      refundPolicy {\n        ...PolicyItem\n      }\n      subscriptionPolicy {\n        id\n        title\n        handle\n      }\n    }\n  }\n': {
    return: PoliciesQuery;
    variables: PoliciesQueryVariables;
  };
  '#graphql\n  query RegularSearch(\n    $country: CountryCode\n    $endCursor: String\n    $first: Int\n    $language: LanguageCode\n    $last: Int\n    $term: String!\n    $startCursor: String\n  ) @inContext(country: $country, language: $language) {\n    articles: search(\n      query: $term,\n      types: [ARTICLE],\n      first: $first,\n    ) {\n      nodes {\n        ...on Article {\n          ...SearchArticle\n        }\n      }\n    }\n    pages: search(\n      query: $term,\n      types: [PAGE],\n      first: $first,\n    ) {\n      nodes {\n        ...on Page {\n          ...SearchPage\n        }\n      }\n    }\n    products: search(\n      after: $endCursor,\n      before: $startCursor,\n      first: $first,\n      last: $last,\n      query: $term,\n      sortKey: RELEVANCE,\n      types: [PRODUCT],\n      unavailableProducts: HIDE,\n    ) {\n      nodes {\n        ...on Product {\n          ...SearchProduct\n        }\n      }\n      pageInfo {\n        ...PageInfoFragment\n      }\n    }\n  }\n  #graphql\n  fragment SearchProduct on Product {\n    __typename\n    trackingParameters\n    ...ProductCard\n  }\n  #graphql\n  fragment ProductCard on Product {\n    id\n    handle\n    title\n    tags\n    availableForSale\n    featuredImage {\n      id\n      altText\n      url\n      width\n      height\n    }\n    images(first: 5) {\n      nodes {\n        id\n        altText\n        url\n        width\n        height\n      }\n    }\n    priceRange {\n      minVariantPrice {\n        ...MoneyFields\n      }\n      maxVariantPrice {\n        ...MoneyFields\n      }\n    }\n  }\n  #graphql\n    fragment MoneyFields on MoneyV2 {\n        amount\n        currencyCode\n    }\n\n\n\n  #graphql\n  fragment SearchPage on Page {\n     __typename\n     handle\n    id\n    title\n    trackingParameters\n  }\n\n  #graphql\n  fragment SearchArticle on Article {\n    __typename\n    handle\n    id\n    title\n    trackingParameters\n  }\n\n  #graphql\n  fragment PageInfoFragment on PageInfo {\n    hasNextPage\n    hasPreviousPage\n    startCursor\n    endCursor\n  }\n\n': {
    return: RegularSearchQuery;
    variables: RegularSearchQueryVariables;
  };
  '#graphql\n  query PredictiveSearch(\n    $country: CountryCode\n    $language: LanguageCode\n    $limit: Int!\n    $limitScope: PredictiveSearchLimitScope!\n    $term: String!\n    $types: [PredictiveSearchType!]\n  ) @inContext(country: $country, language: $language) {\n    predictiveSearch(\n      limit: $limit,\n      limitScope: $limitScope,\n      query: $term,\n      types: $types,\n    ) {\n      articles {\n        ...PredictiveArticle\n      }\n      collections {\n        ...PredictiveCollection\n      }\n      pages {\n        ...PredictivePage\n      }\n      products {\n        ...PredictiveProduct\n      }\n      queries {\n        ...PredictiveQuery\n      }\n    }\n  }\n  #graphql\n  fragment PredictiveArticle on Article {\n    __typename\n    id\n    title\n    handle\n    blog {\n      handle\n    }\n    image {\n      url\n      altText\n      width\n      height\n    }\n    trackingParameters\n  }\n\n  #graphql\n  fragment PredictiveCollection on Collection {\n    __typename\n    id\n    title\n    handle\n    image {\n      url\n      altText\n      width\n      height\n    }\n    trackingParameters\n  }\n\n  #graphql\n  fragment PredictivePage on Page {\n    __typename\n    id\n    title\n    handle\n    trackingParameters\n  }\n\n  #graphql\n  fragment PredictiveProduct on Product {\n    __typename\n    id\n    title\n    handle\n    trackingParameters\n    selectedOrFirstAvailableVariant(\n      selectedOptions: []\n      ignoreUnknownOptions: true\n      caseInsensitiveMatch: true\n    ) {\n      id\n      image {\n        url\n        altText\n        width\n        height\n      }\n      price {\n        amount\n        currencyCode\n      }\n    }\n  }\n\n  #graphql\n  fragment PredictiveQuery on SearchQuerySuggestion {\n    __typename\n    text\n    styledText\n    trackingParameters\n  }\n\n': {
    return: PredictiveSearchQuery;
    variables: PredictiveSearchQueryVariables;
  };
  '#graphql\n  query StoreRobots($country: CountryCode, $language: LanguageCode)\n   @inContext(country: $country, language: $language) {\n    shop {\n      id\n    }\n  }\n': {
    return: StoreRobotsQuery;
    variables: StoreRobotsQueryVariables;
  };
}

interface GeneratedMutationTypes {}

declare module '@shopify/hydrogen' {
  interface StorefrontQueries extends GeneratedQueryTypes {}
  interface StorefrontMutations extends GeneratedMutationTypes {}
}
