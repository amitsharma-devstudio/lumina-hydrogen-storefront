import {useEffect, useState} from 'react';
import type {CustomerAddressInput} from '@shopify/hydrogen/customer-account-api-types';
import type {
  AddressFragment,
  CustomerFragment,
} from 'customer-accountapi.generated';
import {
  data,
  Form,
  useActionData,
  useNavigation,
  useOutletContext,
  type Fetcher,
} from 'react-router';
import type {Route} from './+types/($locale).account.addresses';
import {
  UPDATE_ADDRESS_MUTATION,
  DELETE_ADDRESS_MUTATION,
  CREATE_ADDRESS_MUTATION,
} from '~/graphql/customer-account/CustomerAddressMutations';
import {
  AccountSection,
  EditIconButton,
} from '~/components/account/AccountShell';
import {Button} from '~/components/ui/Button';
import {inputFieldClass} from '~/lib/theme';

export type ActionResponse = {
  addressId?: string | null;
  createdAddress?: AddressFragment;
  defaultAddress?: string | null;
  deletedAddress?: string | null;
  error: Record<AddressFragment['id'], string> | null;
  updatedAddress?: AddressFragment;
};

export const meta: Route.MetaFunction = () => {
  return [{title: 'Addresses | Lumina'}];
};

export async function loader({context}: Route.LoaderArgs) {
  context.customerAccount.handleAuthStatus();

  return {};
}

export async function action({request, context}: Route.ActionArgs) {
  const {customerAccount} = context;

  try {
    const form = await request.formData();

    const addressId = form.has('addressId')
      ? String(form.get('addressId'))
      : null;
    if (!addressId) {
      throw new Error('You must provide an address id.');
    }

    const isLoggedIn = await customerAccount.isLoggedIn();
    if (!isLoggedIn) {
      return data(
        {error: {[addressId]: 'Unauthorized'}},
        {
          status: 401,
        },
      );
    }

    const defaultAddress = form.has('defaultAddress')
      ? String(form.get('defaultAddress')) === 'on'
      : false;
    const address: CustomerAddressInput = {};
    const keys: (keyof CustomerAddressInput)[] = [
      'address1',
      'address2',
      'city',
      'company',
      'territoryCode',
      'firstName',
      'lastName',
      'phoneNumber',
      'zoneCode',
      'zip',
    ];

    for (const key of keys) {
      const value = form.get(key);
      if (typeof value === 'string') {
        address[key] = value;
      }
    }

    switch (request.method) {
      case 'POST': {
        try {
          const {data, errors} = await customerAccount.mutate(
            CREATE_ADDRESS_MUTATION,
            {
              variables: {
                address,
                defaultAddress,
                language: customerAccount.i18n.language,
              },
            },
          );

          if (errors?.length) {
            throw new Error(errors[0].message);
          }

          if (data?.customerAddressCreate?.userErrors?.length) {
            throw new Error(data?.customerAddressCreate?.userErrors[0].message);
          }

          if (!data?.customerAddressCreate?.customerAddress) {
            throw new Error('Customer address create failed.');
          }

          return {
            error: null,
            createdAddress: data?.customerAddressCreate?.customerAddress,
            defaultAddress,
          };
        } catch (error: unknown) {
          if (error instanceof Error) {
            return data(
              {error: {[addressId]: error.message}},
              {
                status: 400,
              },
            );
          }
          return data(
            {error: {[addressId]: error}},
            {
              status: 400,
            },
          );
        }
      }

      case 'PUT': {
        try {
          const {data, errors} = await customerAccount.mutate(
            UPDATE_ADDRESS_MUTATION,
            {
              variables: {
                address,
                addressId: decodeURIComponent(addressId),
                defaultAddress,
                language: customerAccount.i18n.language,
              },
            },
          );

          if (errors?.length) {
            throw new Error(errors[0].message);
          }

          if (data?.customerAddressUpdate?.userErrors?.length) {
            throw new Error(data?.customerAddressUpdate?.userErrors[0].message);
          }

          if (!data?.customerAddressUpdate?.customerAddress) {
            throw new Error('Customer address update failed.');
          }

          return {
            error: null,
            updatedAddress: address,
            defaultAddress,
          };
        } catch (error: unknown) {
          if (error instanceof Error) {
            return data(
              {error: {[addressId]: error.message}},
              {
                status: 400,
              },
            );
          }
          return data(
            {error: {[addressId]: error}},
            {
              status: 400,
            },
          );
        }
      }

      case 'DELETE': {
        try {
          const {data, errors} = await customerAccount.mutate(
            DELETE_ADDRESS_MUTATION,
            {
              variables: {
                addressId: decodeURIComponent(addressId),
                language: customerAccount.i18n.language,
              },
            },
          );

          if (errors?.length) {
            throw new Error(errors[0].message);
          }

          if (data?.customerAddressDelete?.userErrors?.length) {
            throw new Error(data?.customerAddressDelete?.userErrors[0].message);
          }

          if (!data?.customerAddressDelete?.deletedAddressId) {
            throw new Error('Customer address delete failed.');
          }

          return {error: null, deletedAddress: addressId};
        } catch (error: unknown) {
          if (error instanceof Error) {
            return data(
              {error: {[addressId]: error.message}},
              {
                status: 400,
              },
            );
          }
          return data(
            {error: {[addressId]: error}},
            {
              status: 400,
            },
          );
        }
      }

      default: {
        return data(
          {error: {[addressId]: 'Method not allowed'}},
          {
            status: 405,
          },
        );
      }
    }
  } catch (error: unknown) {
    if (error instanceof Error) {
      return data(
        {error: error.message},
        {
          status: 400,
        },
      );
    }
    return data(
      {error},
      {
        status: 400,
      },
    );
  }
}

export default function Addresses() {
  const {customer} = useOutletContext<{customer: CustomerFragment}>();
  const {defaultAddress, addresses} = customer;
  const action = useActionData<ActionResponse>();
  const [adding, setAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    if (!action || action.error) return;
    if (action.createdAddress || action.updatedAddress || action.deletedAddress) {
      setAdding(false);
      setEditingId(null);
    }
  }, [action]);

  const hasAddresses = addresses.nodes.length > 0;

  return (
    <AccountSection
      title="Addresses"
      description="Manage shipping addresses for faster checkout."
      action={
        !adding ? (
          <Button
            type="button"
            variant="secondary"
            className="!h-9 !min-h-9 px-4 text-[11px] uppercase tracking-[0.12em]"
            onClick={() => {
              setEditingId(null);
              setAdding(true);
            }}
          >
            Add address
          </Button>
        ) : null
      }
    >
      <div className="space-y-6">
        {adding ? (
          <div className="rounded-xl border border-neutral-200/90 bg-neutral-50/40 p-4 sm:p-5">
            <h3 className="mb-4 text-sm font-medium text-neutral-900">
              New address
            </h3>
            <NewAddressForm onCancel={() => setAdding(false)} />
          </div>
        ) : null}

        {!hasAddresses && !adding ? (
          <p className="text-sm text-neutral-600">
            You have no addresses saved yet. Use Add address to create one.
          </p>
        ) : null}

        {hasAddresses ? (
          <div className="space-y-4">
            {addresses.nodes.map((address) => {
              const isEditing = editingId === address.id;
              const isDefault = defaultAddress?.id === address.id;

              if (isEditing) {
                return (
                  <div
                    key={address.id}
                    className="rounded-xl border border-neutral-200/90 bg-neutral-50/40 p-4 sm:p-5"
                  >
                    <AddressForm
                      addressId={address.id}
                      address={address}
                      defaultAddress={defaultAddress}
                    >
                      {({stateForMethod}) => (
                        <div className="mt-4 flex flex-wrap gap-2">
                          <Button
                            disabled={stateForMethod('PUT') !== 'idle'}
                            formMethod="PUT"
                            type="submit"
                            className="!h-10 !min-h-10 px-5 text-xs"
                          >
                            {stateForMethod('PUT') !== 'idle'
                              ? 'Saving…'
                              : 'Save'}
                          </Button>
                          <Button
                            type="button"
                            variant="secondary"
                            className="!h-10 !min-h-10 px-5 text-xs"
                            onClick={() => setEditingId(null)}
                          >
                            Cancel
                          </Button>
                          <Button
                            variant="secondary"
                            disabled={stateForMethod('DELETE') !== 'idle'}
                            formMethod="DELETE"
                            type="submit"
                            className="!h-10 !min-h-10 px-5 text-xs"
                          >
                            {stateForMethod('DELETE') !== 'idle'
                              ? 'Deleting…'
                              : 'Delete'}
                          </Button>
                        </div>
                      )}
                    </AddressForm>
                  </div>
                );
              }

              return (
                <article
                  key={address.id}
                  className="flex items-start justify-between gap-3 rounded-xl border border-neutral-200/90 bg-white p-4 sm:p-5"
                >
                  <div className="min-w-0 space-y-1 text-sm leading-relaxed text-neutral-700">
                    {isDefault ? (
                      <p className="text-[10px] font-medium uppercase tracking-[0.14em] text-primary">
                        Default
                      </p>
                    ) : null}
                    <p className="font-medium text-neutral-900">
                      {[address.firstName, address.lastName]
                        .filter(Boolean)
                        .join(' ')}
                    </p>
                    {address.company ? <p>{address.company}</p> : null}
                    <p>{address.address1}</p>
                    {address.address2 ? <p>{address.address2}</p> : null}
                    <p>
                      {[address.city, address.zoneCode, address.zip]
                        .filter(Boolean)
                        .join(', ')}
                    </p>
                    {address.territoryCode ? (
                      <p>{address.territoryCode}</p>
                    ) : null}
                    {address.phoneNumber ? (
                      <p className="text-neutral-500">{address.phoneNumber}</p>
                    ) : null}
                  </div>
                  <EditIconButton
                    label="Edit address"
                    onClick={() => {
                      setAdding(false);
                      setEditingId(address.id);
                    }}
                  />
                </article>
              );
            })}
          </div>
        ) : null}
      </div>
    </AccountSection>
  );
}

function NewAddressForm({onCancel}: {onCancel: () => void}) {
  const newAddress = {
    address1: '',
    address2: '',
    city: '',
    company: '',
    territoryCode: '',
    firstName: '',
    id: 'new',
    lastName: '',
    phoneNumber: '',
    zoneCode: '',
    zip: '',
  } as CustomerAddressInput;

  return (
    <AddressForm
      addressId={'NEW_ADDRESS_ID'}
      address={newAddress}
      defaultAddress={null}
    >
      {({stateForMethod}) => (
        <div className="mt-4 flex flex-wrap gap-2">
          <Button
            disabled={stateForMethod('POST') !== 'idle'}
            formMethod="POST"
            type="submit"
            className="!h-10 !min-h-10 px-6 text-xs"
          >
            {stateForMethod('POST') !== 'idle' ? 'Creating…' : 'Save address'}
          </Button>
          <Button
            type="button"
            variant="secondary"
            className="!h-10 !min-h-10 px-6 text-xs"
            onClick={onCancel}
          >
            Cancel
          </Button>
        </div>
      )}
    </AddressForm>
  );
}

export function AddressForm({
  addressId,
  address,
  defaultAddress,
  children,
}: {
  addressId: AddressFragment['id'];
  address: CustomerAddressInput;
  defaultAddress: CustomerFragment['defaultAddress'];
  children: (props: {
    stateForMethod: (method: 'PUT' | 'POST' | 'DELETE') => Fetcher['state'];
  }) => React.ReactNode;
}) {
  const {state, formMethod} = useNavigation();
  const action = useActionData<ActionResponse>();
  const error = action?.error?.[addressId];
  const isDefaultAddress = defaultAddress?.id === addressId;
  return (
    <Form id={addressId} className="space-y-4">
      <fieldset className="grid gap-4 sm:grid-cols-2">
        <input type="hidden" name="addressId" defaultValue={addressId} />
        <div>
          <label
            htmlFor={`${addressId}-firstName`}
            className="mb-2 block text-sm text-neutral-600"
          >
            First name*
          </label>
          <input
            aria-label="First name"
            autoComplete="given-name"
            defaultValue={address?.firstName ?? ''}
            id={`${addressId}-firstName`}
            name="firstName"
            placeholder="First name"
            required
            type="text"
            className={inputFieldClass}
          />
        </div>
        <div>
          <label
            htmlFor={`${addressId}-lastName`}
            className="mb-2 block text-sm text-neutral-600"
          >
            Last name*
          </label>
          <input
            aria-label="Last name"
            autoComplete="family-name"
            defaultValue={address?.lastName ?? ''}
            id={`${addressId}-lastName`}
            name="lastName"
            placeholder="Last name"
            required
            type="text"
            className={inputFieldClass}
          />
        </div>
        <div className="sm:col-span-2">
          <label
            htmlFor={`${addressId}-company`}
            className="mb-2 block text-sm text-neutral-600"
          >
            Company
          </label>
          <input
            aria-label="Company"
            autoComplete="organization"
            defaultValue={address?.company ?? ''}
            id={`${addressId}-company`}
            name="company"
            placeholder="Company"
            type="text"
            className={inputFieldClass}
          />
        </div>
        <div className="sm:col-span-2">
          <label
            htmlFor={`${addressId}-address1`}
            className="mb-2 block text-sm text-neutral-600"
          >
            Address line*
          </label>
          <input
            aria-label="Address line 1"
            autoComplete="address-line1"
            defaultValue={address?.address1 ?? ''}
            id={`${addressId}-address1`}
            name="address1"
            placeholder="Address line 1"
            required
            type="text"
            className={inputFieldClass}
          />
        </div>
        <div className="sm:col-span-2">
          <label
            htmlFor={`${addressId}-address2`}
            className="mb-2 block text-sm text-neutral-600"
          >
            Address line 2
          </label>
          <input
            aria-label="Address line 2"
            autoComplete="address-line2"
            defaultValue={address?.address2 ?? ''}
            id={`${addressId}-address2`}
            name="address2"
            placeholder="Apartment, suite, etc."
            type="text"
            className={inputFieldClass}
          />
        </div>
        <div>
          <label
            htmlFor={`${addressId}-city`}
            className="mb-2 block text-sm text-neutral-600"
          >
            City*
          </label>
          <input
            aria-label="City"
            autoComplete="address-level2"
            defaultValue={address?.city ?? ''}
            id={`${addressId}-city`}
            name="city"
            placeholder="City"
            required
            type="text"
            className={inputFieldClass}
          />
        </div>
        <div>
          <label
            htmlFor={`${addressId}-zoneCode`}
            className="mb-2 block text-sm text-neutral-600"
          >
            State / Province*
          </label>
          <input
            aria-label="State/Province"
            autoComplete="address-level1"
            defaultValue={address?.zoneCode ?? ''}
            id={`${addressId}-zoneCode`}
            name="zoneCode"
            placeholder="State / Province"
            required
            type="text"
            className={inputFieldClass}
          />
        </div>
        <div>
          <label
            htmlFor={`${addressId}-zip`}
            className="mb-2 block text-sm text-neutral-600"
          >
            Zip / Postal code*
          </label>
          <input
            aria-label="Zip"
            autoComplete="postal-code"
            defaultValue={address?.zip ?? ''}
            id={`${addressId}-zip`}
            name="zip"
            placeholder="Zip / Postal code"
            required
            type="text"
            className={inputFieldClass}
          />
        </div>
        <div>
          <label
            htmlFor={`${addressId}-territoryCode`}
            className="mb-2 block text-sm text-neutral-600"
          >
            Country code*
          </label>
          <input
            aria-label="Country code"
            autoComplete="country"
            defaultValue={address?.territoryCode ?? ''}
            id={`${addressId}-territoryCode`}
            name="territoryCode"
            placeholder="US"
            required
            type="text"
            maxLength={2}
            className={inputFieldClass}
          />
        </div>
        <div className="sm:col-span-2">
          <label
            htmlFor={`${addressId}-phoneNumber`}
            className="mb-2 block text-sm text-neutral-600"
          >
            Phone
          </label>
          <input
            aria-label="Phone Number"
            autoComplete="tel"
            defaultValue={address?.phoneNumber ?? ''}
            id={`${addressId}-phoneNumber`}
            name="phoneNumber"
            placeholder="+16135551111"
            pattern="^\+?[1-9]\d{3,14}$"
            type="tel"
            className={inputFieldClass}
          />
        </div>
        <div className="flex items-center gap-2 sm:col-span-2">
          <input
            defaultChecked={isDefaultAddress}
            id={`${addressId}-defaultAddress`}
            name="defaultAddress"
            type="checkbox"
            className="h-4 w-4 rounded border-neutral-300 text-primary focus:ring-primary/30"
          />
          <label
            htmlFor={`${addressId}-defaultAddress`}
            className="text-sm text-neutral-700"
          >
            Set as default address
          </label>
        </div>
        {error ? (
          <p className="sm:col-span-2 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
            {error}
          </p>
        ) : null}
        <div className="sm:col-span-2">
          {children({
            stateForMethod: (method) =>
              formMethod === method ? state : 'idle',
          })}
        </div>
      </fieldset>
    </Form>
  );
}
