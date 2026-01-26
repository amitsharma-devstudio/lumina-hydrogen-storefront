import { Input } from "~/components/ui/Input";
import { Button } from "~/components/ui/Button";

export function Newsletter() {
  return (
    <section className="max-w-4xl mx-auto px-6 text-center">
      <h2 className="text-3xl font-semibold">
        Join the Community
      </h2>
      <p className="mt-4 text-neutral-600">
        Get early access to drops and exclusive offers.
      </p>

      <form className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
        <Input
          type="email"
          placeholder="Enter your email"
          className="px-6 py-3 border rounded-full w-full sm:w-80"
        />
        <Button >
          Subscribe
        </Button>
      </form>
    </section>
  );
}
