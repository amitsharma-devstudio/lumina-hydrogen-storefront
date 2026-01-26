import { Badge } from "~/components/ui/Badge";
import { Button } from "~/components/ui/Button";
import { Image } from "~/components/ui/Image";

export function Hero() {
  return (
    <section className="min-h-screen bg-neutral-50">
      <div className="max-w-7xl mx-auto px-6 py-20 grid grid-cols-1 md:grid-cols-2 gap-16 items-center">

        {/* Left Content */}
        <div>
          <Badge>NEW ARRIVALS</Badge>

          <h1 className="text-5xl md:text-7xl font-bold leading-tight">
            Radiant <br />
            Skin <br />
            Simplified
          </h1>

          <p className="mt-6 text-lg text-neutral-600 max-w-md">
            Science-backed formulations that deliver visible results.
            Experience the luxury of effective skincare.
          </p>

          <div className="mt-10 flex gap-4">
            <Button>
              Shop Now
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M5 12h14" />
                <path d="m12 5 7 7-7 7" />
              </svg>
            </Button>

            <Button variant="secondary">
              Our Story
            </Button>
          </div>
        </div>

        {/* Right Image */}
        <div className="relative">
          <Image
            src="https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800"
            alt="Skincare"
            className="w-full h-[520px] object-cover rounded-3xl"
          />

          <div className="absolute bottom-6 left-6 bg-white px-6 py-4 rounded-2xl shadow-lg">
            <div className="text-sm text-neutral-500">
              Starting from
            </div>
            <div className="text-2xl font-bold">
              $45
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
