import {Input} from '~/components/ui/Input';
import {Button} from '~/components/ui/Button';
import {InputGroup} from '~/components/ui/InputGroup';

export function Newsletter() {
  return (
    <section className="mx-auto max-w-4xl px-6 text-center">
      <h2 className="text-3xl font-semibold">Join the Community</h2>
      <p className="mt-4 text-neutral-600">
        Get early access to drops and exclusive offers.
      </p>

      <form className="mx-auto mt-8 flex max-w-md flex-col gap-3 sm:max-w-lg">
        <InputGroup className="flex-col sm:flex-row">
          <Input
            type="email"
            placeholder="Enter your email"
            className="flex-1 rounded-full sm:min-w-0"
            aria-label="Email address"
          />
          <Button type="submit" className="rounded-full px-8">
            Subscribe
          </Button>
        </InputGroup>
      </form>
    </section>
  );
}
