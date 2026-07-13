import { ProductBaseFieldsFragment } from '~/graphql/fragments/ProductBaseFieldsFragment';
import { ImageFieldsFragment } from '~/graphql/fragments/ImageFieldsFragment';
import { VariantFieldsFragment } from '~/graphql/fragments/VariantFieldsFragment';
import { MoneyFieldsFragment } from '~/graphql/fragments/MoneyFieldsFragment';
import { SkincareProductFragment } from '~/graphql/fragments/SkincareProductFragment';
import { SellingPlanFragments } from '~/graphql/fragments/SellingPlanFragments';

export const ProductByHandleQuery = `#graphql
    query ProductByHandle(
        $handle: String!,
        $selectedOptions: [SelectedOptionInput!]!,
        $country: CountryCode,
        $language: LanguageCode
    ) @inContext(country: $country, language: $language) {
        product(handle: $handle) {
            ...ProductBaseFields
            
            selectedOrFirstAvailableVariant(
                selectedOptions: $selectedOptions, 
                ignoreUnknownOptions: true, 
                caseInsensitiveMatch: true
            ) {
                ...VariantFields
            }

            variants(first: 100) {
                nodes {
                    ...VariantFields
                }
            }

            images(first: 10) {
                nodes { # Switched to nodes for cleaner mapping
                    ...ImageFields
                }
            }

            sellingPlanGroups(first: 10) {
                nodes {
                    ...SellingPlanGroup
                }
            }

            ...SkincareProduct
        }
    }
    ${ProductBaseFieldsFragment}
    ${ImageFieldsFragment}
    ${MoneyFieldsFragment}
    ${VariantFieldsFragment}
    ${SkincareProductFragment}
    ${SellingPlanFragments}
`;

