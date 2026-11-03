const FACTS = [
  { label: "Education", value: "SMKN 1 Ciomas PPLG (Software Engineering)" },
  { label: "Location", value: "Bogor, Indonesia" },
  { label: "Focus", value: "Frontend & Software Fundamentals" },
  { label: "Interests", value: "Web Development & UI/UX" },
];

function About() {
  return (
    <section id="about" className="border-t border-neutral-900 bg-neutral-950 px-6 py-24 md:py-32">
      <div className="mx-auto grid max-w-6xl gap-x-10 gap-y-10 lg:grid-cols-12">
        <h2 className="font-heading text-4xl font-semibold tracking-tight text-white sm:text-5xl lg:col-span-4">
          About me
        </h2>

        <div className="lg:col-span-8">
          <p className="font-heading text-2xl leading-snug text-neutral-100 sm:text-3xl">
            I'm Muhammad Fathan Ali Khalifah, a Software Engineering student who
            likes turning ideas into clean, modern web apps that are easy to use.
          </p>

          <p className="mt-6 max-w-xl text-base leading-relaxed text-neutral-400">
            Right now I'm building a solid foundation in web development and
            software fundamentals, with a focus on frontend and UI/UX design.
            This portfolio is part of that learning process.
          </p>

          <dl className="mt-14 grid border-t border-neutral-800 sm:grid-cols-2 sm:gap-x-10">
            {FACTS.map((fact) => (
              <div key={fact.label} className="border-b border-neutral-800 py-5">
                <dt className="text-sm text-neutral-500">{fact.label}</dt>
                <dd className="mt-1 text-base font-medium text-neutral-100">{fact.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}

export default About;