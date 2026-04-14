export const ProductBaseFieldsFragment = `#graphql
    fragment ProductBaseFields on Product {
        id
        title
        vendor
        handle
        descriptionHtml
        
        encodedVariantExistence
        encodedVariantAvailability

        adjacentVariants (selectedOptions: $selectedOptions) {
            ...VariantFields
        }

        options {
            name
            optionValues {
                name
                firstSelectableVariant {
                    ...VariantFields
                }
                # ... swatch fields
            }
        }
    }
`;