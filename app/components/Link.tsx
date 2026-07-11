import type {LinkProps, NavLinkProps} from 'react-router';
import {Link as ReactLink, NavLink as ReactNavLink} from 'react-router';
import {useLocalizedPath, cleanPath, type Locale} from '~/lib/i18n';

type BaseProps = {
  locale?: Locale;
  /** When switching markets, keep the current path under the new prefix. */
  preservePath?: boolean;
};

type LinkVariantProps = BaseProps &
  LinkProps & {
    variant?: never;
  };

type NavLinkVariantProps = BaseProps &
  NavLinkProps & {
    variant: 'nav';
  };

export type ExtendedLinkProps = LinkVariantProps | NavLinkVariantProps;

/**
 * Locale-aware Link — prepends the active market path prefix.
 *
 * @example
 * <Link to="/products">Products</Link>
 * <Link variant="nav" to="/cart">Cart</Link>
 */
export function Link(props: ExtendedLinkProps) {
  const {locale, preservePath = false, variant, ...restProps} = props;
  let to = restProps.to;

  if (variant === 'nav' && typeof to === 'string') {
    if (to.includes('://')) {
      try {
        to = new URL(to).pathname;
      } catch {
        // keep original
      }
    }
    to = cleanPath(to);
  }

  to = useLocalizedPath(to, locale, preservePath);

  if (variant === 'nav') {
    return <ReactNavLink {...(restProps as NavLinkProps)} to={to} />;
  }

  return <ReactLink {...(restProps as LinkProps)} to={to} />;
}
